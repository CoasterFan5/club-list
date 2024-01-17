import { prisma } from '$lib/server/prismaConnection';
import { fail } from '@sveltejs/kit';
import { S3 } from '$lib/server/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { bucket, mediaurl } from '$env/static/private';
import crypto from 'crypto';
import { verifySession } from '$lib/server/verifySession';
import { formHandler } from '$lib/bodyguard';
import { z } from 'zod';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

export const actions = {
	updateProfile: formHandler(
		z.object({
			firstName: z.string(),
			lastName: z.string(),
			email: z.string().email()
		}),
		async ({ firstName, lastName, email }, { cookies }) => {
			const user = await verifySession(cookies.get('session'));

			await prisma.user.updateMany({
				where: {
					id: user.id
				},
				data: {
					firstName,
					lastName,
					email
				}
			});

			return { success: true };
		}
	),

	changePassword: formHandler(
		z.object({
			oldPassword: z.string(),
			newPassword: z.string(),
			confirmPassword: z.string()
		}),
		async ({ oldPassword, newPassword, confirmPassword }, { cookies }) => {
			const user = await verifySession(cookies.get('session'), { salt: true, hash: true });

			if (newPassword !== confirmPassword) {
				fail(400, { message: 'Passwords do not match' });
			}

			const hash = (await pbkdf2(oldPassword, user.salt, 1000, 100, 'sha512')).toString('hex');

			if (hash !== user.hash) {
				fail(400, { message: 'Incorrect Password' });
			}

			const newHash = (await pbkdf2(newPassword, user.salt, 1000, 100, 'sha512')).toString('hex');

			await prisma.user.updateMany({
				where: {
					id: user.id
				},
				data: {
					hash: newHash
				}
			});

			return { success: true };
		}
	),

	updatePfp: async ({ request, cookies }) => {
		const user = await verifySession(cookies.get('session'));

		const formData = Object.fromEntries(await request.formData());

		if (!formData.pfp) {
			return {};
		}

		const randomId = Date.now().toString(36) + crypto.randomBytes(32).toString('hex');

		const pfp: File = formData.pfp as File;
		const pfpBuffer = await pfp.arrayBuffer();

		if (pfp.size > 3e6) {
			throw fail(400, { message: 'Max size: 3mb' });
		}

		if (pfp.name.length > 100) {
			throw fail(400, { message: 'File Name Too Long' });
		}

		const key = `${randomId}/${pfp.name}`;

		if (key.length >= 255) {
			throw fail(400, { message: 'File Name Too Long' });
		}

		await S3.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: key,
				Body: new Uint8Array(pfpBuffer)
			})
		);

		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				pfp: `${mediaurl}/${key}`
			}
		});
	}
};

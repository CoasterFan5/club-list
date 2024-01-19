import { PutObjectCommand } from '@aws-sdk/client-s3';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { promisify } from 'util';
import { z } from 'zod';

import { bucket, mediaurl } from '$env/static/private';
import { formHandler } from '$lib/bodyguard';
import { prisma } from '$lib/server/prismaConnection';
import { S3 } from '$lib/server/s3.js';
import { verifySession } from '$lib/server/verifySession';

const pbkdf2 = promisify(crypto.pbkdf2);

export const load = async ({ parent }) => {
	const { user } = await parent();

	if (user == null) {
		throw redirect(303, '/login');
	}

	return {
		user
	};
};

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

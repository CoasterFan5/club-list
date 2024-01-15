import { prisma } from '$lib/server/prismaConnection';
import { fail } from '@sveltejs/kit';
import { S3 } from '$lib/server/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { bucket, mediaurl } from '$env/static/private';
import crypto from 'crypto';
import { verifySession } from '$lib/server/verifySession';

export const actions = {
	updateProfile: async ({ cookies, request }) => {
		const user = await verifySession(cookies.get('session'));

		const formData = await request.formData();
		const firstName = formData.get('firstName')?.toString();
		const lastName = formData.get('firstName')?.toString();
		const email = formData.get('firstName')?.toString();

		if (!firstName || !lastName || !email) {
			return {
				success: false,
				message: 'Missing Fields'
			};
		}

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
	},

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

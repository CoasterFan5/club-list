import { prisma } from '$lib/prismaConnection';
import { fail, redirect } from '@sveltejs/kit';
import { S3 } from '$lib/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { bucket, mediaurl } from '$env/static/private';
import crypto from 'crypto';

export const actions = {
	updateProfile: async ({ request, cookies }) => {
		if (!cookies.get('session')) {
			throw redirect(303, '/login');
		}

		const data = await request.formData();

		const firstName = data.get('firstName')?.toString();
		const lastName = data.get('lastName')?.toString();
		const email = data.get('email')?.toString();

		if (!firstName || firstName == '') {
			return fail(400, { message: 'First name is required' });
		}

		if (!lastName || lastName == '') {
			return fail(400, { message: 'Last name is required' });
		}

		if (!email || email == '') {
			return fail(400, { message: 'Email is required' });
		}

		const session = cookies.get('session');

		await prisma.user.updateMany({
			where: {
				sessions: {
					some: {
						sessionToken: session
					}
				}
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
		const session = cookies.get('session');

		if (!session) {
			throw redirect(303, '/login');
		}

		const sessionCheck = await prisma.session.findUnique({
			where: {
				sessionToken: session
			},
			include: {
				user: true
			}
		});

		if (!sessionCheck || !sessionCheck.user) {
			throw redirect(303, '/login');
		}

		const FormData = Object.fromEntries(await request.formData());

		if (!FormData.pfp) {
			return {};
		}

		const randomId = Date.now().toString(36) + crypto.randomBytes(32).toString('hex');

		try {
			const pfp: File = FormData.pfp as File;
			const pfpBuffer: Buffer = Buffer.from(await pfp.arrayBuffer());

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

			S3.send(
				new PutObjectCommand({
					Bucket: bucket,
					Key: key,
					Body: pfpBuffer
				})
			);

			await prisma.user.update({
				where: {
					id: sessionCheck.user.id
				},
				data: {
					pfp: `${mediaurl}/${key}`
				}
			});
		} catch (e) {
			console.error(e);
		}
	}
};

import { prisma } from '$lib/prismaConnection';
import { fail, redirect } from '@sveltejs/kit';
import { S3 } from '$lib/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { bucket, mediaurl } from '$env/static/private';
import crypto from 'crypto';
import { formHandler } from '$lib/bodyguard.js';
import { z } from 'zod';

export const actions = {
	updateProfile: formHandler(
		z.object({
			firstName: z.string().min(1),
			lastName: z.string().min(1),
			email: z.string().email()
		}),
		async ({ firstName, lastName, email }, { cookies }) => {
			if (!cookies.get('session')) {
				redirect(303, '/login');
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
		}
	),
	updatePfp: async ({ request, cookies }) => {
		const session = cookies.get('session');

		if (!session) {
			redirect(303, '/login');
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
			redirect(303, '/login');
		}

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
	}
};

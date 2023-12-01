import { prisma } from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';
import fs from "fs"
import { S3 } from '$lib/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { bucket } from '$env/static/private';
import crypto from "crypto"

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
	updatePfp:async ({request, cookies}) => {
		const FormData = Object.fromEntries(await request.formData())

		if(!FormData.pfp) {
			return {}
		}

		let randomId = Date.now().toString(36) + crypto.randomBytes(32).toString("hex")

		try {
			let pfp: File = FormData.pfp as File
			let pfpBuffer: Buffer = Buffer.from(await pfp.arrayBuffer())
			
			

			S3.send(
				new PutObjectCommand({
					Bucket: bucket,
					Key: `${randomId}/${pfp.name}`,
					Body: pfpBuffer
				})
			)
		} catch(e) {
			console.log(e)
		}
		
	}
};

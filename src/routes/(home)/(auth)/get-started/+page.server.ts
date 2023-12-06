import { prisma } from '$lib/prismaConnection.js';
import { redirect } from '@sveltejs/kit';
import { promisify } from 'util';
import crypto from 'crypto';

const pkdf2 = promisify(crypto.pbkdf2);

export const actions = {
	register: async ({ request, cookies }) => {
		//get all for the form data
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();
		const password2 = formData.get('confirmPassword')?.toString();
		const firstName = formData.get('firstName')?.toString();
		const lastName = formData.get('lastName')?.toString();

		if (!email || !password || !password2 || !firstName || !lastName) {
			return {
				success: false,
				message: 'Please fill all required fields.'
			};
		}

		if (password != password2) {
			return {
				success: false,
				message: 'Passwords must match!'
			};
		}

		// pull the user from the database
		const newEmail = email.toLowerCase();

		// make sure no user exists with this email
		const userCheck = await prisma.user.findFirst({
			where: {
				email: newEmail
			}
		});

		if (userCheck) {
			return {
				success: false,
				message: 'Email Already Taken'
			};
		}

		//make the user in the database
		const salt = crypto.randomBytes(32).toString('hex');
		const hash = (await pkdf2(password, salt, 1000, 100, 'sha512')).toString('hex');

		const newUser = await prisma.user.create({
			data: {
				createdAt: new Date(Date.now()),
				updatedAt: new Date(Date.now()),
				email: newEmail,
				hash: hash,
				salt: salt,
				firstName,
				lastName
			}
		});

		//generate a new session for the user

		const session = crypto.randomBytes(32).toString('hex');
		await prisma.session.create({
			data: {
				sessionToken: session,
				userId: newUser.id
			}
		});

		cookies.set('session', session, {
			secure: true,
			sameSite: 'strict',
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
		});

		throw redirect(303, '/dashboard');
	}
};

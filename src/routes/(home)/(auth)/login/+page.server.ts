import { prisma } from '$lib/prismaConnection.js';
import { redirect } from '@sveltejs/kit';
import { promisify } from 'util';
import crypto from 'crypto';

const pkdf2 = promisify(crypto.pbkdf2);

export const actions = {
	login: async ({ request, cookies }) => {
		//get all for the form data
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return {
				success: false,
				message: 'Please fill all required fields.'
			};
		}

		//pull the user from the database
		const newEmail = email.toLowerCase();

		const user = await prisma.user.findFirst({
			where: {
				email: newEmail
			}
		});

		if (!user) {
			return {
				success: false,
				message: 'Email or password is incorrect.'
			};
		}

		//get the salt and rehash the password
		const salt = user.salt;
		const hash = (await pkdf2(password, salt, 1000, 100, 'sha512')).toString('hex');

		if (hash != user.hash) {
			return {
				success: false,
				message: 'Email or password is incorrect.'
			};
		}

		//generate a new session for the user

		const session = crypto.randomBytes(32).toString('hex');
		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				session
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

import { prisma } from '$lib/prismaConnection.js';
import { redirect } from '@sveltejs/kit';
import { promisify } from 'util';
import crypto from 'crypto';
import { formHandler } from '$lib/bodyguard.js';
import { z } from 'zod';

const pbkdf2 = promisify(crypto.pbkdf2);

export const actions = {
	login: formHandler(
		z.object({
			email: z.string().email(),
			password: z.string().min(1)
		}),
		async ({ email, password }, { cookies }) => {
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
			const hash = (await pbkdf2(password, salt, 1000, 100, 'sha512')).toString('hex');

			if (hash !== user.hash) {
				return {
					success: false,
					message: 'Email or password is incorrect.'
				};
			}

			//generate a new session for the user

			const session = crypto.randomBytes(32).toString('hex');
			await prisma.session.create({
				data: {
					userId: user.id,
					sessionToken: session
				}
			});

			cookies.set('session', session, {
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				path: '/'
			});

			redirect(303, '/dashboard');
		}
	)
};

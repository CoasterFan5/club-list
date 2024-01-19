import { redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { promisify } from 'util';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createSession } from '$lib/server/createSession.js';
import { prisma } from '$lib/server/prismaConnection.js';

const pbkdf2 = promisify(crypto.pbkdf2);

export const actions = {
	register: formHandler(
		z.object({
			email: z.string().email(),
			password: z.string().min(1),
			confirmPassword: z.string().min(1),
			firstName: z.string().min(1),
			lastName: z.string().min(1)
		}),
		async (
			{ firstName, lastName, password, confirmPassword, email },
			{ cookies, getClientAddress, request }
		) => {
			if (password != confirmPassword) {
				return {
					success: false,
					message: 'Passwords must match!'
				};
			}

			// Pull the user from the database
			const newEmail = email.toLowerCase();

			// Make sure no user exists with this email
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

			// Make the user in the database
			const salt = crypto.randomBytes(32).toString('hex');
			const hash = (await pbkdf2(password, salt, 1000, 100, 'sha512')).toString('hex');

			const newUser = await prisma.user.create({
				data: {
					email: newEmail,
					hash,
					salt,
					firstName,
					lastName
				}
			});

			// Generate a new session for the user]
			await createSession(newUser.id, getClientAddress, request);

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

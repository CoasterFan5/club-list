import { prisma } from '$lib/server/prismaConnection.js';
import { redirect } from '@sveltejs/kit';
import { promisify } from 'util';
import crypto from 'crypto';
import { formHandler } from '$lib/bodyguard.js';
import { z } from 'zod';

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
		async ({ firstName, lastName, password, confirmPassword, email }, { cookies }) => {
			if (password != confirmPassword) {
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

			// generate a new session for the user

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
				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				path: '/'
			});

			redirect(303, '/dashboard');
		}
	)
};

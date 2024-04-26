import { redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { promisify } from 'util';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createSession } from '$lib/server/createSession.js';
import { prisma } from '$lib/server/prismaConnection.js';

import { handleRedirects } from '../redirectHandler';

const pbkdf2 = promisify(crypto.pbkdf2);

export const load = ({ url }) => {
	const code = url.searchParams.get('invite');
	if (code) {
		// Ensure that the invite code is valid
		const regex = /^[a-zA-Z0-9]+$/;
		if (!regex.test(code)) {
			return {
				code: undefined
			};
		}
		return {
			code: code
		};
	}
	return {
		code: undefined
	};
};

export const actions = {
	register: formHandler(
		z.object({
			email: z.string().email(),
			password: z.string().min(1),
			confirmPassword: z.string().min(1),
			firstName: z.string().min(1),
			lastName: z.string().min(1),
			hiddenUrlString: z.string().optional()
		}),
		async (
			{ firstName, lastName, password, confirmPassword, email, hiddenUrlString },
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
			await createSession(newUser.id, getClientAddress, request, cookies);

			if (hiddenUrlString) {
				handleRedirects(new URL(Buffer.from(hiddenUrlString, 'base64').toString()), '/dashboard');
			}

			redirect(303, '/dashboard');
		}
	)
};

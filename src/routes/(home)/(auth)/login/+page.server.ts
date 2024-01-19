import { redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { promisify } from 'util';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createSession } from '$lib/server/createSession';
import { prisma } from '$lib/server/prismaConnection.js';

const pbkdf2 = promisify(crypto.pbkdf2);

export const actions = {
	login: formHandler(
		z.object({
			email: z.string().email(),
			password: z.string().min(1)
		}),
		async ({ email, password }, { cookies, getClientAddress, request }) => {
			// Pull the user from the database
			const user = await prisma.user.findFirst({
				where: {
					email: email.toLowerCase()
				}
			});

			if (!user) {
				return {
					success: false,
					message: 'Email or password is incorrect.'
				};
			}

			// Get the salt and rehash the password
			const salt = user.salt;
			const hash = (await pbkdf2(password, salt, 1000, 100, 'sha512')).toString('hex');

			if (hash !== user.hash) {
				return {
					success: false,
					message: 'Email or password is incorrect.'
				};
			}

			// Generate a new session for the user
			await createSession(user.id, getClientAddress, request, cookies);

			redirect(303, '/dashboard');
		}
	)
};

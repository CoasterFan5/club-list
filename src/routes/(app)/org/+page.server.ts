import { type Actions, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession';

export const load = async ({ parent }) => {
	const { user } = await parent();

	if (user == null) {
		throw redirect(303, '/login');
	}

	return {
		user
	};
};

export const actions = {
	create: formHandler(
		z.object({
			name: z.string().max(50).min(1)
		}),
		async ({ name }, { cookies }) => {
			// Get some basic data
			if (!cookies.get('session')) {
				redirect(303, '/login');
			}

			// Find the user
			const user = await verifySession(cookies.get('session'));

			// We need to know the number of orgs created currently
			const orgAmount = await prisma.organization.count();

			// Make a join code
			// Generates a random code and then appends the org id so its always unique
			// TODO: better join code generation
			const random = Math.round(Math.random() * 324000 + 36000).toString(36);
			const joinString = (orgAmount + 1).toString(36) + random;

			// Make the org
			const org = await prisma.organization.create({
				data: {
					name,
					joinCode: joinString
				}
			});

			// Also make the user an org user
			await prisma.orgUser.create({
				data: {
					userId: user.id,
					organizationId: org.id,
					owner: true
				}
			});

			return {
				success: true,
				message: 'Organization created!'
			};
		}
	),
	join: formHandler(
		z.object({
			joinCode: z.string()
		}),
		async ({ joinCode }, { cookies }) => {
			const user = await verifySession(cookies.get('session'));

			// Search the join code
			const joinCheck = await prisma.organization.findFirst({
				where: {
					joinCode: joinCode
				},
				include: {
					orgUsers: {
						where: {
							userId: user.id
						}
					}
				}
			});

			if (!joinCheck) {
				return {
					success: false,
					message: `Invalid Join Code ${joinCode}`
				};
			}

			const banCheck = await prisma.ban.findFirst({
				where: {
					AND: {
						orgId: joinCheck?.id,
						userId: user.id
					}
				}
			});

			if (banCheck) {
				return {
					success: false,
					message: 'You are banned from this org.'
				};
			}

			if (joinCheck.orgUsers.length > 0) {
				return {
					success: false,
					message: 'You are already in this org!'
				};
			}

			// Create an org user
			await prisma.orgUser.create({
				data: {
					organizationId: joinCheck.id,
					userId: user.id
				}
			});

			return {
				success: true,
				message: 'Joined!'
			};
		}
	)
} satisfies Actions;

import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/prismaConnection';
import { verifySession } from '$lib/verifySession';
import { redirect, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

export const actions = {
	create: formHandler(
		z.object({
			name: z.string().max(50).min(1)
		}),
		async ({ name }, { cookies }) => {
			// get some basic data
			if (!cookies.get('session')) {
				redirect(303, '/login');
			}

			// find the user
			const user = await verifySession(cookies.get('session'));

			//we need to know the number of orgs created currently
			const orgAmount = await prisma.organization.count();

			// make a join code
			// generates a random code and then appends the org id so its always unique
			const random = Math.round(Math.random() * 324000 + 36000).toString(36);
			const joinString = (orgAmount + 1).toString(36) + random;

			// make the org
			const org = await prisma.organization.create({
				data: {
					name,
					ownerId: user.id,
					joinCode: joinString
				}
			});

			// also make the user an org user
			await prisma.orgUser.create({
				data: {
					userId: user.id,
					organizationId: org.id,
					role: 'OWNER'
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

			// search the join code
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
					message: 'Invalid Join Code'
				};
			}

			if (joinCheck.orgUsers.length > 0) {
				return {
					success: false,
					message: 'Already in this org!'
				};
			}

			// create an org user
			await prisma.orgUser.create({
				data: {
					role: 'member',
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

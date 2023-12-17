import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/prismaConnection';
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
			const orgOwnerSession = await prisma.session.findFirst({
				where: {
					sessionToken: cookies.get('session')
				},
				include: {
					user: true
				}
			});
			const orgOwner = orgOwnerSession?.user;

			// make sure we have a user who submitted this!
			if (!orgOwner) {
				redirect(303, '/login');
			}

			//we need to know the number of orgs created currently
			const orgAmount = await prisma.organization.count();

			// make a join code
			// TODO: use crypto.getRandomValues() instead of Math.random()
			const random = Math.round(Math.random() * 324000 + 36000).toString(36);
			const joinString = (orgAmount + 1).toString(36) + random;

			// make the org
			const org = await prisma.organization.create({
				data: {
					name,
					ownerId: orgOwner.id,
					joinCode: joinString
				}
			});

			// also make the user an org user
			await prisma.orgUser.create({
				data: {
					userId: orgOwner.id,
					organizationId: org.id,
					role: 'OWNER'
				}
			});

			return {
				success: true,
				message: 'created!'
			};
		}
	),
	join: formHandler(
		z.object({
			joinCode: z.string()
		}),
		async ({ joinCode }, { cookies }) => {
			if (!cookies.get('session')) {
				redirect(303, '/login');
			}
			const session = cookies.get('session');

			// make sure user is logged in
			const sessionCheck = await prisma.session.findFirst({
				where: {
					sessionToken: session
				},
				include: {
					user: true
				}
			});

			if (!sessionCheck || !sessionCheck.user) {
				redirect(303, '/login');
			}

			// search the join code
			const joinCheck = await prisma.organization.findFirst({
				where: {
					joinCode: joinCode
				},
				include: {
					orgUsers: {
						where: {
							userId: sessionCheck.userId
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
					userId: sessionCheck.user.id
				}
			});

			return {
				success: true,
				message: 'Joined!'
			};
		}
	)
} satisfies Actions;

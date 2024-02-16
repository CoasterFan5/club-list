import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createOrgPermissionsFromUser } from '$lib/permissions/orgPermissions.js';
import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession.js';

export const actions = {
	createClub: formHandler(
		z.object({
			clubName: z.string().max(100).min(1)
		}),
		async ({ clubName }, { cookies, params }) => {
			if (!clubName) {
				return fail(400, {
					message: 'Club name not provided.'
				});
			}

			const user = await verifySession(cookies.get('session'), {
				orgUsers: {
					include: {
						role: true
					}
				}
			});

			// Get the org user
			const org = await prisma.organization.findUnique({
				where: {
					id: parseInt(params.id)
				}
			});

			if (!org) {
				return {
					success: false,
					message: 'How did we even get here?'
				};
			}

			const perms = createOrgPermissionsFromUser(user, org);

			if (!perms.admin && !perms.createClubs) {
				return fail(403, {
					message: 'No Permissions'
				});
			}

			// Create the club
			const club = await prisma.club.create({
				data: {
					name: clubName,
					description: null,
					organizationId: org.id,
					clubUsers: {
						create: [
							{
								userId: user.id,
								owner: true,
								organizationId: org.id
							}
						]
					}
				}
			});

			redirect(303, `/org/${params.id}/club/${club.id}`);
		}
	),
	leaveOrg: async ({ cookies, params }) => {
		const user = await verifySession(cookies.get('session'), {
			orgUsers: {
				where: {
					organizationId: parseInt(params.id)
				}
			}
		});

		if (user.orgUsers[0].owner) {
			return {
				success: false,
				message: 'You cant leave an org you own!'
			};
		}

		await prisma.orgUser.delete({
			where: {
				organizationId_userId: {
					organizationId: user.orgUsers[0].organizationId,
					userId: user.id
				}
			}
		});

		throw redirect(303, '/org');
	}
};

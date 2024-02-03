import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
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

			const user = await verifySession(cookies.get('session'));

			// Get the org user
			const orgUser = await prisma.orgUser.findFirst({
				where: {
					userId: user.id,
					organizationId: parseInt(params.slug)
				}
			});

			if (!orgUser) {
				redirect(303, '/login');
			}

			if (orgUser.role != 'OWNER' && orgUser.role != 'ADMIN') {
				return fail(403, {
					message: 'No Permissions'
				});
			}

			// Create the club
			const club = await prisma.club.create({
				data: {
					name: clubName,
					description: null,
					ownerId: orgUser.userId,
					organizationId: orgUser.organizationId
				}
			});

			redirect(303, `/org/${params.slug}/club/${club.id}`);
		}
	),
	leaveOrg: async ({ cookies, params }) => {
		const user = await verifySession(cookies.get('session'));

		const orgUser = await prisma.orgUser.findFirst({
			where: {
				AND: {
					organization: {
						slug: {
							slug: params.slug
						}
					},
					userId: user.id
				}
			}
		});

		if (!orgUser) {
			return {
				success: false,
				message: 'You are not in this org...'
			};
		}

		if (orgUser.role == 'OWNER') {
			return {
				success: false,
				message: 'You cant leave an org you own!'
			};
		}

		await prisma.orgUser.delete({
			where: {
				organizationId_userId: {
					organizationId: orgUser.organizationId,
					userId: user.id
				}
			}
		});

		throw redirect(303, '/org');
	}
};

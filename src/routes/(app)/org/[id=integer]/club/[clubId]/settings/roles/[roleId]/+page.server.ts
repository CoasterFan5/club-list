import { redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createPermissionsCheck } from '$lib/permissions.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';

export const actions = {
	updateFullRole: formHandler(
		z.object({
			permissionInt: z.coerce.number(),
			name: z.string()
		}),
		async ({ permissionInt, name }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));
			if (!user) {
				throw redirect(303, '/login');
			}

			const club = await prisma.club.findFirst({
				where: {
					id: parseInt(params.clubId)
				},
				include: {
					clubUsers: {
						where: {
							userId: user.id
						},
						include: {
							role: true
						}
					}
				}
			});

			if (club?.ownerId != user.id) {
				if (!club?.clubUsers[0]?.role) {
					return {
						success: false,
						message: 'No permissions'
					};
				}
				const permissionCheck = createPermissionsCheck(club.clubUsers[0].role.permissionInt);
				if (!permissionCheck.admin && !permissionCheck.manageRoles) {
					return {
						success: false,
						message: 'No permissions'
					};
				}
			}

			// Do the update
			await prisma.clubRole.update({
				where: {
					id: parseInt(params.roleId)
				},
				data: {
					permissionInt: permissionInt,
					name
				}
			});

			return {
				success: true,
				message: 'Role updated!'
			};
		}
	)
};

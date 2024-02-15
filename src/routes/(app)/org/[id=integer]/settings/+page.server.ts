import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createOrgPermissionsFromUser } from '$lib/orgPerms.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';

export const actions = {
	updateOrg: formHandler(
		z.object({
			name: z.string().min(1)
		}),
		async ({ name }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'), {
				orgUsers: {
					include: {
						role: true
					}
				}
			});

			const org = await prisma.organization.findUnique({
				where: {
					id: parseInt(params.id)
				}
			})

			if (!org) {
				return {
					success: false,
					message: 'No Org'
				};
			}

			const perms = await createOrgPermissionsFromUser(user, org)

			if (!perms.admin && !perms.updateAppearance) {
				return {
					success: false,
					message: 'No Permissions'
				};
			}

			await prisma.organization.update({
				where: {
					id: org.id
				},
				data: {
					name
				}
			});

			return {
				success: true,
				message: 'Organization Updated!'
			};
		}
	)
};

import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';

export const actions = {
	updateOrg: formHandler(
		z.object({
			name: z.string().min(1)
		}),
		async ({ name }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			const orgUser = await prisma.orgUser.findFirst({
				where: {
					AND: {
						userId: user.id,
						organization: {
							slug: {
								slug: params.slug
							}
						}
					}
				}
			});

			if (!orgUser) {
				return {
					success: false,
					message: 'No Permissions'
				};
			}

			if (orgUser.role != 'ADMIN' && orgUser.role != 'OWNER') {
				return {
					success: false,
					message: 'No Permissions'
				};
			}

			await prisma.organization.update({
				where: {
					id: orgUser.organizationId
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

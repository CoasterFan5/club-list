import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';
import { z } from 'zod';

export const actions = {
	updateOrg: formHandler(
		z.object({
			name: z.string().min(1),
			slug: z
				.string()
				.min(1)
				.max(20)
				.regex(/^[a-z0-9-]+$/i)
				.toLowerCase()
		}),
		async ({ name, slug }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			const orgUser = await prisma.orgUser.findFirst({
				where: {
					AND: {
						userId: user.id,
						organizationId: parseInt(params.id)
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
					name,
					slug: {
						upsert: {
							where: {
								slug
							},
							update: {
								slug
							},
							create: {
								slug
							}
						}
					}
				}
			});

			return {
				success: true,
				message: 'Organization Updated!'
			};
		}
	)
};

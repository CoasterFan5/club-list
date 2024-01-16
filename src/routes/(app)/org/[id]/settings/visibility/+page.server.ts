import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';
import { z } from 'zod';

export const actions = {
	updateVisibility: formHandler(
		z.object({
			slug: z
				.union([
					z
						.string()
						.min(1)
						.max(20)
						.regex(/^[a-z0-9-]+$/i)
						.toLowerCase(),
					z.string().length(0)
				])
				.optional()
				.transform((e) => (e === '' ? undefined : e)),
			public: z.coerce.boolean(),
			discoverable: z.coerce.boolean()
		}),
		async ({ slug }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			const orgUser = await prisma.orgUser.findFirst({
				where: {
					AND: {
						userId: user.id,
						organizationId: parseInt(params.id)
					}
				}
			});

			if (orgUser?.role != 'ADMIN' && orgUser?.role != 'OWNER') {
				return {
					success: false,
					message: 'No Permissions'
				};
			}

			if (slug) {
				await prisma.organization.update({
					where: {
						id: orgUser.organizationId
					},
					data: {
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
			}

			return {
				success: true,
				message: 'Organization Updated!'
			};
		}
	)
};

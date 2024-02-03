import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';

export const actions = {
	refreshJoinCode: async ({ cookies, params }) => {
		await verifySession(cookies.get('session'));

		// TODO: better join code generation
		const orgAmount = await prisma.organization.count();
		const random = Math.round(Math.random() * 324000 + 36000).toString(36);
		const joinString = (orgAmount + 1).toString(36) + random;

		const org = await prisma.organization.findFirst({
			where: {
				slug: {
					slug: params.slug
				}
			}
		});

		if (!org) {
			return {
				success: false,
				message: 'How did we get here'
			};
		}

		await prisma.organization.update({
			where: {
				id: org?.id
			},
			data: {
				joinCode: joinString
			}
		});

		return {
			success: true,
			message: 'Organization Updated!'
		};
	}
};

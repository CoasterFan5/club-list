import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';

export const load = async ({ parent }) => {
	const { org } = await parent();

	const memberCount = await prisma.orgUser.count({
		where: {
			organizationId: org.id
		}
	});

	const eventCount = await prisma.event.count({
		where: {
			club: {
				organizationId: org.id
			}
		}
	});

	return {
		memberCount,
		eventCount
	};
}

export const actions = {
	refreshJoinCode: async ({ cookies, params }) => {
		await verifySession(cookies.get('session'));

		// TODO: better join code generation
		const orgAmount = await prisma.organization.count();
		const random = Math.round(Math.random() * 324000 + 36000).toString(36);
		const joinString = (orgAmount + 1).toString(36) + random;

		await prisma.organization.update({
			where: {
				id: parseInt(params.id)
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

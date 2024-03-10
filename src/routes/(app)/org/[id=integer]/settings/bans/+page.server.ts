import { prisma } from '$lib/server/prismaConnection.js';

export const load = async ({parent}) => {
	const parentData = await parent();

	const bannedMembers = await prisma.ban.findMany({
		where: {
			orgId: parentData.org.id
		},
		include: {
			user: {
				select: {
					firstName: true,
					lastName: true,
					pfp: true
				}
			}
		}
	})

	return {
		bans: bannedMembers
	}
}
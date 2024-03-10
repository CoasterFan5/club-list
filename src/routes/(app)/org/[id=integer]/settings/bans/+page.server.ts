import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { z } from 'zod';

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

export const actions = {
	unbanMember: formHandler(z.object({
		banId: z.coerce.number()
	}), async({banId}, {params, cookies}) => {
		
	})
}
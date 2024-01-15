import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ parent }) => {
	const { user } = await parent();

	const recentAnnouncements = await prisma.announcement.findMany({
		where: {
			club: {
				OR: [
					{
						clubUsers: {
							some: {
								userId: user.id
							}
						}
					},
					{
						ownerId: {
							equals: user.id
						}
					}
				]
			}
		},
		take: 3,
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			author: {
				select: {
					firstName: true,
					lastName: true
				}
			}
		}
	});

	return {
		recentAnnouncements
	};
};

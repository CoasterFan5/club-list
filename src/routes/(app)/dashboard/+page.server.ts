import { prisma } from '$lib/server/prismaConnection';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { user } = await parent();

	if(user == null) {
		redirect(303, "/login")
	}

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

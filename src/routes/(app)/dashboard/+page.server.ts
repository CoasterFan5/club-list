import { redirect } from '@sveltejs/kit';

import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ parent }) => {
	const { user } = await parent();

	if (user == null) {
		redirect(303, '/login');
	}

	const orgs = await prisma.orgUser.findMany({
		where: {
			userId: user.id
		}
	});

	const orgIds = orgs.map((item) => item.organizationId);

	const allClubs = await prisma.club.findMany({
		where: {
			organizationId: {
				in: orgIds
			}
		}
	});

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
		allClubs,
		recentAnnouncements,
		hasOrgs: orgs.length > 0
	};
};

import { redirect } from '@sveltejs/kit';

import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ parent, url }) => {
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

	let allClubs;

	switch (url.searchParams.get('filter')) {
		case 'joinedClubs': {
			allClubs = await prisma.club.findMany({
				where: {
					clubUsers: {
						some: {
							userId: user.id
						}
					}
				}
			});
			break;
		}
		case 'myClubs': {
			allClubs = await prisma.club.findMany({
				where: {
					clubUsers: {
						some: {
							AND: {
								userId: user.id,
								owner: true
							}
						}
					}
				}
			});
			break;
		}

		default: {
			allClubs = await prisma.club.findMany({
				where: {
					organizationId: {
						in: orgIds
					}
				}
			});
			break;
		}
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

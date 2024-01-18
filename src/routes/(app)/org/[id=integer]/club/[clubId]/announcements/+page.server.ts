import { prisma } from '$lib/server/prismaConnection';
import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const parentData = await parent();

	if (!parentData.orgUser && parentData.org.hideSensitive) {
		throw error(404, 'Page disabled');
	}

	const club = await prisma.club.findUnique({
		where: {
			id: parentData.club.id
		},
		include: {
			announcements: {
				include: {
					author: {
						select: {
							firstName: true,
							lastName: true
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			}
		}
	});

	if (club === null) {
		error(500, 'Invalid club ID');
	}

	return {
		announcements: club.announcements
	};
};

import { prisma } from '$lib/prismaConnection';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	const club = await prisma.club.findUnique({
		where: {
			id: parentData.club.id
		},
		include: {
			announcements: {
				include: {
					author: true
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
		announcements: club.announcements.map((announcement) => ({
			...announcement,
			author: announcement.author
				? {
						firstName: announcement.author.firstName,
						lastName: announcement.author.lastName
				  }
				: null
		}))
	};
};

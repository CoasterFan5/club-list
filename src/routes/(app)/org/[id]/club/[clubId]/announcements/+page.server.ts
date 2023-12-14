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
			announcements: true
		}
	});

	if (club === null) {
		throw error(500, 'Invalid club ID');
	}

	return {
		announcements: club.announcements
	};
};

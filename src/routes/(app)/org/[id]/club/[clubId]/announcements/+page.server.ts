import { prisma } from '$lib/prismaConnection';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	//gather together the announcements
	const announcements = await prisma.announcement.findMany({
		where: {
			clubId: parentData.club.id
		},
		orderBy: {
			createdAt: 'asc'
		}
	});

	return {
		announcements
	};
};

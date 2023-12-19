import { prisma } from '$lib/prismaConnection';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const parentData = await parent();

	const roles = await prisma.clubRole.findMany({
		where: {
			clubId: parentData.club.id
		},
		orderBy: {
			id: 'asc'
		}
	});

	return {
		roles
	};
};

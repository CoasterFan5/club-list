import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ parent }) => {
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

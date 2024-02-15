import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ parent }) => {
	const parentData = await parent();

	const roles = await prisma.orgRole.findMany({
		where: {
			orgid: parentData.org.id
		}
	});

	return {
		roles
	};
};

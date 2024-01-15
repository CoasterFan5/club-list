import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ parent }) => {
	const { user } = await parent();

	const orgUsers = await prisma.orgUser.findMany({
		where: {
			userId: user.id
		},
		include: {
			organization: true
		}
	});

	return {
		user: {
			...user,
			orgUsers
		}
	};
};

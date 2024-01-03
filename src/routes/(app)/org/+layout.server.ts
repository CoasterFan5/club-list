import { prisma } from '$lib/prismaConnection';

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
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			pfp: user.pfp,
			orgUsers
		}
	};
};

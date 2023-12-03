import { prisma } from '$lib/db.js';

export const load = async ({ parent }) => {
	const parentData = await parent();

	const orgUsers = await prisma.orgUser.findMany({
		where: {
			userId: parentData.user.id
		},
		include: {
			organization: true
		}
	});

	return {
		user: { ...parentData.user, orgUsers }
	};
};

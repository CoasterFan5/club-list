import { prisma } from '$lib/server/prismaConnection';
import { error } from '@sveltejs/kit';

export const load = async ({ params, parent }) => {
	const orgId = parseInt(params.id);
	const { user } = await parent();

	const org = await prisma.organization.findFirst({
		where: {
			id: orgId
		},
		include: {
			clubs: true,
			orgUsers: {
				where: {
					userId: user.id
				}
			},
			slug: true
		}
	});

	if (!org) {
		throw new Error('Organization not found');
	}

	if (!org.orgUsers || org.orgUsers.length == 0) {
		throw error(400, 'No Known Org');
	}

	return {
		org,
		clubs: org.clubs,
		orgUser: org.orgUsers[0]
	};
};

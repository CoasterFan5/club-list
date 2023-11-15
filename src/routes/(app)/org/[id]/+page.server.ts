import { prisma } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const orgId = parseInt(params.id);
	const {user} = await parent()

	const org = await prisma.organization.findFirst({
		where: {
			id: orgId
		},
		include: {
			clubs: true
		}
	});

	const orgUser = await prisma.orgUser.findFirst({
		where: {
			organizationId: orgId,
			userId: user.id
		}

	})

	if (!org) {
		throw new Error('Organization not found');
	}

	return {
		clubs: org.clubs,
		orgUser: orgUser
	};
};
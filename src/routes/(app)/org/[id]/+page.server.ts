import { prisma } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const orgId = parseInt(params.id);

	const org = await prisma.organization.findFirst({
		where: {
			id: orgId
		},
		include: {
			clubs: true
		}
	});

	if (!org) {
		throw new Error('Organization not found');
	}

	return {
		clubs: org.clubs
	};
};
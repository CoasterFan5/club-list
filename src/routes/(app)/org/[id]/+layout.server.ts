import { prisma } from '$lib/db';
import { error, redirect } from '@sveltejs/kit';
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

	if(!orgUser) {
		throw new Error("Not in this organization")
	}

	if (!org) {
		throw new Error('Organization not found');
	}

	return {
		clubs: org.clubs,
		orgUser: orgUser
	};
};
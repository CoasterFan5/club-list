import { prisma } from '$lib/server/prismaConnection';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, parent }) => {
	const orgId = parseInt(params.id);
	const { user } = await parent();

	const org = await prisma.organization.findFirst({
		where: {
			id: orgId
		},
		include: {
			clubs: true,
			slug: true
		}
	});

	if (!org) {
		throw error(400, 'Organization not found');
	}

	let orgUser;

	if (!org.isPublic) {
		if (user == null) {
			throw redirect(303, '/login');
		}
	}

	if (user) {
		orgUser = await prisma.orgUser.findFirst({
			where: {
				AND: {
					userId: user.id,
					organizationId: org.id
				}
			}
		});
	}

	return {
		org,
		clubs: org.clubs,
		orgUser: orgUser || undefined
	};
};

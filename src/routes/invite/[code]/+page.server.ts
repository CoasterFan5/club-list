import { error } from '@sveltejs/kit';

import { prisma } from '$lib/server/prismaConnection';
import { verifyOptionalSession } from '$lib/server/verifySession.js';

export const load = async ({ params, cookies }) => {
	const user = await verifyOptionalSession(cookies.get('session'));

	const org = await prisma.organization.findFirst({
		where: {
			joinCode: params.code
		},
		select: {
			name: true,
			id: true
		}
	});

	if (org === null) {
		error(404, {
			message: 'Organization not found'
		});
	}

	const isAlreadyMember = user
		? await prisma.orgUser.findFirst({
				where: {
					organizationId: org.id,
					userId: user.id
				}
			})
		: null;

	return {
		joinCode: params.code,
		org,
		isLoggedIn: user !== null,
		isAlreadyMember: isAlreadyMember !== null
	};
};

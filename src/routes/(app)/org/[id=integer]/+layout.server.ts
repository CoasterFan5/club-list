import { error, redirect } from '@sveltejs/kit';

import { createOrgPermissionsCheck } from '$lib/permissions/orgPermissions.js';
import { prisma } from '$lib/server/prismaConnection';

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
	let orgUserPermissions = createOrgPermissionsCheck(0);

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
			},
			include: {
				role: true
			}
		});
		if (orgUser?.owner) {
			orgUserPermissions = createOrgPermissionsCheck(1);
		} else {
			orgUserPermissions = createOrgPermissionsCheck(orgUser?.role?.permissionInt || 0);
		}
	}

	return {
		org,
		clubs: org.clubs,
		orgUser: orgUser || undefined,
		orgUserPermissions
	};
};

import { prisma } from '$lib/server/prismaConnection';
import {
	createPermissionsCheck,
	type PermissionObject,
	defaultClubPermissionObject,
	permissionKeys
} from '$lib/permissions.js';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	// load some data!
	const parentData = await parent();
	const clubId = parseInt(params.clubId);

	const club = await prisma.club.findFirst({
		where: {
			id: clubId
		},
		include: {
			announcements: {
				include: {
					author: {
						select: {
							firstName: true,
							lastName: true,
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			}
		}
	});
	if (!club) {
		error(404, 'Club Not Found');
	}

	const clubUser = await prisma.clubUser.findFirst({
		where: {
			AND: {
				userId: parentData.user.id,
				clubId: club.id
			}
		},
		include: {
			role: true
		}
	});

	const clubPerms: PermissionObject = {
		...defaultClubPermissionObject,
		...createPermissionsCheck(clubUser?.role?.permissionInt ?? 0)
	};

	if (club.ownerId == parentData.user.id) {
		for (const key of permissionKeys) {
			clubPerms[key] = true;
		}
	}

	return {
		club,
		clubPerms,
		clubUser
	};
};

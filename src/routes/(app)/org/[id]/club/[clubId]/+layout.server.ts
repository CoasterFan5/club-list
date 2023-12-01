import { prisma } from '$lib/db';
import {
	ceratePermissionsCheck,
	createPermissionList,
	type PermissionObject
} from '$lib/permissionHelper';
import { defaultClubPermissionObject } from '$lib/permissions';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	//load some data!
	const parentData = await parent();
	const clubId = parseInt(params.clubId);

	const club = await prisma.club.findFirst({
		where: {
			id: clubId
		},
		include: {
			announcements: {
				orderBy: {
					createdAt: 'asc'
				}
			}
		}
	});
	if (!club) {
		throw error(404, 'Club Not Found');
	}

	const clubUser = await prisma.clubUser.findFirst({
		where: {
			AND: {
				userId: parentData.user.id,
				clubId: club.id
			}
		}
	});

	let clubPerms = { ...defaultClubPermissionObject };
	if (clubUser) {
		clubPerms = {
			...defaultClubPermissionObject,
			...ceratePermissionsCheck(
				createPermissionList(defaultClubPermissionObject),
				clubUser.permissions
			)
		};
	}

	if (club.ownerId == parentData.user.id) {
		for (const key of Object.keys(clubPerms)) {
			(clubPerms as PermissionObject)[key] = true;
		}
	}

	return {
		club,
		clubPerms
	};
};

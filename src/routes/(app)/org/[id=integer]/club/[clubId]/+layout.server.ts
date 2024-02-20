import { error } from '@sveltejs/kit';

import { createClubPermissionsFromUser, keys } from '$lib/permissions/clubPermissions.js';
import { createNonePermissionObject } from '$lib/permissions/permissions.js';
import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ params, parent }) => {
	const parentData = await parent();

	const user = parentData.user;

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
							lastName: true
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

	const orgUser = user
		? await prisma.orgUser.findFirst({
				where: {
					AND: {
						userId: user.id,
						organizationId: parseInt(params.id)
					}
				},
				include: {
					role: true
				}
			})
		: null;

	const clubUser = user
		? await prisma.clubUser.findFirst({
				where: {
					AND: {
						userId: user.id,
						clubId: club.id
					}
				},
				include: {
					role: true
				}
			})
		: null;

	const clubPerms =
		user && orgUser
			? createClubPermissionsFromUser(
					{ ...user, clubUsers: clubUser ? [clubUser] : [], orgUsers: orgUser ? [orgUser] : [] },
					club
				)
			: createNonePermissionObject(keys);

	return {
		club,
		clubPerms,
		clubUser: clubUser
	};
};

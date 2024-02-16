import { error } from '@sveltejs/kit';

import { createPermissionsFromUser, defaultClubPermissionObject } from '$lib/permissions.js';
import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ params, parent }) => {
	const { user } = await parent();
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

	const clubPerms = user
		? createPermissionsFromUser({ ...user, clubUsers: clubUser ? [clubUser] : [] }, club)
		: defaultClubPermissionObject;

	return {
		club,
		clubPerms,
		clubUser
	};
};

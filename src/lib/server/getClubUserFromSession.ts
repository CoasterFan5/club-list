import { redirect } from '@sveltejs/kit';

import { createClubPermissionsFromUser } from '$lib/permissions/clubPermissions';

import { prisma } from './prismaConnection';

export const getClubUserFromSession = async (
	session: string | undefined,
	clubId: string | undefined
) => {
	if (!clubId) {
		throw redirect(303, '/dashboard');
	}

	if (!session) {
		throw redirect(303, '/login');
	}

	const club = await prisma.club.findFirst({
		where: {
			id: parseInt(clubId)
		}
	});

	if (!club) {
		throw redirect(303, '/dashboard');
	}

	const user = await prisma.user.findFirst({
		where: {
			sessions: {
				some: {
					sessionToken: session
				}
			}
		},
		include: {
			clubUsers: {
				where: {
					clubId: club.id
				},
				include: {
					role: true
				}
			},
			orgUsers: {
				include: {
					role: true
				}
			}
		}
	});

	if (!user) {
		throw redirect(303, '/login');
	}

	const perms = createClubPermissionsFromUser(user, club);

	return {
		clubUser: user.clubUsers[0],
		perms: perms
	};
};

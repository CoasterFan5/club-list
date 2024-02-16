import { z } from 'zod';

import { formHandler } from '$lib/bodyguard';
import { createOrgPermissionsFromUser } from '$lib/permissions/orgPermissions.js';
import { createClubPermissionsFromUser } from '$lib/permissions/clubPermissions.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';

import type { RouteParams } from './$types.js';

const validateUser = async (session: string | undefined, params: RouteParams) => {
	const user = await verifySession(session, {
		clubUsers: {
			where: {
				clubId: parseInt(params.clubId)
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
	});

	let canTransferOwner = false;

	const club = await prisma.club.findFirst({
		where: {
			id: parseInt(params.clubId)
		}
	});

	const orgPerms = createOrgPermissionsFromUser(user, {
		id: parseInt(params.id)
	});

	if (orgPerms.admin || orgPerms.manageClubs) {
		canTransferOwner = true;
	}
	if (user.clubUsers[0]?.owner) {
		canTransferOwner = true;
	}

	const permissionObj = createClubPermissionsFromUser(user, club);

	if (!permissionObj.admin && !permissionObj.manageMembers) {
		return {
			success: false,
			message: 'No'
		};
	}

	return {
		club,
		user,
		canTransferOwner
	};
};

export const load = async ({ cookies, params }) => {
	const { canTransferOwner } = await validateUser(cookies.get('session'), params);
	const memberData = await prisma.clubUser.findMany({
		where: {
			clubId: parseInt(params.clubId)
		},
		include: {
			role: {
				select: {
					name: true,
					color: true
				}
			},
			user: {
				select: {
					firstName: true,
					lastName: true,
					pfp: true,
					id: true
				}
			}
		},
		orderBy: {
			createdAt: 'asc'
		}
	});

	const roles = await prisma.clubRole.findMany({
		where: {
			clubId: parseInt(params.clubId)
		}
	});

	return {
		memberData,
		roles,
		canTransferOwner
	};
};

export const actions = {
	updateMemberRole: formHandler(
		z.object({
			userId: z.coerce.number(),
			roleId: z.coerce.number()
		}),

		async ({ userId, roleId }, { cookies, params }) => {
			const data = await validateUser(cookies.get('session'), params as RouteParams);
			const club = data?.club;

			if (!club) {
				return {
					success: false,
					message: 'No Club.'
				};
			}

			const role = await prisma.clubRole.findFirst({
				where: {
					AND: {
						id: roleId,
						clubId: club?.id
					}
				}
			});

			await prisma.clubUser.update({
				where: {
					clubId_userId_organizationId: {
						clubId: parseInt(params.clubId),
						organizationId: parseInt(params.id),
						userId
					}
				},
				data: {
					roleId: roleId == -1 ? null : role?.id
				}
			});

			return {
				success: true,
				message: 'User Updated!'
			};
		}
	),
	kickMember: formHandler(
		z.object({
			userId: z.coerce.number()
		}),
		async ({ userId }, { cookies, params }) => {
			const { club } = await validateUser(cookies.get('session'), params as RouteParams);

			if (!club) {
				return {
					success: false,
					message: 'no.'
				};
			}

			const clubUser = await prisma.clubUser.findFirst({
				where: {
					AND: {
						userId: userId,
						clubId: club.id
					}
				}
			});

			if (!clubUser) {
				return {
					success: false,
					message: 'No Club Member exists.'
				};
			}

			if (clubUser.owner) {
				return {
					success: false,
					message: "Can't kick the owner."
				};
			}

			if (clubUser && clubUser.roleId) {
				return {
					success: false,
					message: "Can't kick a member with roles."
				};
			}

			await prisma.clubUser.delete({
				where: {
					clubId_userId_organizationId: {
						clubId: clubUser.clubId,
						userId: clubUser.userId,
						organizationId: clubUser.organizationId
					}
				}
			});

			return {
				success: true,
				message: 'User Kicked'
			};
		}
	),
	transferOwnership: formHandler(
		z.object({
			userId: z.coerce.number()
		}),
		async ({ userId }, { cookies, params }) => {
			const { canTransferOwner, club } = await validateUser(
				cookies.get('session'),
				params as RouteParams
			);
			if (!club) {
				return {
					success: false,
					message: 'Club not found.'
				};
			}

			if (!canTransferOwner) {
				return {
					success: false,
					message: 'No perms to transfer owner.'
				};
			}

			//Update the current user
			await prisma.clubUser.updateMany({
				where: {
					clubId: club.id,
					owner: true
				},
				data: {
					owner: false
				}
			});

			await prisma.clubUser.update({
				where: {
					clubId_userId_organizationId: {
						clubId: club.id,
						userId: userId,
						organizationId: club.organizationId
					}
				},
				data: {
					owner: true
				}
			});
		}
	)
};

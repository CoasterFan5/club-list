import { redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard';
import { createPermissionsCheck } from '$lib/permissions.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';

import type { RouteParams } from './$types.js';

const validateUser = async (session: string | undefined, params: RouteParams) => {
	const user = await verifySession(session);

	const clubUser = await prisma.clubUser.findFirst({
		where: {
			AND: {
				userId: user.id,
				clubId: parseInt(params.clubId)
			}
		},
		include: {
			role: true
		}
	});

	const club = await prisma.club.findFirst({
		where: {
			id: parseInt(params.clubId)
		}
	});

	if (user.id != club?.ownerId) {
		if (!clubUser) {
			throw redirect(303, '/');
		}

		if (!clubUser.role?.permissionInt) {
			throw redirect(303, `/org/${params.id}/club/${params.clubId}`);
		}
		const permissionObj = createPermissionsCheck(clubUser.role.permissionInt);
		if (!permissionObj.admin && !permissionObj.manageMembers) {
			throw redirect(303, `/org/${params.id}/club/${params.clubId}`);
		}
	}

	return {
		club,
		user,
		clubUser
	};
};

export const load = async ({ cookies, params }) => {
	await validateUser(cookies.get('session'), params);
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
		roles
	};
};

export const actions = {
	updateMemberRole: formHandler(
		z.object({
			userId: z.coerce.number(),
			roleId: z.coerce.number()
		}),

		async ({ userId, roleId }, { cookies, params }) => {
			const { club } = await validateUser(cookies.get('session'), params as RouteParams);

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
					message: 'No Club Member exsists.'
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
			const { club, user } = await validateUser(cookies.get('session'), params as RouteParams);
			if (!club) {
				return {
					success: false,
					message: 'no.'
				};
			}

			if(club.ownerId != user.id) {
				return {
					success: false,
					message: "No Permissions"
				}
			}

			await prisma.club.update({
				where: {
					id: club.id
				},
				data: {
					ownerId: userId
				}
			})
		})
	
};

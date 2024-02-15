import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createOrgPermissionsCheck } from '$lib/orgPerms.js';
import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession.js';

export const load = async ({ params }) => {
	const orgUserData = await prisma.orgUser.findMany({
		where: {
			organizationId: parseInt(params.id)
		},
		include: {
			user: true,
			role: true
		}
	});

	const filteredData = orgUserData.map((item) => {
		return {
			user: {
				firstName: item.user.firstName,
				lastName: item.user.lastName,
				pfp: item.user.pfp,
			},
			userId: item.user.id,
			role: item.role,
			owner: item.owner
		};
	});

	return {
		orgUserData: filteredData
	};
};

export const actions = {
	kickMember: formHandler(
		z.object({
			userId: z.coerce.number()
		}),
		async ({ userId }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			if (!params.id) {
				return {
					success: false,
					message: 'No Org.'
				};
			}

			const orgUser = await prisma.orgUser.findFirst({
				where: {
					AND: {
						userId: user.id,
						organizationId: parseInt(params.id)
					}
					
				},
				include: {
					role: true
				}
			});

			

			const permissions = await createOrgPermissionsCheck(orgUser?.role?.permissionInt || 0)

			if (!orgUser?.owner && !permissions.kickMembers && !permissions.admin) {
				return {
					success: false,
					message: 'No Perms'
				};
			}

			const toDelete = await prisma.orgUser.findUnique({
				where: {
					organizationId_userId: {
						organizationId: parseInt(params.id),
						userId: userId
					}
				}
			});

			if (!toDelete) {
				return {
					success: false,
					message: 'No User Exists'
				};
			}

			if (toDelete.owner || toDelete.roleId) {
				return {
					success: false,
					message: 'Can not kick owner or someone with roles.'
				};
			}

			const deletedUser = await prisma.orgUser.delete({
				where: {
					organizationId_userId: {
						organizationId: parseInt(params.id),
						userId: userId
					}
				}
			});

			if (!deletedUser) {
				return {
					success: false,
					message: 'Could not remove user.'
				};
			}

			return {
				success: true,
				message: 'User removed'
			};
		}
	),
	banMember: formHandler(
		z.object({
			userId: z.coerce.number(),
			reason: z.string().optional()
		}),
		async ({ userId, reason }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			const orgUser = await prisma.orgUser.findFirst({
				where: {
					AND: {
						userId: user.id,
						organizationId: parseInt(params.id)
					}
				},
				include: {
					role: true
				}
			});

			const permission = createOrgPermissionsCheck(orgUser?.role?.permissionInt || 0)

			if (!orgUser?.owner && !permission.banMembers && !permission.admin) {
				return {
					success: false,
					message: 'No Perms'
				};
			}

			const toBan = await prisma.orgUser.findUnique({
				where: {
					organizationId_userId: {
						organizationId: parseInt(params.id),
						userId: userId
					}
				}
			});

			if (!toBan) {
				return {
					success: false,
					message: 'No User Exists'
				};
			}

			if (toBan.roleId || toBan.owner) {
				return {
					success: false,
					message: 'Can not ban anyone with roles or an owner.'
				};
			}

			const ban = await prisma.ban.create({
				data: {
					userId: toBan.userId,
					orgId: toBan.organizationId,
					reason
				}
			});

			await prisma.orgUser.delete({
				where: {
					organizationId_userId: {
						organizationId: toBan.organizationId,
						userId: toBan.userId
					}
				}
			});

			if (!ban) {
				return {
					success: false,
					message: 'Could not remove user.'
				};
			}

			return {
				success: true,
				message: 'User banned.'
			};
		}
	)
};

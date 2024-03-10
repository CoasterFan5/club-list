import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createOrgPermissionsFromUser } from '$lib/permissions/orgPermissions.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';

export const load = async ({ parent }) => {
	const parentData = await parent();

	const bannedMembers = await prisma.ban.findMany({
		where: {
			orgId: parentData.org.id
		},
		include: {
			user: {
				select: {
					firstName: true,
					lastName: true,
					pfp: true
				}
			}
		},
		orderBy: {
			createdAt: 'asc'
		}
	});

	return {
		bans: bannedMembers
	};
};

export const actions = {
	unbanMember: formHandler(
		z.object({
			banId: z.coerce.number()
		}),
		async ({ banId }, { params, cookies }) => {
			const org = await prisma.organization.findFirst({
				where: {
					id: parseInt(params.id)
				}
			});

			if (!org) {
				return {
					success: false,
					message: 'No org'
				};
			}

			const user = await verifySession(cookies.get('session'), {
				orgUsers: {
					where: {
						organizationId: org.id
					},
					include: {
						role: true
					}
				}
			});

			const perms = createOrgPermissionsFromUser(user, org);

			if (!perms.admin && !perms.banMembers) {
				return {
					success: false,
					message: 'No perms'
				};
			}

			const banCheck = await prisma.ban.findFirst({
				where: {
					AND: {
						id: banId,
						orgId: org.id
					}
				}
			});

			if (!banCheck) {
				return {
					success: false,
					message: 'No ban exists'
				};
			}

			await prisma.ban.delete({
				where: {
					id: banCheck.id
				}
			});

			return {
				success: true,
				message: 'Member Unbanned'
			};
		}
	)
};

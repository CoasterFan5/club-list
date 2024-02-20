import { redirect } from '@sveltejs/kit';

import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';
import { createPermissionsCheck } from '$lib/permissions/permissions.js';
import { createOrgPermissionsFromUser } from '$lib/permissions/orgPermissions.js';

export const load = async ({ parent }) => {
	const { org } = await parent();

	const memberCount = await prisma.orgUser.count({
		where: {
			organizationId: org.id
		}
	});

	const eventCount = await prisma.event.count({
		where: {
			club: {
				organizationId: org.id
			}
		}
	});

	return {
		memberCount,
		eventCount
	};
};

export const actions = {
	refreshJoinCode: async ({ cookies, params }) => {
		const user = await verifySession(cookies.get('session'), {
			orgUsers: {
				include: {
					role: true
				}
			}
		});
		const org = await prisma.organization.findFirst({
			where: {
				id: parseInt(params.id),
			}
		})

		const perms = createOrgPermissionsFromUser(user, org)

		if(!perms.admin) {
			return {
				success: false,
				message: "Only admins can refresh join code."
			}
		}

		

		// TODO: better join code generation
		const orgAmount = await prisma.organization.count();
		const random = Math.round(Math.random() * 324000 + 36000).toString(36);
		const joinString = (orgAmount + 1).toString(36) + random;

		await prisma.organization.update({
			where: {
				id: parseInt(params.id)
			},
			data: {
				joinCode: joinString
			}
		});

		return {
			success: true,
			message: 'Organization Updated!'
		};
	},
	deleteOrg: async ({ cookies, params }) => {
		const user = await verifySession(cookies.get('session'));
		const orgUser = await prisma.orgUser.findFirst({
			where: {
				AND: {
					organizationId: parseInt(params.id),
					userId: user.id
				} 
			}
		})

		if(!orgUser?.owner) {
			return {
				success: false,
				message: "Only an owner can delete an organization."
			}
		}

		await prisma.organization.delete({
			where: {
				id: parseInt(params.id)
			}
		});

		redirect(303, '/dashboard');
	}
};

import type { Cookies } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createOrgPermissionsFromUser } from '$lib/orgPerms.js';
import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession.js';

import type { RouteParams } from './$types.js';

//User validation code
const ensurePermissions = async (cookies: Cookies, params: RouteParams) => {
	const org = await prisma.organization.findUnique({
		where: {
			id: parseInt(params.id)
		}
	})

	const user = await verifySession(cookies.get("session"), {
		orgUsers: {
			include: {
				role: true
			},
			where: {
				organizationId: org?.id
			}
		}
	})

	
	return {
		perms: createOrgPermissionsFromUser(user, org),
		org: org
	}
	

}

export const load = async ({ parent }) => {
	const parentData = await parent();

	const roles = await prisma.orgRole.findMany({
		where: {
			orgid: parentData.org.id
		},
		orderBy: {
			id: "asc"
		}
	});

	return {
		roles
	};
};

export const actions = {
	createRole: async ({cookies, params}) => {

		const {perms, org} = await ensurePermissions(cookies, params)

		if(!org) {
			return {
				success: false,
				message: "No Org"
			}
		}

		if(!perms.admin && !perms.manageRoles) {
			return {
				success: false,
				message: "No Permissions"
			}
		}

		await prisma.orgRole.create({
			data: {
				name: "New Role",
				permissionInt: 0,
				color: "#dbdbdb",
				orgid: org?.id
			}
		})

		return {
			success: true,
			message: "Role Created!"
		}
		
		

	},
	updateRole: formHandler(z.object({
		roleId: z.coerce.number(),
		name: z.string().min(1).max(128),
		color: z.string()
	}), async ({roleId, name, color}, {cookies, params}) => {
		
		const {perms, org} = await ensurePermissions(cookies, params)

		if(!org) {
			return {
				success: false,
				message: "No org"
			}
		}

		const role = await prisma.orgRole.findFirst({
			where: {
				AND: {
					id: roleId,
					orgid: org.id
				}
			}
		})

		if(!role) {
			return {
				success: false,
				message: "No Role."
			}
		}

		if(!perms.admin && !perms.manageRoles) {
			return {
				success: false,
				message: "No Perms"
			}
		}

		await prisma.orgRole.update({
			where: {
				id: role.id
			},
			data: {
				name: name,
				color
			}
		})

	})
	
}

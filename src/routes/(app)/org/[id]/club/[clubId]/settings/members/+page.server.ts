import { formHandler } from '$lib/bodyguard'
import { createPermissionsCheck } from '$lib/permissions.js'
import { prisma } from '$lib/prismaConnection.js'
import { verifySession } from '$lib/verifySession.js'
import { redirect } from '@sveltejs/kit'
import { z } from 'zod'
import type { RouteParams } from './$types.js'

const validateUser = async (session: string | undefined, params: RouteParams) => {
	const user = await verifySession(session)

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
	})

	const club = await prisma.club.findFirst({
		where: {
			id: parseInt(params.clubId)
		}
	})

	

	if(user.id != club?.ownerId) {
		if(!clubUser) {
			throw redirect(303, "/")
		}

		if(!clubUser.role?.permissionInt) {
			throw redirect(303, `/org/${params.id}/club/${params.clubId}`)
		}
		const permissionObj = createPermissionsCheck(clubUser.role.permissionInt)
		if(!permissionObj.admin && !permissionObj.manageMembers) {
			throw redirect(303, `/org/${params.id}/club/${params.clubId}`)
		}
	}
}

export const load = async ({cookies, params}) => {

	await validateUser(cookies.get('session'), params)
	//all good
	const memberData = await prisma.clubUser.findMany({
		where: {
			clubId: parseInt(params.clubId)
		},
		include: {
			role: true,
			user: true
		},
		orderBy: {
			id: "asc"
		}
	})

	const filteredMemberData = memberData.map((item) => {
		return {
			clubUserId: item.id,
			firstName: item.user.firstName,
			lastName: item.user.lastName,
			pfp: item.user.pfp,
			role: {
				hasRole: item.role != null,
				name: item.role?.name,
				color: item.role?.color,
			}
		}
	})

	const roles = await prisma.clubRole.findMany({
		where: {
			clubId: parseInt(params.clubId)
		}
	})

	return {
		memberData: filteredMemberData,
		roles
	}

}

export const actions = {
	updateMemberRole: formHandler(z.object({
			userId: z.coerce.number(),
			roleId: z.coerce.number()
		}), async ({userId, roleId}, {cookies, params}) => {
	
		await validateUser(cookies.get('session'), params as RouteParams)

		//all good to do the action
		await prisma.clubUser.update({
			where: {
				id: userId
			},
			data: {
				roleId: roleId
			}
		})

		return {
			success: true,
			message: "User Updated!"
		}
	})
}
import { redirect } from "@sveltejs/kit"
import type { PageParentData, PageServerLoad } from "./$types"
import { prisma } from "$lib/prismaConnection"
import { ceratePermissionsCheck, createPermissionList } from "$lib/permissionHelper"
import { defaultClubPermissionObject } from "$lib/permissions"

export const load: PageServerLoad = async ({cookies, params, parent}) => {

	const parentData: PageParentData = await parent()
	const clubId = params.clubId
	const orgId = params.id
	const session = cookies.get("session")
	const baseUrl = `/org/${orgId}/club/${clubId}`

	if(!parentData.clubPerms.admin && !parentData.clubPerms.manageAnnoucements && parentData.club.ownerId != parentData.user.id) {
		throw redirect(303, baseUrl)
	}
}
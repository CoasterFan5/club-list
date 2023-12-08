//get all the club roles
import { prisma } from "$lib/prismaConnection"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({parent}) => {
	const parentData = await parent()

	const roles = await prisma.clubRole.findMany({
		where: {
			clubId: parentData.club.id
		}
	})
	return {
		roles
	}
}
import { prisma } from "$lib/server/prismaConnection"
import { verifySession } from "$lib/server/verifySession"

export const load = async ({cookies}) => {

	const user = await verifySession(cookies.get("session"))

	const events = await prisma.event.findMany({
		where: {
			club: {
				clubUsers: {
					some: {
						userId: user.id
					}
				}
			}
		}
	})

	return {
		events
	}
}
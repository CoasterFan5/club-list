import { prisma } from "$lib/prismaConnection";
import type { PageServerLoad } from "./$types";


export let load: PageServerLoad = async ({parent}) => {

	const parentData = await parent();

	//gather together the announcments
	let announcements = await prisma.announcement.findMany({
		where: {
			clubId: parentData.club.id
		}
	})

	return {
		announcements
	}
	
}
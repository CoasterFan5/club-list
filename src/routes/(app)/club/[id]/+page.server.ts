import { prisma } from '$lib/db';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';


type DataUpdateObject = {
	imageURL?: string
	name?: string
};

export const load: PageServerLoad = async ({ params }) => {
	const clubId = parseInt(params.id);

	const club = await prisma.club.findFirst({
		where: {
			id: clubId
		}
	});

	if (!club) {
		throw error(404, "Club Not Found")
	}

	return {
		club
	};
};

export let actions = {
	updateClub: async ({cookies, request, params}) => {
		let formData = await request.formData();
		let imageURL = formData.get("imageURL")?.toString()
		let clubName = formData.get("clubName")?.toString()


		let dataUpdateObject: DataUpdateObject = {};
		if(imageURL) {
			dataUpdateObject.imageURL = imageURL
		}
		if(clubName) {
			dataUpdateObject.name = clubName
		}

		//ensure the user is actually allowed to edit this thing
		const session = cookies.get("session")
		if(!session) {
			throw redirect(303, "/login")
		}
		const sessionCheck = await prisma.session.findFirst({
			where: {
				sessionToken: session
			},
			include: {
				user: {
					include: {
						orgUsers: {
							where: {
								organizationId: parseInt(params.id)
							},
						}
					}
				}
			}
		})
		if(!sessionCheck || !sessionCheck.user || !sessionCheck.user.orgUsers || (sessionCheck.user.orgUsers[0].role != "OWNER" && sessionCheck.user.orgUsers[0].role != "ADMIN") ) {
			return error(500, "No Permissions")
		}

		let id = parseInt(params.id);
		if(!id || Number.isNaN(id)) {
			throw error(500, "Invalid Club Id")
		}

		//update the thing
		let update = await prisma.club.update({
			where: {
				id: parseInt(params.id)
			},
			data: dataUpdateObject
		})

		
	}
}

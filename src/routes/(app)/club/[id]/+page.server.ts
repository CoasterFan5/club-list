import { prisma } from '$lib/db';
import { ceratePermissionsCheck, createPermissionList, createPermissions } from '$lib/permissionHelper';
import { defaultClubPermissionObject } from '$lib/permissions';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';


type DataUpdateObject = {
	imageURL?: string
	name?: string
};

export const load: PageServerLoad = async ({ params, cookies }) => {
	//load some data!
	const session = cookies.get('session')
	const clubId = parseInt(params.id);

	const club = await prisma.club.findFirst({
		where: {
			id: clubId
		}
	});

	if (!club) {
		throw error(404, "Club Not Found")
	}

	let permissionObject = ceratePermissionsCheck(createPermissionList(defaultClubPermissionObject), club.clubUsers[0].permissions)

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
						clubs: {
							where: {
								id: parseInt(params.id)
							},
							
						}
					}
				}
			}
		})
		if(!sessionCheck || !sessionCheck.user) {
			throw redirect(303, "/login")
		}

		let id = parseInt(params.id);
		if(!id || Number.isNaN(id)) {
			throw error(500, "Invalid Club Id")
		}

		//check for permissions
		const club = await prisma.club.findFirst({
			where: {
				id: id
			},
			include: {
				clubUsers: {
					where: {
						id: sessionCheck.user.id
					}
				}
			}
		})

		if(!club) {
			throw error(500, "Invalid Club Id")
		}

		if(club.ownerId != sessionCheck.user.id) {
			//check if the user has permissions
			if(!club.clubUsers) {
				throw error(500, "No Permissions")
			}
			let permissionObject = ceratePermissionsCheck(createPermissionList(defaultClubPermissionObject), club.clubUsers[0].permissions)
			if(!permissionObject.admin && !permissionObject.updateAppearance) {
				throw error(500, "No Permissions")
			}
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

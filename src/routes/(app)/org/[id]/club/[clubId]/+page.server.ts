import { prisma } from '$lib/db';
import { ceratePermissionsCheck, createPermissionList, createPermissions, type PermissionObject } from '$lib/permissionHelper';
import { defaultClubPermissionObject } from '$lib/permissions';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';


type DataUpdateObject = {
	imageURL?: string
	name?: string
	description?: string
};

export const load: PageServerLoad = async ({ params, cookies, parent }) => {
	//load some data!
	const parentData = await parent();
	const clubId = parseInt(params.clubId);

	const club = await prisma.club.findFirst({
		where: {
			id: clubId
		}
	});
	if (!club) {
		throw error(404, "Club Not Found")
	}

	const clubUser = await prisma.clubUser.findFirst({
		where: {
			AND: {
				userId: parentData.user.id,
				clubId: club.id
			}
		}
	})

	let clubPerms = {...defaultClubPermissionObject}
	console.log("defaultPerms")
	console.log(clubPerms)
	if(clubUser) {
		console.log(clubUser)
		console.log(ceratePermissionsCheck(createPermissionList(defaultClubPermissionObject), clubUser.permissions))
		clubPerms = {...defaultClubPermissionObject, ...ceratePermissionsCheck(createPermissionList(defaultClubPermissionObject), clubUser.permissions)}
	}
	console.log(club.ownerId == parentData.user.id)
	if(club.ownerId == parentData.user.id) {
		for(const key of Object.keys(clubPerms)) {
			(clubPerms as PermissionObject)[key] = true;
		}
	}

	

	return {
		club,
		clubPerms
	};
};

export let actions = {
	updateClub: async ({cookies, request, params}) => {
		let formData = await request.formData();
		let imageURL = formData.get("imageURL")?.toString()
		let clubName = formData.get("clubName")?.toString()
		let clubDescription = formData.get("clubDescription")?.toString();


		let dataUpdateObject: DataUpdateObject = {};
		if(imageURL) {
			dataUpdateObject.imageURL = imageURL
		}
		if(clubName) {
			dataUpdateObject.name = clubName
		}
		if(clubDescription) {
			dataUpdateObject.description = clubDescription
		}

		console.log(dataUpdateObject)

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
								id: parseInt(params.clubId)
							},
							
						}
					}
				}
			}
		})
		if(!sessionCheck || !sessionCheck.user) {
			throw redirect(303, "/login")
		}

		let id = parseInt(params.clubId);
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
				id: parseInt(params.clubId)
			},
			data: dataUpdateObject
		})

		
	}
}

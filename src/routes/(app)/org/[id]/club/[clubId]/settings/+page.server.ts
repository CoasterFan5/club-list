import {
	createPermissionsCheck,
	type PermissionObject,
	defaultClubPermissionObject,
	permissionKeys
} from '$lib/permissions.js';
import { prisma } from '$lib/prismaConnection.js';
import { verifySession } from '$lib/verifySession';



export const actions = {
	updateClub: async ({ cookies, params, request }) => {

			const user = await verifySession(cookies.get("session"))
			 

			const formData = await request.formData();

			const clubName = formData.get("clubName")?.toString()
			const imgURL = formData.get("imgURL")?.toString()
	
			if (!clubName) {
				return {
					success: false,
					message: 'Must specify a club name'
				};
			}

			const club = await prisma.club.findFirst({
				where: {
					id: parseInt(params.clubId)
				}
			});

			if (!club) {
				return {
					success: false,
					message: 'how did we get here'
				};
			}

			const clubUser = await prisma.clubUser.findFirst({
				where: {
					AND: {
						clubId: parseInt(params.clubId),
						userId: user.id,
					},
				},
				include: {
					role: true
				}
			})

		

			// Make sure this user is signed in
			let userPermission: PermissionObject = { ...defaultClubPermissionObject };

			if (clubUser) {
				userPermission = {
					...defaultClubPermissionObject,
					...createPermissionsCheck(clubUser.role?.permissionInt ?? 0)
				};
			} else if (club.ownerId == user.id) {
				for (const key of permissionKeys) {
					userPermission[key] = true;
				}
			}

			if (!userPermission.admin && !userPermission.updateAppearance) {
				return {
					success: false,
					message: 'No Permissions'
				};
			}

			type ClubDataObject = {
				name: string;
				imageURL?: string;
			};

			const dataObject: ClubDataObject = {
				name: clubName
			};

			if (imgURL) {
				dataObject.imageURL = imgURL;
			}

			// Now, we can update the club
			await prisma.club.update({
				where: {
					id: parseInt(params.clubId)
				},
				data: dataObject
			});

			return {
				success: true,
				message: 'success!'
			};
		}
	
}

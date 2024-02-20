import { redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createClubPermissionsFromUser } from '$lib/permissions/clubPermissions.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession';

export const load = async ({ parent, params }) => {
	const parentData = await parent();

	if (!parentData.clubPerms.viewSettings && !parentData.clubPerms.admin) {
		throw redirect(303, `/org/${params.id}/club/${params.clubId}`);
	}
};

export const actions = {
	updateClub: formHandler(
		z.object({
			clubName: z.string().min(1),
			imgURL: z.string(),
			joinable: z.coerce.boolean()
		}),
		async ({ clubName, imgURL, joinable }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'), {
				clubUsers: {
					select: {
						owner: true,
						clubId: true,
						role: {
							select: {
								permissionInt: true
							}
						}
					}
				},
				orgUsers: {
					include: {
						role: true
					}
				}
			});

			const club = await prisma.club.findFirst({
				where: {
					id: parseInt(params.clubId)
				}
			});

			if (!club) {
				return {
					success: false,
					message: 'Club not found'
				};
			}

			const userPermission = createClubPermissionsFromUser(user, club);

			if (!userPermission.admin && !userPermission.updateAppearance) {
				return {
					success: false,
					message: 'No Permissions'
				};
			}

			type ClubDataObject = {
				name: string;
				imageURL?: string;
				openToJoin: boolean;
			};

			const dataObject: ClubDataObject = {
				name: clubName,
				openToJoin: joinable
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
				message: 'Club Settings Updated!'
			};
		}
	),
	deleteClub: async ({cookies, params}) => {

		const club = await prisma.club.findUnique({
			where: {
				id: parseInt(params.clubId)
			}
		})

		if(!club) {
			return {
				success: false,
				message: "No Club"
			}
		}

		const user = await verifySession(cookies.get("session"), {
			clubUsers: {
				where: {
					clubId: club.id
				}
			}
		})

		if(!user?.clubUsers[0]?.owner) {
			return {
				success: false,
				message: "Only owner can delete club"
			}
		}

		await prisma.club.delete({
			where: {
				id: club.id
			}
		})

		return {
			success: true,
			message: "Club Deleted"
		}
	}
};

import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createPermissionsFromUser } from '$lib/permissions.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession';

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
						clubId: true,
						role: {
							select: {
								permissionInt: true
							}
						}
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

			const userPermission = createPermissionsFromUser(user, club);

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
	)
};

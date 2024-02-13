import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard';
import { createPermissionsFromUser } from '$lib/permissions.js';
import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession.js';

type DataUpdateObject = {
	imageURL?: string;
	name?: string;
	description?: string;
};

export const actions = {
	updateClub: formHandler(
		z.object({
			imageURL: z.string().optional(),
			clubName: z.string().optional(),
			clubDescription: z.string().optional()
		}),
		async ({ imageURL, clubName, clubDescription }, { cookies, params }) => {
			const dataUpdateObject: DataUpdateObject = {};
			if (imageURL) {
				dataUpdateObject.imageURL = imageURL;
			}
			if (clubName) {
				dataUpdateObject.name = clubName;
			}
			if (clubDescription) {
				dataUpdateObject.description = clubDescription;
			}

			// Ensure the user is actually allowed to edit this thing
			const session = cookies.get('session');
			if (!session) {
				redirect(303, '/login');
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
								}
							},
							clubUsers: {
								where: {
									clubId: parseInt(params.clubId)
								},
								include: {
									role: true
								}
							}
						}
					}
				}
			});
			if (!sessionCheck || !sessionCheck.user) {
				redirect(303, '/login');
			}

			const id = parseInt(params.clubId);
			if (!id || Number.isNaN(id)) {
				error(500, 'Invalid Club Id');
			}

			// Check for permissions
			const club = await prisma.club.findFirst({
				where: {
					id: id
				},
				include: {
					clubUsers: {
						where: {
							userId: sessionCheck.user.id
						},
						include: {
							role: true
						}
					}
				}
			});

			if (!club) {
				return {
					success: false,
					message: 'Club not found'
				};
			}

			const permissionObject = createPermissionsFromUser(sessionCheck.user, club);

			if (!permissionObject.admin && !permissionObject.updateAppearance) {
				return {
					success: false,
					message: 'No Permissions'
				};
			}

			// Update the club
			await prisma.club.update({
				where: {
					id: parseInt(params.clubId)
				},
				data: dataUpdateObject
			});

			return {
				success: true,
				message: 'Club Updated!'
			};
		}
	),

	joinClub: async ({ cookies, params }) => {
		// Get the user
		const user = await verifySession(cookies.get('session'), {
			clubUsers: true
		});

		// Get the club id
		const clubId = parseInt(params.clubId);

		if (user.clubUsers.length > 0) {
			return {
				success: false,
				message: 'You are already in this club!'
			};
		}

		const club = await prisma.club.findUnique({
			where: {
				id: clubId
			}
		});

		if (!club?.openToJoin) {
			return {
				success: false,
				message: "you can't join this club!"
			};
		}

		// Now we can create the club user
		await prisma.clubUser.create({
			data: {
				clubId: club.id,
				organizationId: parseInt(params.id),
				userId: user.id
			}
		});

		return {
			success: true,
			message: 'Successfully joined this club!'
		};
	},

	leaveClub: async ({ cookies, params }) => {
		// Get the user
		const user = await verifySession(cookies.get('session'), {
			clubUsers: true
		});

		// Get the club id
		const clubId = parseInt(params.clubId);

		const clubUser = await prisma.clubUser.findFirst({
			where: {
				clubId: clubId,
				userId: user.id
			}
		});

		if (!clubUser) {
			return {
				success: false,
				message: 'You are not in this club!'
			};
		}

		// Now we can delete the club user
		await prisma.clubUser.delete({
			where: {
				clubId_userId_organizationId: {
					clubId: clubId,
					userId: user.id,
					organizationId: parseInt(params.id)
				}
			}
		});

		return {
			success: true,
			message: 'Successfully left this club!'
		};
	}
};

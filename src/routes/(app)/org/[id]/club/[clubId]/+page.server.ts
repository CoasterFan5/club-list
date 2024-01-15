import { prisma } from '$lib/server/prismaConnection';
import { createPermissionsCheck } from '$lib/permissions.js';
import { error, redirect } from '@sveltejs/kit';
import { formHandler } from '$lib/bodyguard';
import { z } from 'zod';

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

			// ensure the user is actually allowed to edit this thing
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

			// check for permissions
			const club = await prisma.club.findFirst({
				where: {
					id: id
				},
				include: {
					clubUsers: {
						where: {
							id: sessionCheck.user.id
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
					message: 'How did we get here?'
				};
			}

			if (club.ownerId != sessionCheck.user.id) {
				// check if the user has permissions
				if (!club.clubUsers) {
					return {
						success: false,
						message: 'No Permissions'
					};
				}

				const permissionObject = createPermissionsCheck(club.clubUsers[0].role?.permissionInt ?? 0);

				if (!permissionObject.admin && !permissionObject.updateAppearance) {
					return {
						success: false,
						message: 'No Permissions'
					};
				}
			}

			// update the club
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
		const session = cookies.get('session');
		if (!session) {
			redirect(303, '/login');
		}

		// Get the club id
		const clubId = parseInt(params.clubId);

		const sessionCheck = await prisma.session.findUnique({
			where: {
				sessionToken: session
			},
			include: {
				user: {
					include: {
						clubUsers: {
							where: {
								clubId: clubId
							}
						}
					}
				}
			}
		});

		if (!sessionCheck || !sessionCheck.user) {
			redirect(303, '/login');
		}

		if (sessionCheck.user.clubUsers.length > 0) {
			return {
				success: false,
				message: 'You are already in this club!'
			};
		}

		// now we can create the club user
		await prisma.clubUser.create({
			data: {
				clubId: clubId,
				userId: sessionCheck.user.id
			}
		});

		return {
			success: true,
			message: 'Successfully joined this club!'
		};
	}
};

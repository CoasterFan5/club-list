import { error } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createClubPermissionsFromUser } from '$lib/permissions/clubPermissions.js';
import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession';

export const load = async ({ parent }) => {
	const parentData = await parent();

	if (!parentData.orgUser && parentData.org.hideSensitive) {
		throw error(404, 'Page disabled');
	}

	const club = await prisma.club.findUnique({
		where: {
			id: parentData.club.id
		},
		include: {
			events: true
		}
	});

	if (club === null) {
		error(500, 'Invalid club ID');
	}

	return {
		events: club.events
	};
};

export const actions = {
	delete: formHandler(
		z.object({
			eventId: z.coerce.number()
		}),
		async ({ eventId }, { cookies }) => {
			const user = await verifySession(cookies.get('session'), {
				orgUsers: {
					include: {
						role: true
					}
				},
				clubUsers: {
					include: {
						role: true
					}
				}
			});
			
			const club = await prisma.club.findFirst({
				where: {
					events: {
						some: {
							id: eventId
						}
					}
				},
				select: {
					id: true,
					organizationId: true
				}
			});

			const perms = createClubPermissionsFromUser(user, club);

			if (!perms.admin || !perms.manageEvents) {
				return {
					success: false,
					message: 'You do not have permission to delete events.'
				};
			}

			await prisma.event.delete({
				where: {
					id: eventId
				}
			});

			return {
				success: true,
				message: 'Event deleted!'
			};
		}
	)
}

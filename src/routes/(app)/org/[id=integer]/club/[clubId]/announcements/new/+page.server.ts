import { redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard';
import { createPermissionsFromUser } from '$lib/permissions.js';
import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession.js';

export const load = async ({ params, parent }) => {
	const parentData = await parent();
	const clubId = params.clubId;
	const orgId = params.id;
	const baseUrl = `/org/${orgId}/club/${clubId}`;

	if (!parentData.clubPerms.admin && !parentData.clubPerms.manageAnnouncements) {
		redirect(303, baseUrl);
	}
};

export const actions = {
	createAnnouncement: formHandler(
		z.object({
			title: z.string().max(100).min(1),
			description: z.string()
		}),
		async ({ title, description }, { cookies, params }) => {
			const clubId = params.clubId;
			const orgId = params.id;
			const baseUrl = `/org/${orgId}/club/${clubId}`;

			const club = await prisma.club.findUnique({
				where: {
					id: parseInt(params.clubId)
				}
			});

			if (!club) {
				return {
					success: false,
					message: 'no.'
				};
			}

			const user = await verifySession(cookies.get('session'), {
				clubUsers: {
					where: {
						clubId: club.id
					},
					include: {
						role: true
					}
				},
				orgUsers: {
					where: {
						organizationId: parseInt(params.id)
					},
					include: {
						role: true
					}
				}
			});

			const perms = createPermissionsFromUser(user, club);

			if (!perms.admin && !perms.manageAnnouncements) {
				redirect(303, '/login');
			}

			// Valid!
			await prisma.announcement.create({
				data: {
					title,
					description,
					clubId: parseInt(params.clubId),
					authorId: user.id
				}
			});

			// We did it!
			redirect(303, `${baseUrl}/announcements`);
		}
	)
};

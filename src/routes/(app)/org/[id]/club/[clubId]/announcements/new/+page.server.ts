import { redirect } from '@sveltejs/kit';
import type { PageParentData, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prismaConnection';
import { createPermissionsCheck } from '$lib/permissions.js';
import { formHandler } from '$lib/bodyguard';
import { z } from 'zod';

export const load: PageServerLoad = async ({ params, parent }) => {
	const parentData: PageParentData = await parent();
	const clubId = params.clubId;
	const orgId = params.id;
	const baseUrl = `/org/${orgId}/club/${clubId}`;

	if (
		!parentData.clubPerms.admin &&
		!parentData.clubPerms.manageAnnouncements &&
		parentData.club.ownerId != parentData.user.id
	) {
		redirect(303, baseUrl);
	}
};

export const actions = {
	createAnnouncement: formHandler(
		z.object({
			title: z.string().max(100).min(1),
			desc: z.string()
		}),
		async ({ title, desc }, { cookies, params }) => {
			const clubId = params.clubId;
			const orgId = params.id;
			const baseUrl = `/org/${orgId}/club/${clubId}`;

			// now the long task of validating data
			const session = cookies.get('session');

			const sessionCheck = await prisma.session.findUnique({
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

			const club = sessionCheck.user.clubs[0];
			const clubUser = sessionCheck.user.clubUsers[0];
			// check permissions

			if (club.ownerId != sessionCheck.userId) {
				if (!clubUser) {
					redirect(303, '/login');
				}
				const permissionCheck = createPermissionsCheck(clubUser.role?.permissionInt ?? 0);
				if (!permissionCheck.admin && !permissionCheck.manageAnnouncements) {
					redirect(303, '/login');
				}
			}
			// Valid!

			await prisma.announcement.create({
				data: {
					title,
					description: desc,
					clubId: club.id,
					authorId: sessionCheck.userId
				}
			});

			// We did it!
			redirect(303, `${baseUrl}/announcements`);
		}
	)
};

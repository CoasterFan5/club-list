import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createPermissionsCheck } from '$lib/permissions.js';
import { prisma } from '$lib/server/prismaConnection';

import { RRule } from './rrule';

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

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const actions = {
	default: formHandler(
		z.object({
			title: z.string().min(1).max(100),
			description: z.string().min(1).max(1000),
			date: z.string().min(1).max(100),
			repeat: z.coerce.boolean(),
			repeatEvery: z.coerce.number().optional().nullable(),
			repeatInterval: z.coerce.number(),
			repeatType: z.enum(['indefinitely', 'amount', 'upTo']),
			repeatUpTo: z.string().optional().nullable(),

			// Generates weekdaySunday...weekdaySaturday
			...Object.fromEntries(
				weekdays.map((day) => [`weekday${day}`, z.coerce.boolean().optional().nullable()])
			),

			// Generates weekN and week_N from (1,5) and (1,4) respectively
			...Object.fromEntries(
				[...Array(5).keys()].map((i) => [`week${i + 1}`, z.coerce.boolean().optional().nullable()])
			),
			...Object.fromEntries(
				[...Array(4).keys()].map((i) => [`week_${i + 1}`, z.coerce.boolean().optional().nullable()])
			)
		}),
		async (
			{ title, description, date, repeatEvery, repeatInterval, repeatType, repeatUpTo },
			{ params, cookies }
		) => {
			const parsedDate = new Date(date);
			const rrule = new RRule({
				freq: RRule.DAILY,
				dtstart: parsedDate,
				wkst: RRule.SU,
				interval: repeatInterval,
				count: repeatType === 'amount' ? repeatEvery ?? undefined : undefined,
				until: repeatType === 'upTo' && repeatUpTo ? new Date(repeatUpTo) : undefined
			});

			const session = cookies.get('session');

			const sessionCheck = await prisma.session.findUnique({
				where: {
					sessionToken: session
				},
				include: {
					user: {
						include: {
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

			const club = await prisma.club.findUnique({
				where: {
					id: parseInt(params.clubId)
				}
			});

			if (!club) {
				error(400, 'Invalid club ID');
			}

			// Make sure the user has permissions to create an event
			if (sessionCheck.user.id != club?.ownerId) {
				if (!sessionCheck.user.clubUsers[0] || !sessionCheck.user.clubUsers[0].role) {
					error(401, 'No Permissions');
				}

				const permissions = createPermissionsCheck(
					sessionCheck.user.clubUsers[0].role.permissionInt
				);

				if (!permissions.manageEvents && !permissions.admin) {
					error(401, 'No Permissions');
				}
			}

			await prisma.event.create({
				data: {
					title,
					description,
					date: rrule.toString(),
					clubId: club.id
				}
			});
		}
	)
};

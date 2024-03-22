import { redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { getClubUserFromSession } from '$lib/server/getClubUserFromSession.js';
import { prisma } from '$lib/server/prismaConnection.js';


export const load = async ({parent, params}) => {
	const parentData = await parent();
	if(!parentData.clubPerms.viewAttendance) {
		throw redirect(303, `/org/${params.id}/club/${params.clubId}`)
	}

	const events = await prisma.clubAttendanceEvent.findMany({
		where: {
			clubId: parentData.club.id
		}
	})

	const members = await prisma.clubUser.findMany({
		where: {
			clubId: parentData.club.id
		},
		select: {
			user: {
				select: {
					firstName: true,
					lastName: true,
					pfp: true,
					id: true,
					attendanceMarks: {
						where: {
							clubId: parentData.club.id
						},
						select: {
							attendanceEvent: true
						}
					}
				}
			}
		},
		
	})


	return {
		attendanceMembers: members,
		attendanceEvents: events,
	}
}

export const actions = {
	createAttendanceEvent: async({cookies, params}) => {
		const clubUser = await getClubUserFromSession(cookies.get("session"), params.clubId)

		if(!clubUser.perms.admin && !clubUser.perms.manageAttendance) {
			return {
				success: false,
				message: "No permissions"
			}
		}

	await prisma.clubAttendanceEvent.create({
		data: {
			clubId: clubUser.clubUser.clubId
		}
	})


	},
	changeAttendance: formHandler(z.object({
		userId: z.coerce.number(),
		eventId: z.coerce.number()
	}), async({userId, eventId}, {cookies, params}) => {
		const clubUser = await getClubUserFromSession(cookies.get("session"), params.clubId)
		if(!clubUser.perms.admin && !clubUser.perms.manageAttendance) {
			return {
				success: false,
				message: "No permissions"
			}
		}

		const event = await prisma.clubAttendanceEvent.findFirst({
			where: {
				id: eventId
			}
		})

		if(!event) {
			return {
				success: false,
				message: "No event"
			}
		}

		const attendanceEvent = await prisma.clubAttendanceCheck.findFirst({
			where: {
				AND: {
					clubId: clubUser.clubUser.clubId,
					userId: userId,
					attendanceEventId: eventId
				}
			}
		})

		if(!attendanceEvent) {
			await prisma.clubAttendanceCheck.create({
				data: {
					clubId: clubUser.clubUser.clubId,
					userId: userId,
					attendanceEventId: eventId
				}
			})
			return {
				success: true,
				message: "Marked Present!"
			}
		} else {
			await prisma.clubAttendanceCheck.delete({
				where: {
					clubId_userId_attendanceEventId: {
						clubId: clubUser.clubUser.clubId,
						userId: userId,
						attendanceEventId: eventId
					}
				}
			})
			return {
				success: true,
				message: "Marked Absent!"
			}
		}

		
	})
}
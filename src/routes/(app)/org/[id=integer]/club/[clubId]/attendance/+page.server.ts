import { redirect } from '@sveltejs/kit';

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
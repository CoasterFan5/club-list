import { error, redirect } from '@sveltejs/kit';

import { getClubUserFromSession } from '$lib/server/getClubUserFromSession.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifyOptionalSession } from '$lib/server/verifySession.js';

export const load = async ({ url, cookies }) => {
	//Fix for secure cookies
	if (url.searchParams.get('noRedirect') != 'true') {
		const newUrl = new URL(url);
		newUrl.searchParams.set('noRedirect', 'true');
		return {
			refresh: true,
			redirect: newUrl.toString()
		};
	}

	const eventId = url.searchParams.get('id');
	if (!eventId) {
		throw error(404, 'No event');
	}

	const code = url.searchParams.get('code');
	if (!code) {
		throw error(404, 'No code');
	}

	const event = await prisma.clubAttendanceEvent.findFirst({
		where: {
			AND: {
				id: parseInt(eventId),
				attendanceCode: code
			}
		}
	});

	if (!event) {
		throw error(404, 'Invalid ID');
	}

	if ((await verifyOptionalSession(cookies.get('session'))) == null) {
		throw redirect(303, `/login?redirect=attendance&id=${eventId}&code=${code}`);
	}

	const clubUser = await getClubUserFromSession(cookies.get('session'), event.clubId.toString());

	if (!clubUser) {
		throw error(404, 'Not in club');
	}

	await prisma.clubAttendanceCheck.upsert({
		where: {
			clubId_userId_attendanceEventId: {
				userId: clubUser.clubUser.userId,
				clubId: event.clubId,
				attendanceEventId: event.id
			}
		},
		create: {
			userId: clubUser.clubUser.userId,
			clubId: event.clubId,
			attendanceEventId: event.id
		},
		update: {}
	});

	throw redirect(
		303,
		`/attendance/good?id=${event.id}&club=${clubUser.clubUser.clubId}&org=${clubUser.clubUser.organizationId}`
	);
};

import { error, redirect } from '@sveltejs/kit';

import { getClubUserFromSession } from '$lib/server/getClubUserFromSession';
import { prisma } from '$lib/server/prismaConnection.js';
import { freqMapping, RRule } from '$lib/utils/rrule.js';

export const load = async ({ cookies, params, request }) => {
	// Get the date from query
	const url = new URL(request.url);
	const date = url.searchParams.get('date');

	if (!date) {
		error(400, 'Invalid date');
	}

	const { perms } = await getClubUserFromSession(cookies.get('session'), params.clubId);

	if (!perms.manageEvents || !perms.admin) {
		throw redirect(303, `/org/${params.id}/club/${params.clubId}/`);
	}

	const newEvent = await prisma.event.create({
		data: {
			title: 'New Event',
			clubId: parseInt(params.clubId),
			date: new RRule({
				freq: freqMapping['weekly'],
				dtstart: new Date(date),
				count: 1
			}).toString(),
			draft: true
		}
	});

	throw redirect(303, `/org/${params.id}/club/${params.clubId}/events/manage/${newEvent.id}`);
};

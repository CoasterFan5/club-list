import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession';

export const load = async ({ cookies, url }) => {
	const user = await verifySession(cookies.get('session'));

	enum filter {
		club = 'club',
		org = 'org'
	}
	let activeFilter: filter = filter.club;

	if (url.searchParams.has('filter')) {
		if (url.searchParams.get('filter') == 'club') {
			activeFilter = filter.club;
		} else if (url.searchParams.get('filter') == 'org') {
			activeFilter = filter.org;
		} else {
			activeFilter = filter.club;
		}
	}

	let events;
	if (activeFilter == filter.club) {
		events = await prisma.event.findMany({
			where: {
				club: {
					clubUsers: {
						some: {
							userId: user.id
						}
					}
				}
			}
		});
	} else if (activeFilter == filter.org) {
		events = await prisma.event.findMany({
			where: {
				club: {
					organization: {
						orgUsers: {
							some: {
								userId: user.id
							}
						}
					}
				}
			}
		});
	}

	return {
		events,
		filterMode: activeFilter,
		filterModes: filter
	};
};

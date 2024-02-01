import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession';

enum Filter {
	CLUB = 'club',
	ORG = 'org'
}

export const load = async ({ cookies, url }) => {
	const user = await verifySession(cookies.get('session'));
	let activeFilter: Filter = Filter.CLUB;

	if (url.searchParams.has('filter')) {
		if (url.searchParams.get('filter') == 'club') {
			activeFilter = Filter.CLUB;
		} else if (url.searchParams.get('filter') == 'org') {
			activeFilter = Filter.ORG;
		} else {
			activeFilter = Filter.CLUB;
		}
	}

	let events;
	if (activeFilter == Filter.CLUB) {
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
	} else if (activeFilter == Filter.ORG) {
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
		filterModes: Filter
	};
};

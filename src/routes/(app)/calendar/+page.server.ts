import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession';

enum Filter {
	CLUB = 'club',
	ORG = 'org'
}

export const load = async ({ cookies, url }) => {
	const user = await verifySession(cookies.get('session'));
	let events;

	if (url.searchParams.get('filter')?.toLowerCase() == Filter.ORG) {
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
	} else {
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
	}

	return {
		events,
		filterMode: (url.searchParams.get('filter') as Filter) || Filter.CLUB,
		filterModes: Filter
	};
};

import { prisma } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const clubId = parseInt(params.id);

	const club = await prisma.club.findFirst({
		where: {
			id: clubId
		}
	});

	if (!club) {
		throw new Error('Club not found');
	}

	return {
		club
	};
};

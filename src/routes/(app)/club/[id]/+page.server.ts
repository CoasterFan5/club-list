import { prisma } from '$lib/db';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const clubId = parseInt(params.id);

	const club = await prisma.club.findFirst({
		where: {
			id: clubId
		}
	});

	if (!club) {
		throw error(404, "Club Not Found")
	}

	return {
		club
	};
};

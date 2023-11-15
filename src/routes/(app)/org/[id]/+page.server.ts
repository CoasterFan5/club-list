import { prisma } from '$lib/db';
import { redirect, type LoadEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export let load: PageServerLoad = async ({ cookies, params }) => {
	let orgId;

	if (parseInt(params.id)) {
		orgId = parseInt(params.id);
	}

	let org = prisma.organization.findFirst({
		where: {
			id: orgId
		}
	});
};

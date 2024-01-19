import { prisma } from '$lib/server/prismaConnection';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const org = await prisma.organization.findFirst({
		where: {
			slug: {
				slug: params.id.toLowerCase()
			}
		}
	});

	if (!org) {
		return {
			status: 404,
			error: 'Organization not found'
		};
	}

	throw redirect(303, `/org/${org.id}`);
};

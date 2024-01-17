import { prisma } from '$lib/server/prismaConnection';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const org = await prisma.organization.findFirst({
		where: {
			slug: {
				slug: params.id
			}
		}
	});

	if (!org) {
		return {
			status: 404,
			error: 'Organization not found'
		};
	}

	redirect(303, `/org/${org.id}`);
};

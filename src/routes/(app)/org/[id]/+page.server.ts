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
		console.log('org not found');
		return {
			status: 404,
			error: 'Organization not found'
		};
	}

	console.log('redirecting');

	throw redirect(303, `/org/${org.id}`);
};

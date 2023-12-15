import { prisma } from '$lib/prismaConnection';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url }) => {
	// if the user isn't logged in, we need to redirect them to the login page
	const session = cookies.get('session');
	if (!session) {
		redirect(303, '/login');
	}

	const sessionCheck = await prisma.session.findFirst({
		where: {
			sessionToken: session
		},
		include: {
			user: true
		}
	});

	if (!sessionCheck) {
		redirect(303, '/login');
	}

	const isInClub = /org\/\d+\/club/.test(url.pathname);
	const pathType = isInClub ? '__club__' : url.pathname;

	return {
		user: sessionCheck.user,
		pathType
	};
};

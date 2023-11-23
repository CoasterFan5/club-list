import { prisma } from '$lib/prismaConnection';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	// if the user isn't logged in, we need to redirect them to the login page
	const session = cookies.get('session');
	if (!session) {
		throw redirect(303, '/login');
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
		throw redirect(303, '/login');
	}

	let user = sessionCheck.user;
	return {
		user
	};
};

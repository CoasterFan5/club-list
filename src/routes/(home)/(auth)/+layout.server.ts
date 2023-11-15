import { prisma } from '$lib/prismaConnection';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	// if the user is logged in, we need to redirect them to the dashboard
	const session = cookies.get('session');

	const sessionCheck = await prisma.session.findFirst({
		where: {
			sessionToken: session
		}
	})

    if (sessionCheck) {
        throw redirect(303, '/dashboard');
    }
};

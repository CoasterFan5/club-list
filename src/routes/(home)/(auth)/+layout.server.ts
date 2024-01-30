import { redirect } from '@sveltejs/kit';

import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ cookies }) => {
	// If the user is logged in, we need to redirect them to the dashboard
	const session = cookies.get('session');

	if (!session) {
		return;
	}

	const userCheck = await prisma.user.findFirst({
		where: {
			sessions: {
				some: {
					sessionToken: session
				}
			}
		}
	});

	if (userCheck) {
		redirect(303, '/dashboard');
	}
};

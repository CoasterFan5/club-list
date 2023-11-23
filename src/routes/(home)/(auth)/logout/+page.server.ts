import { prisma } from '$lib/prismaConnection.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies }) => {
		// Get the session cookie
		const session = cookies.get('session');
		if (!session) {
			return;
		}

		const hasSession = await prisma.user.findFirst({
			where: {
				sessions: {
					some: {
						sessionToken: session
					}
				}
			}
		});

		if (hasSession) {
			cookies.delete('session');
		}

		throw redirect(303, '/login');
	}
};

import { prisma } from '$lib/prismaConnection';

export const load = async ({ cookies }) => {
	// if the user is logged in, we need to redirect them to the dashboard
	const session = cookies.get('session');

	// TODO: redirect if already logged in
	const sessionCheck = await prisma.session.findFirst({
		where: {
			sessionToken: session
		}
	});
};

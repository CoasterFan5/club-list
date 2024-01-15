import { redirect } from '@sveltejs/kit';
import { prisma } from './prismaConnection';

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export const verifyOptionalSession = async (session: string | undefined) => {
	if (!session) {
		return null;
	}

	const sessionCheck = await prisma.session.findFirst({
		where: {
			sessionToken: session
		},
		include: {
			user: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					createdAt: true,
					updatedAt: true,
					pfp: true,
				}
			}
		}
	});

	if (!sessionCheck?.user) {
		return null;
	}

	if (sessionCheck.createdAt.getTime() < Date.now() - THIRTY_DAYS) {
		return null;
	}

	return sessionCheck.user;
};

export const verifySession = async (session: string | undefined) => {
	const sessionCheck = await verifyOptionalSession(session);

	if (!sessionCheck) {
		return redirect(303, '/login');
	}

	return sessionCheck;
};

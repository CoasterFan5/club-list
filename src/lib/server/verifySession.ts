import { redirect } from '@sveltejs/kit';
import { prisma } from './prismaConnection';
import type { Prisma } from '@prisma/client';

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export const verifyOptionalSession = async (
	session: string | undefined,
	extraFields?: Prisma.UserSelect
) => {
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
					...extraFields
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

export const verifySession = async (
	session: string | undefined,
	extraFields?: Prisma.UserSelect
) => {
	const sessionCheck = await verifyOptionalSession(session, extraFields);

	if (!sessionCheck) {
		return redirect(303, '/login');
	}

	return sessionCheck;
};

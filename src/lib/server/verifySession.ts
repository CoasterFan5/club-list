import type { Prisma } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

import { prisma } from './prismaConnection';

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

interface PropertyShortlist {
	id: true;
	firstName: true;
	lastName: true;
	email: true;
	createdAt: true;
	updatedAt: true;
	pfp: true;
}

type SessionReturnType<T extends Prisma.UserSelect | undefined> = NonNullable<
	Prisma.SessionGetPayload<{
		where: {
			sessionToken: string;
		};
		include: {
			user: {
				select: T extends undefined ? PropertyShortlist : PropertyShortlist & NonNullable<T>;
			};
		};
	}>
>['user'];

export async function verifyOptionalSession<T extends Prisma.UserSelect | undefined>(
	session: string | undefined,
	extraFields?: T
): Promise<SessionReturnType<T> | null> {
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
					siteAdmin: true,
					...(extraFields === undefined ? {} : extraFields)
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

	// TODO: fix typing
	return sessionCheck.user as SessionReturnType<T>;
}

export async function verifySession<T extends Prisma.UserSelect | undefined>(
	session: string | undefined,
	extraFields?: T
): Promise<SessionReturnType<T>> {
	const sessionCheck = await verifyOptionalSession(session, extraFields);

	if (!sessionCheck) {
		return redirect(303, '/login');
	}

	return sessionCheck;
}

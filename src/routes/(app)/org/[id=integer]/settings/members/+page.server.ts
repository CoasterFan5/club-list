import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/server/prismaConnection';
import { verifySession } from '$lib/server/verifySession.js';

export const load = async ({ params }) => {
	const orgUserData = await prisma.orgUser.findMany({
		where: {
			organizationId: parseInt(params.id)
		},
		include: {
			user: true
		}
	});

	const filteredData = orgUserData.map((item) => {
		return {
			user: {
				firstName: item.user.firstName,
				lastName: item.user.lastName,
				pfp: item.user.pfp,
				role: item.role
			},
			userId: item.user.id,
			role: item.role
		};
	});

	return {
		orgUserData: filteredData
	};
};

export const actions = {
	kickMember: formHandler(
		z.object({
			userId: z.coerce.number()
		}),
		async ({ userId }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			const orgUser = await prisma.orgUser.findFirst({
				where: {
					AND: {
						userId: user.id,
						organizationId: parseInt(params.id)
					}
				}
			});

			if (orgUser?.role != 'OWNER' && orgUser?.role != 'ADMIN') {
				return {
					success: false,
					message: 'No Perms'
				};
			}

			const toDelete = await prisma.orgUser.findUnique({
				where: {
					organizationId_userId: {
						organizationId: parseInt(params.id),
						userId: userId
					}
				}
			});

			if (!toDelete) {
				return {
					success: false,
					message: 'No User Exists'
				};
			}

			if (toDelete.role == 'ADMIN' || toDelete.role == 'OWNER') {
				return {
					success: false,
					message: 'Can not kick admins or owners.'
				};
			}

			const deletedUser = await prisma.orgUser.delete({
				where: {
					organizationId_userId: {
						organizationId: parseInt(params.id),
						userId: userId
					}
				}
			});

			if (!deletedUser) {
				return {
					success: false,
					message: 'Could not remove user.'
				};
			}

			return {
				success: true,
				message: 'User removed'
			};
		}
	)
};

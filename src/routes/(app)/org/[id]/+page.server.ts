import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/prismaConnection';
import { verifySession } from '$lib/verifySession.js';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

export const actions = {
	createClub: formHandler(
		z.object({
			clubName: z.string().max(100).min(1)
		}),
		async ({ clubName }, { cookies, params }) => {
			if (!clubName) {
				return fail(400, {
					message: 'Club name not provided.'
				});
			}

			const session = cookies.get('session');
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

			const user = sessionCheck.user;

			if (!user) {
				redirect(303, '/login');
			}

			// get the org user
			const orgUser = await prisma.orgUser.findFirst({
				where: {
					userId: user.id,
					organizationId: parseInt(params.id)
				}
			});

			if (!orgUser) {
				redirect(303, '/login');
			}

			if (orgUser.role != 'OWNER' && orgUser.role != 'ADMIN') {
				return fail(403, {
					message: 'No Permissions'
				});
			}

			// create the club
			const club = await prisma.club.create({
				data: {
					name: clubName,
					description: null,
					ownerId: orgUser.userId,
					organizationId: orgUser.organizationId
				}
			});

			redirect(303, `/org/${params.id}/club/${club.id}`);
		}
	),
	leaveOrg: async ({cookies, params}) => {

		const user = await verifySession(cookies.get("session"))

		const orguser = await prisma.orgUser.findFirst({
			where: {
				AND: {
					organizationId: parseInt(params.id),
					userId: user.id,
				}
			}
		})

		

		if(!orguser) {
			return {
				success: false,
				message: "You are not in this org..."
			}
		}

		if(orguser.role == "OWNER") {
			return {
				success: false,
				message: "You cant leave an org you own!"
			}
		}

		await prisma.orgUser.delete({
			where: {
				id: orguser.id
			}
		})

		throw redirect(303, "/org")

	}
};

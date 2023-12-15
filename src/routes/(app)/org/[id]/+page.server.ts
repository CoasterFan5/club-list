import { prisma } from '$lib/prismaConnection';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	createClub: async ({ cookies, request, params }) => {
		const formData = await request.formData();

		const clubName = formData.get('clubName')?.toString();

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

		if (clubName.length > 100) {
			return fail(400, {
				message: 'Club name too long.'
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
};

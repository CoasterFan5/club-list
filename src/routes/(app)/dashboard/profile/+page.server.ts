import { prisma } from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		if (!cookies.get('session')) {
			throw redirect(303, '/login');
		}

		const data = await request.formData();

		const firstName = data.get('firstName')?.toString();
		const lastName = data.get('lastName')?.toString();
		const email = data.get('email')?.toString();

		if (!firstName || firstName == '') {
			return fail(400, { message: 'First name is required' })
		}

		if (!lastName || lastName == '') {
			return fail(400, { message: 'Last name is required' })
		}

		if (!email || email == '') {
			return fail(400, { message: 'Email is required' })
		}

		const session = cookies.get('session');

		await prisma.user.updateMany({
			where: {
				sessions: {
					some: {
						sessionToken: session
					}
				}
			},
			data: {
				firstName,
				lastName,
				email
			}
		});

		return { success: true };
	}
};

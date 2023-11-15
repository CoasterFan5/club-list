import { prisma } from '$lib/db.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const session = cookies.get('session');
	if (!session) {
		throw redirect(307, '/auth');
	}

	const user = await prisma.user.findUnique({
		where: {
			session: session
		},
		include: {
			orgUsers: {
				include: {
					organization: true
				}
			}
		}
	});

	if (!user) {
		throw redirect(307, '/auth');
	}

	return {
		user
	};
};

export const actions = {
	create: async ({ request, cookies }) => {
		//get some basic data
		const data = await request.formData();
		const orgName = data.get('name')?.toString();

		//make sure we have a name
		if (!orgName || orgName == '') {
			throw error(400, 'You must provide a name for your organization');
		}

		if (orgName.length > 50) {
			throw error(400, 'Organization names cannot be longer than 50 characters');
		}

		// find the user
		const orgOwner = await prisma.user.findUnique({
			where: {
				session: cookies.get('session')
			}
		});

		// make sure we have a user who submitted this!
		if (!orgOwner) {
			throw error(403, 'You must be logged in to create an organization');
		}
		// make the org
		const org = await prisma.organization.create({
			data: {
				name: orgName,
				ownerId: orgOwner.id
			}
		});

		//also make the user an org user
		await prisma.orgUser.create({
			data: {
				userId: orgOwner.id,
				organizationId: org.id,
			}
		});

		return {
			message: 'Hello World!'
		};
	},
	join: async () => {
		return {
			message: 'Hello World!'
		};
	}
};

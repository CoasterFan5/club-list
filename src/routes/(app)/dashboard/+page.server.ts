import { prisma } from '$lib/db.js';
import { redirect } from '@sveltejs/kit';

export let load = async ({request, cookies}) => {
	let session = cookies.get("session")
	if(!session) {
		throw redirect(307, "/auth")
	}

	let user = await prisma.user.findUnique({
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
	
	if(!user) {
		throw redirect(307, "/auth")
	}

	return {
		user
	}
};
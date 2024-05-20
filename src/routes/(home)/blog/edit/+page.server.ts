import { redirect } from '@sveltejs/kit';

import { verifySession } from '$lib/server/verifySession.js'
import { prisma } from '$lib/server/prismaConnection.js';

export const load = async ({cookies}) => {
	const user = await verifySession(cookies.get("session"));

	console.log(user)

	if(!user.siteAdmin) {
		throw redirect(303, "/blog")
	}

	const articles = await prisma.blogArticle.findMany({
		select: {
			articleURL: true
		}
	})
}
import { env } from '$env/dynamic/private'
import { redirect } from '@sveltejs/kit'
import { prisma } from '$lib/db.js'

export let GET = async ({request, cookies}) => {
	if(cookies.get("session")) {
		let user = await prisma.user.findUnique({
			where: {
				session: cookies.get("session")
			}
		})

		if(!user) {
			throw redirect(307, env.ZEROTOUCH ?? "/")
		} else {
			throw redirect(307, "/dashboard")
		}
	} else {
		throw redirect(307, env.ZEROTOUCH ?? "/")
	}

	return new Response("OK")
}
import { error, redirect } from "@sveltejs/kit"
import { prisma } from "./prismaConnection"

export const verifySession = async (session: string | undefined) => {

	if(!session) {
		throw redirect(303, "/login")
	}

	const sessionCheck = await prisma.session.findFirst({
		where: {
			sessionToken: session
		},
		include: {
			user: true
		}
	})


	if(!sessionCheck || !sessionCheck.user) {
		throw redirect(303, "/login")
	}

	if( sessionCheck.createdAt.getTime() < Date.now() -  2592000000 ) {
		throw redirect(303, "/login")
	} //30 days
	
	if(sessionCheck.user == null) {
		throw error(400, "How did we get here?")
	} else {
		return sessionCheck.user
	}
	
}

export const verifyOptionalSession = async (session: string | undefined) => {

	if(!session) {
		return null
	}

	
	const sessionCheck = await prisma.session.findFirst({
		where: {
			sessionToken: session
		},
		include: {
			user: true
		}
	})

	

	if(!sessionCheck || !sessionCheck.user) {
		return null
	}

	if( sessionCheck.createdAt.getTime() < Date.now() -  2592000000 ) {
		return null
	} //30 days

	
	return sessionCheck.user
	
}
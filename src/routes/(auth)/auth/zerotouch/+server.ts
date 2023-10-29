import { redirect, error, } from '@sveltejs/kit'
import { prisma } from '$lib/db.js'
import crypto from 'crypto'
import { SECURE_COOKIES } from '$env/static/private'


export let GET = async ({request, cookies, url}) => {
	if(cookies.get("session")) {
		throw redirect(307, "/dashboard")
	} else {

		let token = url.searchParams.get("token")

		if(!token) {
			throw redirect(307, "/auth")
		}

		let fetRes = await fetch(`https://coaster.services/zerotouch/exchange?token=${token}`, {
			method: "GET",
		});

		if(fetRes.status != 200) {
			throw error(fetRes.status, "Invalid token")
		}

		let fetchData = await fetRes.json()
		let userName = fetchData.username
		let userId = fetchData.user
		console.log(fetchData)
		
		let newSession = crypto.randomBytes(32).toString('hex')

		let user = await prisma.user.findFirst({
			where: {
				csId: userId
			}
		})

		if(user) {
			await prisma.user.update({
				where: {
					csId: userId
				},
				data: {
					session: newSession
				}
			})
			cookies.set("session", newSession, {
				path: "/",
				maxAge: 60 * 60 * 24 * 7,
				secure: SECURE_COOKIES.toLowerCase() == "true",
				sameSite: "strict"
			})
			throw redirect(307, "/dashboard")
		} else {
			await prisma.user.create({
				data: {
					csId: userId,
					username: userName,
					session: newSession,
					firstName: "",
					lastName: "",
				}
			})
			cookies.set("session", newSession, {
				path: "/",
				maxAge: 60 * 60 * 24 * 7,
				secure: SECURE_COOKIES.toLowerCase() == "true",
				sameSite: "strict"
			})
			throw redirect(307, "/dashboard")
		}

		//create a session and apply it to the user
		

		console.log(fetchData)

		
	}
}
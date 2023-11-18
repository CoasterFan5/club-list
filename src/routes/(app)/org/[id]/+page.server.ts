import { prisma } from '$lib/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export let actions = {
	createClub: async ({cookies, request, params}) => {
		const formData = await request.formData();

		let clubName = formData.get("clubName")?.toString();

		if(!clubName) {
			return {
				sucess: false,
				message: "Please fill all fields."
			}
		}

		let session = cookies.get("session");
		const sessionCheck = await prisma.session.findFirst({
			where: {
				sessionToken: session
			},
			include: {
				user: true
			}
		});

		if(!sessionCheck) {
			throw redirect(303, "/login")
		}

		let user = sessionCheck.user

		if(!user) {
			throw redirect(303, "/login")
		}

		//get the org user
		const orgUser = await prisma.orgUser.findFirst({
			where: {
				userId: user.id,
				organizationId: parseInt(params.id)
			}
		})

		if(!orgUser) {
			throw redirect(303, "/login")
		}

		console.log(orgUser)

		if(orgUser.role != "OWNER" && orgUser.role != "ADMIN") {
			return {
				success: false,
				message: "No Permissions"
			}
		}

		//create the club
		let newClub = await prisma.club.create({
			data: {
				name: clubName,
				description: null,
				ownerId: orgUser.userId,
				organizationId: orgUser.organizationId
			}
		})

		return {
			success: true,
			message: "All Good!"
		}

		


	}
}
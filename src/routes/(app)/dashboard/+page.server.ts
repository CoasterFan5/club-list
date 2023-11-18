
import { prisma } from '$lib/db.js';
import { join } from '@prisma/client/runtime/library.js';
import { error, redirect } from '@sveltejs/kit';
import crypto from "crypto"

export const load = async ({ cookies }) => {
	const session = cookies.get('session');
	if (!session) {
		throw redirect(303, '/auth');
	}

	const sessionCheck = await prisma.session.findFirst({
		where: {
			sessionToken: session
		},
		include: {
			user: {
				include: {
					orgUsers: {
						include: {
							organization: true
						}
					},
					organization: true
				}
			}
		}
	})

	if(!sessionCheck) {
		throw redirect(303, "/auth")
	}

	let user = sessionCheck.user;

	if (!user) {
		throw redirect(303, '/auth');
	}

	return {
		user
	};
};

export const actions = {
	create: async ({ request, cookies }) => {
		//get some basic data

		if(!cookies.get("session")) {
			throw redirect(303, "/login")
		}

		const data = await request.formData();
		const orgName = data.get('name')?.toString();

		//make sure we have a name
		if (!orgName || orgName == '') {
			return {
				success: false,
				message: "You must provide a name!"
			}
		}

		if (orgName.length > 50) {
			return {
				success: false,
				message: "Organization names cannot be longer than 50 characters"
			}
		}

		// find the user
		const orgOwnerSession = await prisma.session.findFirst({
			where: {
				sessionToken: cookies.get("session")
			},
			include: {
				user: true
			}
		})
		const orgOwner = orgOwnerSession?.user;

		// make sure we have a user who submitted this!
		if (!orgOwner) {
			throw redirect(303, "/login")
		}

		//we need to know the number of orgs created currently
		let orgAmount = await prisma.organization.count();

		//make a join code
		let randomNess = Math.round(Math.random() * 324000 + 36000).toString(36);
		let joinString = (orgAmount + 1).toString(36) + randomNess;

		// make the org
		const org = await prisma.organization.create({
			data: {
				name: orgName,
				ownerId: orgOwner.id,
				joinCode: joinString
			}
		});

		//also make the user an org user
		await prisma.orgUser.create({
			data: {
				userId: orgOwner.id,
				organizationId: org.id,
				role: "OWNER"
			}
		});

		return {
			sucess: true,
			message: "created!"
		};
	},
	join: async ({cookies, request}) => {

		if(!cookies.get("session")) {
			throw redirect(303, "/login")
		}
		const session = cookies.get("session")

		const data = await request.formData();
		let joinCode = data.get("joinCode")?.toString();

		if(!joinCode) {
			return {
				success: false,
				message: "No Join Code"
			}
		}

		//make sure user is logged in
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

		//search the join code
		const joinCheck = await prisma.organization.findFirst({
			where: {
				joinCode: joinCode
			}
		})

		if(!joinCheck) {
			return {
				sucess: false,
				message: "Invalid Join Code"
			}
		}

		//create an org user
		const orgUser = await prisma.orgUser.create({
			data: {
				role: "member",
				organizationId: joinCheck.id,
				userId: sessionCheck.user.id
			}
		})

		console.log(orgUser)
		
		return {
			sucess: true,
			message: "Joined!"
		}
		
		
	}
};

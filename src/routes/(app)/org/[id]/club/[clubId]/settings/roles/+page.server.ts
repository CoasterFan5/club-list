import { prisma } from '$lib/prismaConnection.js';
import { error, redirect } from '@sveltejs/kit';
import { defaultClubPermissionObject } from '$lib/permissions.js';
import {
	createPermissionList,
	createPermissionsCheck,
	type PermissionObject
} from '$lib/permissionHelper.js';

export const actions = {
	makeRole: async ({ params, cookies }) => {
		const session = cookies.get('session');

		const sessionCheck = await prisma.session.findUnique({
			where: {
				sessionToken: session
			},
			include: {
				user: {
					include: {
						clubUsers: {
							where: {
								clubId: parseInt(params.clubId)
							},
							include: {
								role: true
							}
						}
					}
				}
			}
		});

		const club = await prisma.club.findUnique({
			where: {
				id: parseInt(params.clubId)
			}
		});

		if (!club) {
			throw error(400, 'How did we get here?');
		}

		if (!sessionCheck || !sessionCheck.user) {
			throw redirect(303, '/login');
		}

		//make sure the user has the proper perms

		let userPerms = { ...defaultClubPermissionObject };

		if (sessionCheck.user.id == club?.ownerId) {
			for (const key in userPerms) {
				(userPerms as PermissionObject)[key] = true;
			}
		} else {
			if (!sessionCheck.user.clubUsers[0] || !sessionCheck.user.clubUsers[0].role) {
				throw error(401, 'No Permissions');
			}
			userPerms = {
				...userPerms,
				...createPermissionsCheck(
					createPermissionList(defaultClubPermissionObject),
					sessionCheck.user.clubUsers[0].role.permissionInt
				)
			};
		}

		if (!userPerms.admin && !userPerms.manageRoles) {
			throw error(401, 'No Permissions');
		}

		//actually make the role
		await prisma.clubRole.create({
			data: {
				name: 'new role',
				color: '#808080',
				permissionInt: 0,
				clubId: club.id
			}
		});

		return {
			success: true,
			message: 'Role Created!'
		};
	},
	updateRole: async ({ params, cookies, request }) => {
		const formData = await request.formData();

		const roleName = formData.get('name')?.toString();
		const roleColor = formData.get('color')?.toString();
		const roleIdString = formData.get('roleId')?.toString();
		if (!roleIdString) {
			throw error(400, 'How did we get here?');
		}
		const roleId = parseInt(roleIdString);

		const session = cookies.get('session');

		const sessionCheck = await prisma.session.findUnique({
			where: {
				sessionToken: session
			},
			include: {
				user: {
					include: {
						clubUsers: {
							where: {
								clubId: parseInt(params.clubId)
							},
							include: {
								role: true
							}
						}
					}
				}
			}
		});

		const club = await prisma.club.findUnique({
			where: {
				id: parseInt(params.clubId)
			}
		});

		if (!club) {
			throw error(400, 'How did we get here?');
		}

		if (!sessionCheck || !sessionCheck.user) {
			throw redirect(303, '/login');
		}

		//make sure the user has the proper perms

		let userPerms = { ...defaultClubPermissionObject };

		if (sessionCheck.user.id == club?.ownerId) {
			for (const key in userPerms) {
				(userPerms as PermissionObject)[key] = true;
			}
		} else {
			if (!sessionCheck.user.clubUsers[0] || !sessionCheck.user.clubUsers[0].role) {
				throw error(401, 'No Permissions');
			}
			userPerms = {
				...userPerms,
				...createPermissionsCheck(
					createPermissionList(defaultClubPermissionObject),
					sessionCheck.user.clubUsers[0].role.permissionInt
				)
			};
		}

		if (!userPerms.admin && !userPerms.manageRoles) {
			throw error(401, 'No Permissions');
		}

		//grab the role
		const role = await prisma.clubRole.findFirst({
			where: {
				id: roleId
			}
		});

		if (!role || role?.clubId != club.id) {
			throw error(400, 'How did we get here?');
		}

		//update the role
		await prisma.clubRole.update({
			where: {
				id: roleId
			},
			data: {
				name: roleName,
				color: roleColor
			}
		});

		//actually make the role

		return {
			success: true,
			message: 'Role Updated!'
		};
	},

	deleteRole: async ({request, params, cookies}) => {
		const formData = await request.formData();

		const roleName = formData.get('roleName')?.toString();
		if(!roleName) {
			return {
				success: false,
				message: "No role name typed"
			}
		}

		const roleIdString = formData.get('roleId')?.toString();
		if (!roleIdString) {
			throw error(400, 'How did we get here?');
		}
		const roleId = parseInt(roleIdString);

		const session = cookies.get('session');

		const sessionCheck = await prisma.session.findUnique({
			where: {
				sessionToken: session
			},
			include: {
				user: {
					include: {
						clubUsers: {
							where: {
								clubId: parseInt(params.clubId)
							},
							include: {
								role: true
							}
						}
					}
				}
			}
		});

		const club = await prisma.club.findUnique({
			where: {
				id: parseInt(params.clubId)
			}
		});


		if (!club) {
			throw error(400, 'How did we get here?');
		}

		

		if (!sessionCheck || !sessionCheck.user) {
			throw redirect(303, '/login');
		}

		//make sure the user has the proper perms

		let userPerms = { ...defaultClubPermissionObject };

		if (sessionCheck.user.id == club?.ownerId) {
			for (const key in userPerms) {
				(userPerms as PermissionObject)[key] = true;
			}
		} else {
			if (!sessionCheck.user.clubUsers[0] || !sessionCheck.user.clubUsers[0].role) {
				throw error(401, 'No Permissions');
			}
			userPerms = {
				...userPerms,
				...createPermissionsCheck(
					createPermissionList(defaultClubPermissionObject),
					sessionCheck.user.clubUsers[0].role.permissionInt
				)
			};
		}

		if (!userPerms.admin && !userPerms.manageRoles) {
			throw error(401, 'No Permissions');
		}

		//grab the role
		const role = await prisma.clubRole.findFirst({
			where: {
				id: roleId
			}
		});

		

		if (!role || role?.clubId != club.id) {
			throw error(400, 'How did we get here?');
		}

		if(role.name != roleName) {
			console.log(role.name, roleName)
			return {
				success: false,
				message: "Role name typed wrong"
			}
		}

		//delete the role
		await prisma.clubUser.updateMany({
			where: {
				roleId: roleId
			},
			data: {
				roleId: undefined
			}
		})

		await prisma.clubRole.delete({
			where: {
				id: roleId
			}
		})

		//return

		return {
			success: true,
			message: 'Role Deleted!'
		};
	}
};

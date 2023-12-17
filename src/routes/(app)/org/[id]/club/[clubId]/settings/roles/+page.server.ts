import { prisma } from '$lib/prismaConnection.js';
import { error, redirect } from '@sveltejs/kit';
import {
	createPermissionList,
	createPermissionsCheck,
	type PermissionObject,
	defaultClubPermissionObject
} from '$lib/permissions.js';
import { formHandler } from '$lib/bodyguard.js';
import { z } from 'zod';

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
			error(400, 'How did we get here?');
		}

		if (!sessionCheck || !sessionCheck.user) {
			redirect(303, '/login');
		}

		//make sure the user has the proper perms

		let userPerms = { ...defaultClubPermissionObject };

		if (sessionCheck.user.id == club?.ownerId) {
			for (const key in userPerms) {
				(userPerms as PermissionObject)[key] = true;
			}
		} else {
			if (!sessionCheck.user.clubUsers[0] || !sessionCheck.user.clubUsers[0].role) {
				error(401, 'No Permissions');
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
			error(401, 'No Permissions');
		}

		//actually make the role
		await prisma.clubRole.create({
			data: {
				name: 'New Role',
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
	updateRole: formHandler(
		z.object({
			name: z.string().max(100).min(1),
			color: z.string(),
			roleId: z.number()
		}),
		async ({ name, color, roleId }, { params, cookies }) => {
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
				error(400, 'How did we get here?');
			}

			if (!sessionCheck || !sessionCheck.user) {
				redirect(303, '/login');
			}

			//make sure the user has the proper perms

			let userPerms = { ...defaultClubPermissionObject };

			if (sessionCheck.user.id == club?.ownerId) {
				for (const key in userPerms) {
					(userPerms as PermissionObject)[key] = true;
				}
			} else {
				if (!sessionCheck.user.clubUsers[0] || !sessionCheck.user.clubUsers[0].role) {
					error(401, 'No Permissions');
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
				error(401, 'No Permissions');
			}

			//grab the role
			const role = await prisma.clubRole.findFirst({
				where: {
					id: roleId
				}
			});

			if (!role || role?.clubId != club.id) {
				error(400, 'How did we get here?');
			}

			//update the role
			await prisma.clubRole.update({
				where: {
					id: roleId
				},
				data: {
					name,
					color
				}
			});

			//actually make the role

			return {
				success: true,
				message: 'Role Updated!'
			};
		}
	),

	deleteRole: formHandler(
		z.object({
			roleName: z.string().max(100).min(1),
			roleId: z.number()
		}),
		async ({ roleName, roleId }, { params, cookies }) => {
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
				error(400, 'How did we get here?');
			}

			if (!sessionCheck || !sessionCheck.user) {
				redirect(303, '/login');
			}

			//make sure the user has the proper perms

			let userPerms = { ...defaultClubPermissionObject };

			if (sessionCheck.user.id == club?.ownerId) {
				for (const key in userPerms) {
					(userPerms as PermissionObject)[key] = true;
				}
			} else {
				if (!sessionCheck.user.clubUsers[0] || !sessionCheck.user.clubUsers[0].role) {
					error(401, 'No Permissions');
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
				error(401, 'No Permissions');
			}

			//grab the role
			const role = await prisma.clubRole.findFirst({
				where: {
					id: roleId
				}
			});

			if (!role || role?.clubId != club.id) {
				error(400, 'How did we get here?');
			}

			if (role.name != roleName) {
				console.log(role.name, roleName);
				return {
					success: false,
					message: 'Role name typed wrong'
				};
			}

			//delete the role
			await prisma.clubUser.updateMany({
				where: {
					roleId: roleId
				},
				data: {
					roleId: undefined
				}
			});

			await prisma.clubRole.delete({
				where: {
					id: roleId
				}
			});

			return {
				success: true,
				message: 'Role Deleted!'
			};
		}
	)
};

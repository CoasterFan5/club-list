import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { createPermissionsFromUser } from '$lib/permissions.js';
import { prisma } from '$lib/server/prismaConnection.js';

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
						},
						orgUsers: {
							where: {
								organizationId: parseInt(params.id)
							},
							include: {
								role: true
							}
						}
					}
				}
			}
		});

		if (!sessionCheck || !sessionCheck.user) {
			redirect(303, '/login');
		}

		const club = await prisma.club.findUnique({
			where: {
				id: parseInt(params.clubId)
			}
		});

		if (!club) {
			error(400, 'Club not found');
		}

		// Make sure the user has the proper perms
		const userPermissions = createPermissionsFromUser(sessionCheck.user, club);

		if (!userPermissions.admin && !userPermissions.manageRoles) {
			error(401, 'No Permissions');
		}

		// Actually make the role
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
			roleId: z.string()
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
							},
							orgUsers: {
								where: {
									organizationId: parseInt(params.id)
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
				error(400, 'Club not found');
			}

			if (!sessionCheck || !sessionCheck.user) {
				redirect(303, '/login');
			}

			// Make sure the user has the proper perms
			const userPermissions = createPermissionsFromUser(sessionCheck.user, club);

			if (!userPermissions.admin && !userPermissions.manageRoles) {
				error(401, 'No Permissions');
			}

			// Grab the role
			const role = await prisma.clubRole.findFirst({
				where: {
					id: parseInt(roleId)
				}
			});

			if (!role || role?.clubId != club.id) {
				error(400, 'Role not found, or not in this club');
			}

			// Update the role
			await prisma.clubRole.update({
				where: {
					id: parseInt(roleId)
				},
				data: {
					name,
					color
				}
			});

			// Actually make the role

			return {
				success: true,
				message: 'Role Updated!'
			};
		}
	),

	deleteRole: formHandler(
		z.object({
			roleName: z.string().max(100).min(1),
			roleId: z.string()
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
							},
							orgUsers: {
								where: {
									organizationId: parseInt(params.id)
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
				error(400, 'Club not found');
			}

			if (!sessionCheck || !sessionCheck.user) {
				redirect(303, '/login');
			}

			// Make sure the user has the proper perms
			const userPermissions = createPermissionsFromUser(sessionCheck.user, club);

			if (!userPermissions.admin && !userPermissions.manageRoles) {
				error(401, 'No Permissions');
			}

			// Grab the role
			const role = await prisma.clubRole.findFirst({
				where: {
					id: parseInt(roleId)
				}
			});

			if (!role || role?.clubId != club.id) {
				error(400, 'Role not found, or not in this club');
			}

			if (role.name != roleName) {
				return {
					success: false,
					message: 'Role name typed wrong'
				};
			}

			// Delete the role
			await prisma.clubUser.updateMany({
				where: {
					roleId: parseInt(roleId)
				},
				data: {
					roleId: undefined
				}
			});

			await prisma.clubRole.delete({
				where: {
					id: parseInt(roleId)
				}
			});

			return {
				success: true,
				message: 'Role Deleted!'
			};
		}
	)
};

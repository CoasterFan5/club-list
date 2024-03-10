import { PutObjectCommand } from '@aws-sdk/client-s3';
import { redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { z } from 'zod';

import { bucket, mediaurl } from '$env/static/private';
import { formHandler } from '$lib/bodyguard.js';
import { createClubPermissionsFromUser } from '$lib/permissions/clubPermissions.js';
import { createOrgPermissionsFromUser } from '$lib/permissions/orgPermissions.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { S3 } from '$lib/server/s3.js';
import { verifySession } from '$lib/server/verifySession';

export const load = async ({ parent, params }) => {
	const parentData = await parent();

	if (!parentData.clubPerms.viewSettings && !parentData.clubPerms.admin) {
		throw redirect(303, `/org/${params.id}/club/${params.clubId}`);
	}
};

export const actions = {
	updateClub: formHandler(
		z.object({
			clubName: z.string().min(1),
			joinable: z.coerce.boolean()
		}),
		async ({ clubName, joinable }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'), {
				clubUsers: {
					select: {
						owner: true,
						clubId: true,
						role: {
							select: {
								permissionInt: true
							}
						}
					}
				},
				orgUsers: {
					include: {
						role: true
					}
				}
			});

			const club = await prisma.club.findFirst({
				where: {
					id: parseInt(params.clubId)
				}
			});

			if (!club) {
				return {
					success: false,
					message: 'Club not found'
				};
			}

			const userPermission = createClubPermissionsFromUser(user, club);

			if (!userPermission.admin && !userPermission.updateAppearance) {
				return {
					success: false,
					message: 'No Permissions'
				};
			}

			type ClubDataObject = {
				name: string;
				imageURL?: string;
				openToJoin: boolean;
			};

			const dataObject: ClubDataObject = {
				name: clubName,
				openToJoin: joinable
			};

			// Now, we can update the club
			await prisma.club.update({
				where: {
					id: parseInt(params.clubId)
				},
				data: dataObject
			});

			return {
				success: true,
				message: 'Club Settings Updated!'
			};
		}
	),
	deleteClub: async ({ cookies, params }) => {
		const club = await prisma.club.findUnique({
			where: {
				id: parseInt(params.clubId)
			}
		});

		if (!club) {
			return {
				success: false,
				message: 'No Club'
			};
		}

		const user = await verifySession(cookies.get('session'), {
			clubUsers: {
				where: {
					clubId: club.id
				}
			},
			orgUsers: {
				where: {
					organizationId: club.organizationId
				},
				include: {
					role: true
				}
			}
		});

		const isOwner = user?.clubUsers[0]?.owner;
		const isOrganizationAdmin = createOrgPermissionsFromUser(user).admin;

		if (!isOwner && !isOrganizationAdmin) {
			return {
				success: false,
				message: !isOwner
					? 'You are not the owner of this club'
					: 'You are not an admin of this organization'
			};
		}

		await prisma.club.delete({
			where: {
				id: club.id
			}
		});

		return {
			success: true,
			message: 'Club Deleted'
		};
	},
	uploadClubImage: async ({ cookies, request, params }) => {
		const formData = await request.formData();

		const club = await prisma.club.findFirst({
			where: {
				id: parseInt(params.clubId)
			}
		});

		if (!club) {
			return {
				success: false,
				message: 'No club.'
			};
		}

		const user = await verifySession(cookies.get('session'), {
			clubUsers: {
				include: {
					role: true
				}
			},
			orgUsers: {
				include: {
					role: true
				}
			}
		});

		const perms = createClubPermissionsFromUser(user, club);

		if (!perms.admin && !perms.updateAppearance) {
			return {
				success: false,
				message: 'No perms'
			};
		}

		try {
			if (!(await formData.get('file'))) {
				return {
					success: false,
					message: 'no file.'
				};
			}

			const file: File = (await formData.get('file')) as File;

			if (!file) {
				return {
					success: false,
					message: 'no file.'
				};
			}

			const key = `clubImages/${crypto.randomBytes(16).toString('hex')}/${file.name}`;

			if (file.size > 10e6) {
				return {
					success: false,
					message: 'Max size: 6mb'
				};
			}
			if (key.length > 200) {
				return {
					success: false,
					message: 'File name too long!'
				};
			}

			const fileBuffer = await file.arrayBuffer();
			await S3.send(
				new PutObjectCommand({
					Bucket: bucket,
					Key: key,
					Body: new Uint8Array(fileBuffer)
				})
			);

			await prisma.club.update({
				where: {
					id: club.id
				},
				data: {
					imageURL: `${mediaurl}/${key}`
				}
			});

			return {
				success: true,
				message: 'File uploaded!'
			};
		} catch (e) {
			console.error(e);
			return {
				success: false,
				message: 'General error caught!'
			};
		}
	}
};

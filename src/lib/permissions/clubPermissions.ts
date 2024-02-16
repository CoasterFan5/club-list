import type { Prisma } from '@prisma/client';

import { createOrgPermissionsCheck } from './orgPermissions';
import { createAllPermissionObject, createPermissionsCheck } from './permissions';

export const keys = [
	'admin',
	'updateAppearance',
	'updateDescription',
	'manageAnnouncements',
	'manageRoles',
	'manageEvents',
	'manageMembers'
] as const;
export type ClubPermissionKeys = typeof keys;

export type TypedPermissionObject<K> = Record<ClubPermissionKeys[number], K>;

export type PermissionObject = TypedPermissionObject<boolean>;

export const defaultClubPermissionObject: PermissionObject = Object.freeze({
	admin: false,
	updateAppearance: false,
	updateDescription: false,
	manageAnnouncements: false,
	manageRoles: false,
	manageEvents: false,
	manageMembers: false
});

export const permissionKeys = Object.freeze(
	Object.keys(defaultClubPermissionObject) as (keyof PermissionObject)[]
);

export const permissionObjectDescriptions: TypedPermissionObject<string> = Object.freeze({
	admin: 'Gives role all permissions',
	updateAppearance: 'Allows changing the banner and name of the club',
	updateDescription: 'Update the about me for the club',
	manageAnnouncements: 'Allows a user to send out announcements',
	manageRoles: 'Allows a user to create new roles',
	manageEvents: 'Allows a user to create new events',
	manageMembers: 'Allows a user to manage other members of the club'
});

export const createClubPermissionsCheck = createPermissionsCheck(keys);

type UserLike = Prisma.UserGetPayload<{
	select: {
		id: true;
		clubUsers: {
			select: {
				clubId: true;
				owner: true;
				role: {
					select: {
						permissionInt: true;
					};
				};
			};
		};
		orgUsers: {
			select: {
				organizationId: true;
				owner: true;
				role: {
					select: {
						permissionInt: true;
					};
				};
			};
		};
	};
}>;

interface ClubLike {
	id: number;
	organizationId: number;
}

export const createClubPermissionsFromUser = (
	user?: UserLike | null,
	club?: ClubLike | null
): PermissionObject => {
	// User has no club users, thus, no permissions
	if (!user?.clubUsers) {
		return defaultClubPermissionObject;
	}

	const clubUser = user?.clubUsers.find((clubUser) => clubUser.clubId == club?.id);

	if (user.orgUsers) {
		const orgUser = user?.orgUsers.find(
			(orgUser) => orgUser.organizationId == club?.organizationId
		);

		// Permissible if the user is the owner of the organization
		if (orgUser?.owner) {
			return createAllPermissionObject(keys);
		}

		// If the user has the right permissions for the organization, they can manage clubs
		if (orgUser?.role?.permissionInt) {
			const orgPerms = createOrgPermissionsCheck(orgUser.role.permissionInt);

			if (orgPerms.admin || orgPerms.manageClubs) {
				return createAllPermissionObject(keys);
			}
		}
	}

	if (clubUser?.owner) {
		// Create a permission object with all permissions
		return createAllPermissionObject(keys);
	} else {
		const clubUser = user?.clubUsers.find((clubUser) => clubUser.clubId == club?.id);

		if (!clubUser?.role) {
			return defaultClubPermissionObject;
		}

		return createClubPermissionsCheck(clubUser.role.permissionInt);
	}
};

import type { Prisma } from '@prisma/client';

import { createAllPermissionObject, createNonePermissionObject, createPermissionsCheck, type PermissionDescriptions } from "./permissions";

export const orgPermissionObjectDescriptions = Object.freeze({
	admin: 'Gives role all permissions',
	viewSettings: 'View settings for the organization',
	inviteMembers: 'Invite members to the organization',
	updateAppearance: 'Update the appearance of the organization',
	manageVisibility: 'Manage the visibility of the organization',
	viewMembers: 'View members of the organization',
	assignRoles: 'Assign roles to members of the organization',
	banMembers: 'Ban members from the organization',
	kickMembers: 'Kick members from the organization',
	manageRoles: 'Manage roles for the organization',
	createClubs: 'Create clubs for the organization',
	manageClubs: 'Manage clubs for the organization'
}) satisfies PermissionDescriptions;

export type OrgPermissionKeys = keyof typeof orgPermissionObjectDescriptions;
export type TypedPermissionObject<K> = Record<OrgPermissionKeys, K>;
export type PermissionObject = TypedPermissionObject<boolean>;

export const orgKeys = Object.keys(orgPermissionObjectDescriptions) as OrgPermissionKeys[];

export const createOrgPermissionsCheck = createPermissionsCheck(orgKeys);

type UserLike = Prisma.UserGetPayload<{
	select: {
		id: true;
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

interface OrgLike {
	id: number;
}

export const createOrgPermissionsFromUser = (
	user?: UserLike | null,
	org?: OrgLike | null
): PermissionObject => {
	const clubUser = user?.orgUsers.find((orgUser) => orgUser.organizationId == org?.id);
	if (clubUser?.owner) {
		// Create a permission object with all permissions
		return createAllPermissionObject(orgKeys);
	} else {
		const clubUser = user?.orgUsers.find((orgUser) => orgUser.organizationId == org?.id);

		if (!clubUser?.role) {
			return createNonePermissionObject(orgKeys);
		}

		return createOrgPermissionsCheck(clubUser.role.permissionInt);
	}
};

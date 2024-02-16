import { createOrgPermissionsCheck } from './orgPerms';

export const keys = [
	'admin',
	'updateAppearance',
	'updateDescription',
	'manageAnnouncements',
	'manageRoles',
	'manageEvents',
	'manageMembers'
] as const;
export type PermissionKeys = typeof keys;

export type TypedPermissionObject<K> = Record<PermissionKeys[number], K>;

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

export const permissionObjectDescriptions: TypedPermissionObject<string> = Object.freeze({
	admin: 'Gives role all permissions',
	updateAppearance: 'Allows changing the banner and name of the club',
	updateDescription: 'Update the about me for the club',
	manageAnnouncements: 'Allows a user to send out announcements',
	manageRoles: 'Allows a user to create new roles',
	manageEvents: 'Allows a user to create new events',
	manageMembers: 'Allows a user to manage other members of the club'
});

export const permissionKeys = Object.freeze(
	Object.keys(defaultClubPermissionObject) as (keyof PermissionObject)[]
);

export const createPermissionNumber = (permissionObject: PermissionObject): number => {
	let permissionInt = 0;
	let loops = 0;
	for (const permission of permissionKeys) {
		if (permissionObject[permission]) {
			permissionInt += 2 ** loops;
		}
		loops++;
	}
	return permissionInt;
};

export const createPermissionsCheck = (integer: number): PermissionObject => {
	return Object.fromEntries(
		permissionKeys.map((item, index) => {
			const int = 2 ** index;
			return [item, (int & integer) > 0];
		})
	) as unknown as PermissionObject;
};

interface UserLike {
	id: number;
	clubUsers:
		| {
				clubId: number;
				owner: boolean;
				role: {
					permissionInt: number;
				} | null;
		  }[]
		| null;
	orgUsers:
		| {
				organizationId: number;
				owner: boolean;
				role: {
					permissionInt: number;
				} | null;
		  }[]
		| null;
}

interface ClubLike {
	id: number;
	organizationId: number;
}

export const createPermissionsFromUser = (
	user?: UserLike | null,
	club?: ClubLike | null
): PermissionObject => {
	if (!user?.clubUsers) {
		return defaultClubPermissionObject;
	}

	const clubUser = user?.clubUsers.find((clubUser) => clubUser.clubId == club?.id);

	if (user.orgUsers) {
		const orgUser = user?.orgUsers.find(
			(orgUser) => orgUser.organizationId == club?.organizationId
		);

		if (orgUser?.owner) {
			return createPermissionsCheck(2 ** permissionKeys.length - 1);
		}

		//Create an org permissions check
		if (orgUser?.role?.permissionInt) {
			const orgPerms = createOrgPermissionsCheck(orgUser.role.permissionInt);

			if (orgPerms.admin || orgPerms.manageClubs) {
				return createPermissionsCheck(2 ** permissionKeys.length - 1);
			}
		}
	}

	if (clubUser?.owner) {
		// Create a permission object with all permissions
		return createPermissionsCheck(2 ** permissionKeys.length - 1);
	} else {
		const clubUser = user?.clubUsers.find((clubUser) => clubUser.clubId == club?.id);

		if (!clubUser?.role) {
			return defaultClubPermissionObject;
		}

		return createPermissionsCheck(clubUser.role.permissionInt);
	}
};

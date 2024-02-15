export const keys = [
	'admin',
	'viewSettings',
	'inviteMembers',
	'updateAppearance',
	'manageVisibility',
	'viewMembers',
	'assignRoles',
	'banMembers',
	'kickMembers',
	'manageRoles',
	'createClubs',
	'manageClubs'
] as const;
export type orgPermissionKeys = typeof keys;

export type TypedPermissionObject<K> = Record<orgPermissionKeys[number], K>;

export type PermissionObject = TypedPermissionObject<boolean>;

export const defaultOrgPermissionObject: PermissionObject = Object.freeze({
	admin: false,
	viewSettings: false,
	inviteMembers: false,
	updateAppearance: false,
	manageVisibility: false,
	viewMembers: false,
	assignRoles: false,
	banMembers: false,
	kickMembers: false,
	manageRoles: false,
	createClubs: false,
	manageClubs: false
});

export const orgPermissionObjectDescriptions: TypedPermissionObject<string> = Object.freeze({
	admin: 'false',
	viewSettings: 'false',
	inviteMembers: 'false',
	updateAppearance: 'false',
	manageVisibility: 'false',
	viewMembers: 'false',
	assignRoles: 'false',
	banMembers: 'false',
	kickMembers: 'false',
	manageRoles: 'false',
	createClubs: 'false',
	manageClubs: 'false'
});

export const orgPermissionKeys = Object.freeze(
	Object.keys(defaultOrgPermissionObject) as (keyof PermissionObject)[]
);

export const createOrgPermissionNumber = (permissionObject: PermissionObject): number => {
	let permissionInt = 0;
	let loops = 0;
	for (const permission of orgPermissionKeys) {
		if (permissionObject[permission]) {
			permissionInt += 2 ** loops;
		}
		loops++;
	}
	return permissionInt;
};

export const createOrgPermissionsCheck = (integer: number): PermissionObject => {
	return Object.fromEntries(
		orgPermissionKeys.map((item, index) => {
			const int = 2 ** index;
			return [item, (int & integer) > 0];
		})
	) as unknown as PermissionObject;
};

interface UserLike {
	id: number;
	orgUsers: {
		organizationId: number;
		owner: boolean;
		role: {
			permissionInt: number;
		} | null;
	}[];
}

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
		return createOrgPermissionsCheck(2 ** orgPermissionKeys.length - 1);
	} else {
		const clubUser = user?.orgUsers.find((orgUser) => orgUser.organizationId == org?.id);

		if (!clubUser?.role) {
			return defaultOrgPermissionObject;
		}

		return createOrgPermissionsCheck(clubUser.role.permissionInt);
	}
};

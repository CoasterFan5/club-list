export interface TypedPermissionObject<K> {
	admin: K;
	updateAppearance: K;
	updateDescription: K;
	manageAnnouncements: K;
	manageRoles: K;
	manageEvents: K;
}

export type PermissionObject = TypedPermissionObject<boolean>;

export const defaultClubPermissionObject: PermissionObject = Object.freeze({
	admin: false,
	updateAppearance: false,
	updateDescription: false,
	manageAnnouncements: false,
	manageRoles: false,
	manageEvents: false
});

export const permissionObjectDescriptions: TypedPermissionObject<string> = Object.freeze({
	admin: 'Gives role all permissions',
	updateAppearance: 'Allows changing the banner and name of the club',
	updateDescription: 'Update the about me for the club',
	manageAnnouncements: 'Allows a user to send out announcements',
	manageRoles: 'Allows a user to create new roles',
	manageEvents: 'Allows a user to create new events'
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

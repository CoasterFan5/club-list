export type PermissionObject = {
	admin: boolean;
	updateAppearance: boolean;
	updateDescription: boolean;
	manageAnnouncements: boolean;
	manageRoles: boolean;
};

export const defaultClubPermissionObject = Object.freeze({
	admin: false,
	updateAppearance: false,
	updateDescription: false,
	manageAnnouncements: false,
	manageRoles: false
});

const permissionKeys = Object.keys(defaultClubPermissionObject) as (keyof PermissionObject)[];

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
	) as PermissionObject;
};

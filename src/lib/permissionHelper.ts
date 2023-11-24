type PermissionList = string[];
export type PermissionObject = {
	[key: string]: boolean;
};

export const createPermissionList = (permissionObject: PermissionObject) => {
	const permList: PermissionList = [];
	for (const key of Object.keys(permissionObject)) {
		permList.push(key);
	}
	return permList;
};

export const createPermissions = (permissionObject: PermissionObject): number => {
	let permissionInt = 0;
	let loops = 0;
	for (const permission of Object.keys(permissionObject)) {
		if (permissionObject[permission]) {
			permissionInt += 2 ** loops;
		}
		loops++;
	}
	return permissionInt;
};

export const ceratePermissionsCheck = (
	permissionList: PermissionList,
	permissionInteger: number
) => {
	const outObject: PermissionObject = {};
	permissionList.forEach((item, index) => {
		const exampleInt = 2 ** index;
		outObject[item] = (exampleInt & permissionInteger) > 0;
	});
	return outObject;
};

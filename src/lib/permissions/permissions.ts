type Permissions<K extends readonly string[], V> = Record<K[number], V>;
type PermissionObject<T extends readonly string[]> = Permissions<T, boolean>;
export type PermissionDescriptions = Permissions<readonly string[], string>;

/**
 * Generates a function that takes a permission integer and returns
 * its respective permission object.
 *
 * Note: Since this is a curried function, the keys
 * can be given in advance to make a function that generates
 * permission objects with the same keys.
 */
export function createPermissionsCheck<T extends readonly string[]>(
	orgPermissionKeys: readonly [...T]
): (integer: number) => PermissionObject<T> {
	return (integer) =>
		Object.fromEntries(
			orgPermissionKeys.map((item, index) => {
				const int = 2 ** index;
				return [item, (int & integer) > 0];
			})
		) as unknown as PermissionObject<T>;
}

/**
 * Generates a permission integer from a permission object.
 *
 * The reverse of {@link createPermissionsCheck}.
 */
export function createPermissionNumber<T extends readonly string[]>(
	permissionObject: PermissionObject<T>
): number {
	let permissionInt = 0;
	let loops = 0;
	for (const permission of Object.keys(permissionObject)) {
		if (permissionObject[permission as T[number]]) {
			permissionInt += 2 ** loops;
		}
		loops++;
	}
	return permissionInt;
}

/**
 * Utility function to create a permission object with no permissions.
 *
 * See {@link createPermissionsCheck}.
 */
export function createNonePermissionObject<T extends readonly string[]>(
	orgPermissionKeys: readonly [...T]
): PermissionObject<T> {
	return createPermissionsCheck(orgPermissionKeys)(0);
}

/**
 * Utility function to create a permission object with all permissions.
 *
 * See {@link createPermissionsCheck}.
 */
export function createAllPermissionObject<T extends readonly string[]>(
	orgPermissionKeys: readonly [...T]
): PermissionObject<T> {
	return createPermissionsCheck(orgPermissionKeys)(2 ** orgPermissionKeys.length - 1);
}

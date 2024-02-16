import { describe, expect, it } from 'vitest';

import {
	createClubPermissionsCheck,
	permissionObjectDescriptions
} from '$lib/permissions/clubPermissions';
import { createNonePermissionObject, createPermissionNumber } from '$lib/permissions/permissions';

describe('permission system', () => {
	const keys = Object.keys(permissionObjectDescriptions);
	const permissionAmount = keys.length;

	it('has more permissions than 0', () => {
		expect(keys.length).toBeGreaterThan(0);
	});

	it('is reversible', () => {
		for (let i = 0; i < 2 ** permissionAmount; i++) {
			const permissionObject = createClubPermissionsCheck(i);
			expect(createPermissionNumber(permissionObject)).toBe(i);
		}
	});

	it('works for all integers', () => {
		const permissionObject = createClubPermissionsCheck(2 ** permissionAmount - 1);
		expect(permissionObject).toEqual(Object.fromEntries(keys.map((item) => [item, true])));
	});

	it('works for 0', () => {
		const permissionObject = createClubPermissionsCheck(0);
		expect(permissionObject).toEqual(createNonePermissionObject(keys));
	});

	it('works for 0b101', () => {
		const permissionObject = createClubPermissionsCheck(0b101);
		expect(permissionObject).toEqual({
			...createNonePermissionObject(keys),
			admin: true,
			updateDescription: true
		});
	});
});

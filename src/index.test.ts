import { describe, expect, it } from 'vitest';

import {
	createClubPermissionsCheck,
	defaultClubPermissionObject
} from '$lib/permissions/clubPermissions';
import { createPermissionNumber } from '$lib/permissions/permissions';

describe('permission system', () => {
	const permissionAmount = Object.keys(defaultClubPermissionObject).length;

	it('has more permissions than 0', () => {
		expect(Object.keys(defaultClubPermissionObject).length).toBeGreaterThan(0);
	});

	it('is reversible', () => {
		for (let i = 0; i < 2 ** permissionAmount; i++) {
			const permissionObject = createClubPermissionsCheck(i);
			expect(createPermissionNumber(permissionObject)).toBe(i);
		}
	});

	it('works for all integers', () => {
		const permissionObject = createClubPermissionsCheck(2 ** permissionAmount - 1);
		expect(permissionObject).toEqual(
			Object.fromEntries(Object.keys(defaultClubPermissionObject).map((item) => [item, true]))
		);
	});

	it('works for 0', () => {
		const permissionObject = createClubPermissionsCheck(0);
		expect(permissionObject).toEqual(defaultClubPermissionObject);
	});

	it('works for 0b101', () => {
		const permissionObject = createClubPermissionsCheck(0b101);
		expect(permissionObject).toEqual({
			...defaultClubPermissionObject,
			admin: true,
			updateDescription: true
		});
	});
});

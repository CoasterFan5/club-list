import {
	createPermissionNumber,
	createPermissionsCheck,
	defaultClubPermissionObject
} from '$lib/permissions';
import { describe, it, expect } from 'vitest';

describe('permission system', () => {
	const permissionAmount = Object.keys(defaultClubPermissionObject).length;

	it('has more permissions than 0', () => {
		expect(Object.keys(defaultClubPermissionObject).length).toBeGreaterThan(0);
	});

	it('is reversible', () => {
		for (let i = 0; i < 2 ** permissionAmount; i++) {
			const permissionObject = createPermissionsCheck(i);
			expect(createPermissionNumber(permissionObject)).toBe(i);
		}
	});

	it('works for all integers', () => {
		const permissionObject = createPermissionsCheck(2 ** permissionAmount - 1);
		expect(permissionObject).toEqual(
			Object.fromEntries(Object.keys(defaultClubPermissionObject).map((item) => [item, true]))
		);
	});

	it('works for 0', () => {
		const permissionObject = createPermissionsCheck(0);
		expect(permissionObject).toEqual(defaultClubPermissionObject);
	});

	it('works for 0b101', () => {
		const permissionObject = createPermissionsCheck(0b101);
		expect(permissionObject).toEqual({
			...defaultClubPermissionObject,
			admin: true,
			updateDescription: true
		});
	});
});

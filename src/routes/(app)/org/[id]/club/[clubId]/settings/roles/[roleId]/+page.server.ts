import { formHandler } from '$lib/bodyguard.js';
import { z } from 'zod';

export const actions = {
	updatePermissions: formHandler(
		z.object({
			permissionInt: z.number(),
			name: z.string(),
		}),
		async ({permissionInt}) => {
			console.log(permissionInt)
			return {}
	})
}
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';

export const actions = {
	submitFeedback: formHandler(z.object({
		rating: z.coerce.number(),
		description: z.string()
	}), async({rating, description}, {cookies}) => {

	})
}
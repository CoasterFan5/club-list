import { Bodyguard, type BodyguardConfig } from '@auth70/bodyguard';
import { fail } from '@sveltejs/kit';
import type { ZodType } from 'zod';
import { fromZodError } from 'zod-validation-error';
import type { RequestEvent } from '@sveltejs/kit';

const bodyguard = new Bodyguard({
	castNumbers: true
});

export function formHandler<Z extends ZodType, E extends RequestEvent>(
	schema: Z,
	onSuccess: (data: Z['_output'], event: E) => Promise<unknown>,
	config?: Partial<BodyguardConfig>
): (event: E) => Promise<unknown> {
	return async (event: E) => {
		const data = await bodyguard.softForm(event.request, undefined, {
			...config
		});

		if (!data.success)
			return fail(400, {
				message: data.error
			});

		const parsed = schema.safeParse(data.value);

		if (!parsed.success) {
			console.error('Bodyguard fail:', parsed);
			const error = fromZodError(parsed.error);
			return fail(400, {
				success: false,
				message: error.message
			});
		}

		return await onSuccess(parsed.data, event);
	};
}

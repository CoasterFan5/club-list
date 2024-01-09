import { Bodyguard, type BodyguardConfig } from '@auth70/bodyguard';
import { fail, type ActionFailure, type RequestEvent } from '@sveltejs/kit';
import type { ZodType } from 'zod';
import { fromZodError } from 'zod-validation-error';

const bodyguard = new Bodyguard();

export function formHandler<Z extends ZodType, E extends RequestEvent, K>(
	schema: Z,
	onSuccess: (data: Z['_output'], event: E) => Promise<K>,
	config?: Partial<BodyguardConfig>
): (event: E) => Promise<K | ActionFailure<{ message: string }>> {
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
			// TODO: more human-readable error messages (custom error mapping)
			const error = fromZodError(parsed.error, { prefix: null });
			return fail(400, {
				success: false,
				message: error.message
			});
		}

		return await onSuccess(parsed.data, event);
	};
}

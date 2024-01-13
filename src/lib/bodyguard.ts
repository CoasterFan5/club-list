import { Bodyguard, type BodyguardConfig } from '@auth70/bodyguard';
import { fail, type ActionFailure, type RequestEvent } from '@sveltejs/kit';
import { type ZodObject, type ZodRawShape } from 'zod';
import { fromZodError } from 'zod-validation-error';

const bodyguard = new Bodyguard();

export function formHandler<S extends ZodRawShape, Z extends ZodObject<S>, E extends RequestEvent, K>(
	schema: Z, // Zod schema
	onSuccess: (data: Z['_output'], event: E) => Promise<K>, // User provided function to run on valid schema
	config?: Partial<BodyguardConfig> // Bodyguard config
): (event: E) => Promise<K | ActionFailure<{ message: string }>> {
	return async (event: E) => {

		// Parse form
		const data = await bodyguard.softForm(event.request, undefined, {
			...config
		});

		// Check if bodyguard failed to parse form
		if (!data.success) {
			return fail(400, {
				message: data.error
			});
		}


		// Let zod parse the validated client form data
		const parsed = schema.strict().safeParse(data.value);

		// Check if zod failed to parse the form
		if (!parsed.success) {
			console.error('Bodyguard fail:', parsed);
			// TODO: more human-readable error messages (custom error mapping)
			const error = fromZodError(parsed.error, { prefix: null });
			console.log(error.message)
			return fail(400, {
				success: false,
				message: error.message
			});
		}

		return await onSuccess(parsed.data, event);
	};
}

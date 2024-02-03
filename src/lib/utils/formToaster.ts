import { z } from 'zod';

import { addToast } from '$lib/components/toaster';

const formSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional()
}).optional().nullable();


function err(form: unknown): never {
	throw Error(`Form's message &/o success message is null (${JSON.stringify(form)}) Please report this error to the authors`);
}

type Form = z.infer<typeof formSchema>;

interface Options {
	forceSuccessMessage?: boolean;
	callback?: (form: Form) => void;
}

export function handleForm(unparsedForm: unknown, successMessage?: string, options?: Options) {
	const form: Form = formSchema.safeParse(unparsedForm);
	if (options?.callback) {
		options.callback(form);
	}

	if (form !== null && form !== undefined) {
		console.log(form)
		if (form.success) {
			addToast({
				type: 'success',
				message: options?.forceSuccessMessage
					? successMessage || form.message || err(form)
					: form.message || successMessage || err(form),
				life: 3000
			});
		} else {
			addToast({
				type: 'error',
				message: form.message || 'An error occurred!',
				life: 3000
			});
		}
	}
}

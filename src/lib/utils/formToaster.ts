import { z } from 'zod';

import { addToast } from '$lib/components/toaster';

const formSchema = z
	.object({
		success: z.boolean(),
		data: z.object({
			success: z.boolean(),
			message: z.string(),
		}).optional()
	})
	.optional()
	.nullable();

type Form = z.infer<typeof formSchema>;

interface Options {
	forceSuccessMessage?: boolean;
	callback?: (form: Form) => void;
}

export function handleForm(unparsedForm: unknown, successMessage?: string, options?: Options) {
	const form: Form = formSchema.safeParse(unparsedForm);

	if (form.data === null) {
		return;
	}

	if (options?.callback) {
		options.callback(form);
	}

	const formData = form.data;

	if (form !== null && form !== undefined) {
		if (formData.success) {
			addToast({
				type: 'success',
				message: form.data.message || successMessage || 'success!',
				life: 3000
			});
		} else {
			addToast({
				type: 'error',
				message: form.data.message || 'An error occurred!',
				life: 3000
			});
		}
	}
}

import { z } from 'zod';

import { addToast } from '$lib/components/toaster';

const formSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional().nullable()
});

type Form = z.infer<typeof formSchema>;

interface Options {
	callback?: (form: Form) => void;
}

export function handleForm(unparsedForm: unknown, successMessage?: string, options?: Options) {
	if (!unparsedForm || !unparsedForm) return;

	let form: Form;
	try {
		form = formSchema.parse(unparsedForm);
	} catch (e) {
		return;
	}

	if (form.success == undefined) {
		return;
	}

	if (options?.callback) {
		options.callback(form);
	}

	if (form !== null && form !== undefined) {
		if (form.success) {
			addToast({
				type: 'success',
				message: form.message || successMessage || 'success!',
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

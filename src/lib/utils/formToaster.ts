import { z } from 'zod';

import { addToast } from '$lib/components/toaster';

const formSchema = z
	.object({
		success: z.boolean().optional(),
		message: z.string().optional(),
		data: z.unknown().optional().nullable()
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

	const formData = form.data as {
		success: boolean | undefined,
		message: string | undefined
	}

	if (form !== null && form !== undefined) {
		if (formData.success) {
			addToast({
				type: 'success',
				message: formData.message || successMessage || "success!",
				life: 3000
			});
		} else {
			addToast({
				type: 'error',
				message: formData.message || 'An error occurred!',
				life: 3000
			});
		}
	}
}

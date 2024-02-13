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

function err(form: unknown): undefined {
	console.error(
		`Form's message &/o success message is null (${JSON.stringify(form)}) Please report this error to the authors`
	);
	return undefined;
}

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

	if (form !== null && form !== undefined) {
		if (form.success) {
			const message = options?.forceSuccessMessage
				? successMessage || form.message || err(form)
				: form.message || successMessage || err(form);

			if (message) {
				addToast({
					type: 'success',
					message,
					life: 3000
				});
			}
		} else {
			addToast({
				type: 'error',
				message: form.message || 'An error occurred!',
				life: 3000
			});
		}
	}
}

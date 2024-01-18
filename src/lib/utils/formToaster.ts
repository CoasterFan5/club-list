import { addToast } from '$lib/components/toaster';

interface Form {
	success?: boolean;
	message?: string;
}

function err(): never {
	throw Error("Form's message & success message is null. Please report this error to the authors");
}

interface Options {
	forceSuccessMessage?: boolean;
	callback?: (form: Form | null) => void;
}

export function handleForm(form: Form | null, successMessage?: string, options?: Options) {
	if (options?.callback) {
		options.callback(form);
	}
	if (form) {
		if (form.success) {
			addToast({
				type: 'success',
				message: options?.forceSuccessMessage
					? successMessage || form.message || err()
					: form.message || successMessage || err(),
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

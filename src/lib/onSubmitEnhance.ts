import type { ActionResult, SubmitFunction } from '@sveltejs/kit';

export const onSubmit: (
	success: (result: ActionResult<Record<string, any>, Record<string, any>>) => void,
	options?: Parameters<SubmitFunction>[0]
) => SubmitFunction = (success) => {
	return () => {
		return async ({ result, update }) => {
			await update();
			success(result);
		};
	};
};

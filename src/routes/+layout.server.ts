import { BETA } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	return {
		beta: BETA.toLowerCase() == 'true'
	};
};

import { BETA } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

export let load: LayoutServerLoad = () => {
	return {
		beta: BETA.toLowerCase() == 'true'
	};
};

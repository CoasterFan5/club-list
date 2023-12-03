import { BETA } from '$env/static/private';

export const load = () => {
	return {
		beta: BETA.toLowerCase() == 'true'
	};
};

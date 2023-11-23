import { BETA } from '$env/static/private';

export const load = ({ url }) => {
	return {
		beta: BETA.toLowerCase() == 'true',
		pathname: url.pathname,
	};
};

import { verifySession } from '$lib/verifySession.js';

export const load = async ({ cookies, url }) => {
	// if the user isn't logged in, we need to redirect them to the login page
	const user = await verifySession(cookies.get('session'));

	const isInClub = /org\/\d+\/club/.test(url.pathname);
	const pathType = isInClub ? '__club__' : url.pathname;

	return {
		user: user,
		pathType
	};
};

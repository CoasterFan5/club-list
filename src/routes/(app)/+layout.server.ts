import { verifyOptionalSession } from '$lib/server/verifySession.js';

export const load = async ({ cookies, url }) => {
	// If the user isn't logged in, we need to redirect them to the login page
	const user = await verifyOptionalSession(cookies.get('session'));

	const isInClub = /org\/\d+\/club/.test(url.pathname);
	const pathType = isInClub ? '__club__' : url.pathname;

	return {
		user,
		pathType
	};
};

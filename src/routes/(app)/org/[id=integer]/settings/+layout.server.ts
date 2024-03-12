import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const parentData = await parent();

	if (!parentData.orgUserPermissions.admin && !parentData.orgUserPermissions.viewSettings) {
		throw redirect(303, '/login');
	}

	return {};
};

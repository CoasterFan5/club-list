import { error } from '@sveltejs/kit';

export const load = async ({ params, parent }) => {
	const data = await parent();

	const role = data.roles.find((role) => role.id === parseInt(params.roleId));

	if (!role) {
		error(404, 'Role not found');
	}

	return {
		role
	};
};

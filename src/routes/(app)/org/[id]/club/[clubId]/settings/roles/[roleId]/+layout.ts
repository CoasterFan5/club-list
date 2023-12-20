export const load = async ({ params, parent }) => {
	const data = await parent();

	const role = data.roles.find((role) => role.id === parseInt(params.roleId));

	if (!role) {
		throw Error('testing...');
	}

	return {
		role
	};
};

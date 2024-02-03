import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ parent }) => {
	const { user } = await parent();

	let orgUsers;

	if (user != null) {
		orgUsers = await prisma.orgUser.findMany({
			where: {
				userId: user?.id
			},
			include: {
				organization: {
					include: {
						slug: true
					}
				}
			}
		});

		return {
			user: {
				...user,
				orgUsers
			}
		};
	} else {
		return {};
	}
};

import { prisma } from '$lib/server/prismaConnection';

export const load = async ({ params }) => {
	const org = await prisma.organization.findFirst({
		where: {
			joinCode: params.code
		},
        select: {
            name: true
        }
	});

	if (!org) {
		return {
			status: 404,
			error: 'Organization not found'
		};
	}
    
    return {
        org
    }
};

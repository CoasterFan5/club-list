import { prisma } from '$lib/server/prismaConnection';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const org = await prisma.organization.findFirst({
		where: {
			joinCode: params.code
		},
        select: {
            name: true
        }
	});

	if (org === null) {
        error(404, {
            message: 'Organization not found'
        })
	}

    return {
        org
    }
};

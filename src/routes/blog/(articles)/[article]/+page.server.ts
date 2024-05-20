import { error } from '@sveltejs/kit';

import { prisma } from '$lib/server/prismaConnection.js';

export const load = async ({ params }) => {
	const article = await prisma.blogArticle.findFirst({
		where: {
			articleURL: params.article
		}
	});

	if (!article) {
		throw error(404, 'No article found');
	}

	return {
		article
	};
};

import { error } from '@sveltejs/kit';

import { prisma } from '$lib/server/prismaConnection.js';

export const load = async ({ params }) => {
	const article = await prisma.blogArticle.findFirst({
		where: {
			articleURL: params.article
		},
		include: {
			tagAssignments: {
				include: {
					tag: true
				}
			}
		}
	});

	if (!article?.published) {
		throw error(404, 'No article found');
	}

	if (!article) {
		throw error(404, 'No article found');
	}

	return {
		article
	};
};

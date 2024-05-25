import { prisma } from '$lib/server/prismaConnection';

export const load = async () => {
	const articles = await prisma.blogArticle.findMany({
		take: 20
	});

	return {
		articles
	};
};

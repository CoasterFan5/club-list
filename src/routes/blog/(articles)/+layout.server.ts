import { prisma } from '$lib/server/prismaConnection';

export const load = async () => {
	const articleCount = await prisma.blogArticle.count();
	const pickRandomArticleId = () => {
		return Math.ceil(Math.random() * articleCount);
	};

	const randomArticleIds = [pickRandomArticleId(), pickRandomArticleId(), pickRandomArticleId()];

	const threeRandomArticles = await prisma.blogArticle.findMany({
		where: {
			id: {
				in: randomArticleIds
			}
		}
	});

	return {
		threeRandomArticles
	};
};

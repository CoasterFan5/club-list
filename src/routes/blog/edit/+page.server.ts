import { redirect } from '@sveltejs/kit';

import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession.js';

export const load = async ({ cookies }) => {
	const user = await verifySession(cookies.get('session'));

	if (!user.siteAdmin) {
		throw redirect(303, '/blog');
	}

	const articles = await prisma.blogArticle.findMany({
		select: {
			id: true,
			articleName: true,
			articleURL: true
		}
	});

	return {
		articles
	};
};

export const actions = {
	createArticle: async ({ cookies }) => {
		const user = await verifySession(cookies.get('session'));

		if (!user.siteAdmin) {
			throw redirect(303, '/blog');
		}

		await prisma.blogArticle.create({
			data: {
				articleName: 'New Article',
				articleURL: 'new-article',
				articleText: 'A new article!'
			}
		});
	}
};

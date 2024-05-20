import { redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/server/prismaConnection.js';
import { verifySession } from '$lib/server/verifySession';

const articleUrlRegex = /[^a-z0-9_-]+/gi;

export const load = async ({ cookies, params }) => {
	const user = await verifySession(cookies.get('session'));

	if (!user.siteAdmin) {
		throw redirect(303, '/blog');
	}

	const article = await prisma.blogArticle.findFirst({
		where: {
			articleURL: params.article
		},
		orderBy: {
			id: 'asc'
		}
	});

	return {
		article
	};
};

export const actions = {
	saveDetails: formHandler(
		z.object({
			name: z.string()
		}),
		async ({ name }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			if (!user.siteAdmin) {
				return {
					success: false,
					message: 'No permissions'
				};
			}

			const article = await prisma.blogArticle.findFirst({
				where: {
					articleURL: params.article
				}
			});

			if (!article) {
				return {
					success: false,
					message: 'How did we get here?'
				};
			}

			const newUrl = name.replace(articleUrlRegex, '-').toLowerCase();

			await prisma.blogArticle.update({
				where: {
					id: article?.id
				},
				data: {
					articleName: name,
					articleURL: newUrl
				}
			});

			throw redirect(303, `/blog/edit/${newUrl}`);
		}
	),
	save: formHandler(
		z.object({
			content: z.string()
		}),
		async ({ content }, { cookies, params }) => {
			const user = await verifySession(cookies.get('session'));

			if (!user.siteAdmin) {
				return {
					success: false,
					message: 'No permissions'
				};
			}

			const article = await prisma.blogArticle.findFirst({
				where: {
					articleURL: params.article
				}
			});

			if (!article) {
				return {
					success: false,
					message: 'How did we get here?'
				};
			}

			await prisma.blogArticle.update({
				where: {
					id: article.id
				},
				data: {
					articleText: content
				}
			});

			return {
				success: true,
				message: 'Article Updated!'
			};
		}
	)
};

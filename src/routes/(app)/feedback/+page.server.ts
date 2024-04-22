import { z } from 'zod';

import { DISCORDURL } from '$env/static/private';
import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/server/prismaConnection.js';

const colorScale = [0xe38987, 0xe69a67, 0xcfb44f, 0x9ecf56, 0x36e789];

export const actions = {
	submitFeedback: formHandler(
		z.object({
			generalRating: z.coerce.number(),
			bugRating: z.coerce.number(),
			designRating: z.coerce.number(),
			description: z.string()
		}),
		async ({ generalRating, bugRating, designRating, description }, { cookies }) => {
			const user = await prisma.user.findFirst({
				where: {
					sessions: {
						some: {
							sessionToken: cookies.get('session')
						}
					}
				}
			});

			const avgRating = Math.max(Math.round((generalRating + bugRating + designRating) / 3), 1);

			const name = user ? `${user.firstName} ${user.lastName} - ${user.email}` : 'No user';
			const pfp = user?.pfp ? user.pfp : `https://clubsaur.us/defaultPFP.png`;
			const color = colorScale[avgRating - 1] || 0xffffff;

			try {
				await fetch(DISCORDURL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						content: null,
						attachments: [],
						embeds: [
							{
								title: 'New report',
								type: 'rich',
								description: `**General Rating**: ${generalRating}/5\n**Bug Rating**: ${bugRating}/5\n **Design Rating**: ${designRating}\n`,
								fields: [
									{
										name: 'Other Comments',
										value: description
									}
								],
								color: color,
								timestamp: new Date().toISOString(),
								author: {
									name: name,
									icon_url: pfp
								}
							}
						]
					})
				});
			} catch (e) {
				return {
					success: false,
					message: 'Something went wrong...'
				};
			}

			return {
				success: true,
				message: 'Feedback submitted!'
			};
		}
	)
};

import { z } from 'zod';

import { DISCORDURL } from '$env/static/private';
import { formHandler } from '$lib/bodyguard.js';
import { prisma } from '$lib/server/prismaConnection.js';

const colorScale = [0xe38987, 0xe69a67, 0xcfb44f, 0x9ecf56, 0x36e789];

export const actions = {
	submitFeedback: formHandler(
		z.object({
			rating: z.coerce.number(),
			description: z.string()
		}),
		async ({ rating, description }, { cookies }) => {
			const user = await prisma.user.findFirst({
				where: {
					sessions: {
						some: {
							sessionToken: cookies.get('session')
						}
					}
				}
			});

			const name = user ? `${user.firstName} ${user.lastName} - ${user.email}` : 'No user';
			const pfp = user?.pfp ? user.pfp : `https://clubsaur.us/defaultPFP.png`;
			const color = colorScale[rating - 1] || 0xffffff;

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
							description: `**Rating:** ${rating}/5\n**Description:** ${description}`,
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

			return {
				success: true,
				message: 'Feedback submitted!'
			};
		}
	)
};

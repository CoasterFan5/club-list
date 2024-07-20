import sanitizeHtml from 'sanitize-html';

export const allowedHosts = ['c.clubsaur.us', 'clubsaur.us'];

export const sanitizeTiptapContent = (content: string) => {
	console.log(allowedHosts)
	return sanitizeHtml(content, {
		allowedClasses: {
			'*': ['tipTapImage', 'tipTapLink']
		},
		allowedTags: [
			'img',
			'h1',
			'h2',
			'code',
			'span',
			'pre',
			'br',
			'a',
			'strong',
			'em',
			's',
			'p',
			'div'
		],
		transformTags: {
			img: (tagName, attribs) => {
				const newAttributes = attribs;
				const imageUrl = new URL(attribs.src);
				if (!allowedHosts.includes(imageUrl.hostname)) {
					newAttributes.src = '/dino';
					return {
						tagName: 'img',
						attribs: newAttributes
					};
				} else {
					return {
						tagName: 'img',
						attribs: attribs
					};
				}
			}
		}
	});
};

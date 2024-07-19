import sanitizeHtml from 'sanitize-html';

const allowedHosts = [
	"c.clubsaur.us",
	"clubsaur.us",
	"localhost"
]

export const sanitizeTiptapContent = (content: string) => {
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
			"img": (tagName, attribs) => {
				const newAttributes = attribs;
				const imageUrl = new URL(attribs.src);
				if(!allowedHosts.includes(imageUrl.hostname)) {
					newAttributes.src = "/dino"
					return {
						tagName: "img",
						attribs: newAttributes
					}
				} else {
					return {
						tagName: "img",
						attribs: attribs
					}
				}
			}
		}
	});
};

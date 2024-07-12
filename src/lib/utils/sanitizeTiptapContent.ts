import sanitizeHtml from 'sanitize-html';

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
		]
	});
};

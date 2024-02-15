// https://stackoverflow.com/a/7225450/7589775
export const toTitleCase = (str: string) => {
	const result = str.replace(/([A-Z])/g, ' $1');
	return result.charAt(0).toUpperCase() + result.slice(1);
};

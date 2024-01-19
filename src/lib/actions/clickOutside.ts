export function clickOutside(node: HTMLElement, callback: (node: HTMLElement) => void) {
	const handleClick = (event: MouseEvent) => {
		if (
			node &&
			event.target instanceof Node &&
			!node.contains(event.target) &&
			!event.defaultPrevented
		) {
			callback(node);
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

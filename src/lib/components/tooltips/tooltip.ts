import { cubicInOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';

import Tooltip from './Tooltip.svelte';

export function tooltip(element: HTMLElement) {
	let tooltipElement: Tooltip;
	let title: string;

	

	

	const mouseOver = () => {
		title = element.getAttribute('title') || '';
		element.removeAttribute('title');

		//Get the position of the element
		const posX = element.getBoundingClientRect().x;

		const width = element.clientWidth;
		const height = element.clientHeight;

		const tooltipPos = {
			x: posX + width / 2,
			y: height
		};

		tooltipElement = new Tooltip({
			props: {
				text: title,
				pos: tooltipPos
			},
			target: document.body
		});

		const opacity = tweened(0, {
			duration: 500,
			easing: cubicInOut
		});

		opacity.set(1)
		opacity.subscribe((value) => {
			tooltipElement.$set({
				opacity: value
			})
		})
	};

	const mouseLeave = () => {
		tooltipElement.$destroy();
		element.title = title;
	};

	element.addEventListener('mouseover', mouseOver),
	element.addEventListener('mouseleave', mouseLeave);

	

	return {
		destroy() {
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', mouseLeave);
		}
	};
}

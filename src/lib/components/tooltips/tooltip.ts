import { cubicInOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';

import Tooltip from './Tooltip.svelte';

export function tooltip(element: HTMLElement, text: string) {
	let tooltipElement: Tooltip;
	let title: string;

	let active = false;

	const mouseOver = () => {
		if (active) {
			return;
		}
		active = true;
		title = text;
		element.removeAttribute('title');
		console.log('startingHere');

		//Get the position of the element
		const posX = element.getBoundingClientRect().x;
		const posY = element.getBoundingClientRect().y;
		const width = element.clientWidth;
		const height = element.clientHeight;

		const tooltipPos = {
			x: posX + width / 2,
			y: posY - height
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

		opacity.set(1);
		opacity.subscribe((value) => {
			tooltipElement.$set({
				opacity: value
			});
		});
	};

	const doneHere = () => {
		console.log('done Here');
		tooltipElement.$destroy();
		element.title = title;
		active = false;
	};

	element.addEventListener('mouseover', mouseOver),
		element.addEventListener('mouseleave', doneHere);
	element.addEventListener('blur', doneHere);
	element.addEventListener('click', doneHere);

	return {
		destroy() {
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', doneHere);
			element.removeEventListener('blur', doneHere);
			element.removeEventListener('click', doneHere);
		}
	};
}

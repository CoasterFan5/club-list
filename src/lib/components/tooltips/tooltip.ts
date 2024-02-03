import { cubicInOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';

import Tooltip from './Tooltip.svelte';

let idInc = 0;

export function tooltip(element: HTMLElement, text: string) {
	let tooltipElement: Tooltip;

	let active = false;
	element.title = text;

	const mouseOver = () => {
		if (active) {
			return;
		}
		
		active = true;
		idInc++;
		element.removeAttribute('title');

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
				text: text,
				pos: tooltipPos,
				id: `ttId-${idInc}`
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
		tooltipElement.$destroy();
		element.title = text;
		active = false;
	};

	element.addEventListener('mouseover', mouseOver);
	element.addEventListener('mouseleave', doneHere);
	element.addEventListener('blur', doneHere);
	element.addEventListener('click', doneHere);

	return {
		destroy() {
			doneHere()
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', doneHere);
			element.removeEventListener('blur', doneHere);
			element.removeEventListener('click', doneHere);
		}
	};
}

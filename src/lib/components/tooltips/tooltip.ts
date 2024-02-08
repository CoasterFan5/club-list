import { cubicInOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';

import Tooltip from './Tooltip.svelte';

let idInc = 0;

export function tooltip(element: HTMLElement, text: string) {
	const posX = element.getBoundingClientRect().x;

	const tooltipElement = new Tooltip({
		props: {
			text: text,
			pos: {
				x: 0,
				y: 0
			},
			id: `ttId-${idInc}`
		},
		target: document.body
	});

	const opacity = tweened(0, {
		duration: 250,
		easing: cubicInOut
	});

	opacity.subscribe((value) => {
		tooltipElement.$set({
			opacity: value
		});
	});

	let active = false;
	element.title = text;

	const mouseOver = () => {
		if (active) {
			return;
		}

		const posY = element.getBoundingClientRect().y;
		const width = element.clientWidth;
		const height = element.clientHeight;

		const tooltipPos = {
			x: posX + width / 2,
			y: posY - height
		};

		tooltipElement.$set({
			pos: tooltipPos
		});

		active = true;
		idInc++;
		element.removeAttribute('title');

		//Get the position of the element

		opacity.set(1);
	};

	const doneHere = () => {
		opacity.set(0);
		element.title = text;
		active = false;
	};

	const keyPressHelper = (e: KeyboardEvent) => {
		if (e.key == 'Escape') {
			doneHere();
		}
	};

	element.addEventListener('mouseover', mouseOver);
	element.addEventListener('mouseleave', doneHere);
	element.addEventListener('blur', doneHere);
	element.addEventListener('click', doneHere);
	window.addEventListener('keydown', keyPressHelper);

	return {
		destroy() {
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', doneHere);
			element.removeEventListener('blur', doneHere);
			element.removeEventListener('click', doneHere);
			window.removeEventListener('keydown', keyPressHelper);
			doneHere();
		}
	};
}
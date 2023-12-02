import { writable } from "svelte/store";
import { get } from "svelte/store";



export type Toast = {
	message: string,
	type: "error" | "warn" | "success",
	id?: string
}
export const toasts = writable<Array<Toast>>();


export const resetToast = async () => {
	toasts.set([])
}

export const addToast = async (toast: Toast) => {

	toast.id = (Math.floor(Math.random() * 10e12).toString(16) + Date.now().toString(16));

	const currentToasts = get(toasts)
	if(!currentToasts) {
		toasts.set([toast])
		return;
	}
	currentToasts.push(toast)
	toasts.set(currentToasts)
	return;
}

export const removeToast = async (id: Toast["id"]) => {
	const currentToasts = get(toasts)
	if(!currentToasts) {
		console.log("could not remove")
		return
	}

	for(let i = 0; i < currentToasts.length; i++) {
		if(currentToasts[i].id == id) {
			currentToasts.splice(i, 1)
			toasts.set(currentToasts)
			return;
		}
	}
	toasts.set(currentToasts)
}
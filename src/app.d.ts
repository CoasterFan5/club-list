import 'unplugin-icons/types/svelte'

declare global {
	namespace App {
		interface PageState {
			showingModal?: string;
		}
	}
}

export {};

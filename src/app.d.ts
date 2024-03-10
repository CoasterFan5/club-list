import 'unplugin-icons/types/svelte';

declare global {
	namespace App {
		interface PageState {
			showingModal?: string;
			// TODO: can we try to associate state with its showing modal?
			/** The current event id, used in /event sub routes */
			eventId?: number;
		}
	}
}

export {};

import { env } from '$env/dynamic/private'
import { redirect } from '@sveltejs/kit'

export let GET = ({request, cookies}) => {
	if(cookies.get("session")) {
		throw redirect(307, "/orgs")
	} else {
		throw redirect(307, env.ZEROTOUCH ?? "/")
	}
}
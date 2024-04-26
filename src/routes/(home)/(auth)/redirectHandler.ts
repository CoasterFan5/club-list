import { redirect } from '@sveltejs/kit';
import { z, ZodObject, type ZodRawShape } from 'zod';

type RedirectObject<S extends ZodRawShape, Z extends ZodObject<S>> = [
	object: Z,
	transformer: (arg0: Z['_output']) => string
];

const redirectRoutes: {
	[key: string]: RedirectObject<ZodRawShape, ZodObject<ZodRawShape>>;
} = {
	invite: [
		z.object({
			code: z.string()
		}),
		({ code }) => `/invite/${code}`
	],
	attendance: [
		z.object({
			id: z.string(),
			code: z.string()
		}),
		({ id, code }) => `/attendance?id=${id}&code=${code}`
	]
};

export const handleRedirects = (url: URL, baseRoute: string) => {
	const redirectOption = url.searchParams.get('redirect');

	if (!redirectOption) {
		throw redirect(303, baseRoute);
	}

	const redirectInformation = redirectRoutes[redirectOption];
	const entriesObject: { [key: string]: unknown } = {};
	Array.from(url.searchParams.entries()).map((value: [string, string]) => {
		entriesObject[value[0]] = value[1];
	});
	const zodParseAttempt = redirectInformation[0].safeParse(entriesObject);
	if (!zodParseAttempt.success) {
		throw redirect(303, baseRoute);
	}

	throw redirect(303, redirectInformation[1](zodParseAttempt.data));
};

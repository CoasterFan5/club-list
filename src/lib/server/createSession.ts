import crypto from 'crypto';

import { prisma } from './prismaConnection';

export async function createSession(
	userId: number,
	getClientAddress: () => string,
	request: Request
) {
	const session = crypto.randomBytes(32).toString('hex');
	await prisma.session.create({
		data: {
			sessionToken: session,
			userId,
			source: getClientAddress() + ':' + request.headers.get('user-agent')
		}
	});
}

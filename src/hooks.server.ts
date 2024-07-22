import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';

import { dev } from '$app/environment';
import { bucket } from '$env/static/private';
import { S3 } from '$lib/server/s3';
import { allowedHosts } from '$lib/utils/sanitizeTiptapContent';

const limiter = new RetryAfterRateLimiter({
	rates: {
		IP: [5, 's'],
		IPUA: [5, 's'],
		cookie: {
			name: 'limiterid',
			// FIXME: this is incredibly unsecure. move this to .env
			secret: Math.random().toString(),
			rate: [2, 'm'],
			preflight: true
		}
	}
});

// Check if we have access to an s3 bucket before the app starts
const bucketCheck = await S3.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1 }));
if (bucketCheck.$metadata.httpStatusCode != 200) {
	throw new Error('s3 Bucket not found');
}

if (dev) {
	allowedHosts.push('localhost');
}

export async function handle({ event, resolve }) {
	if (!process.env.CI && !dev) {
		await limiter.cookieLimiter?.preflight(event);

		const status = await limiter.check(event);

		if (status.limited) {
			return new Response('Too many requests', {
				status: 429,
				headers: {
					'Retry-After': status.retryAfter.toString()
				}
			});
		}
	}

	return await resolve(event);
}

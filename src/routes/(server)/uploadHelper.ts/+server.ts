import { prisma } from '$lib/db.js';
import { error } from '@sveltejs/kit';
import { S3 } from '$lib/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { bucket, r2endpoint, r2endpointFront } from '$env/static/private';
import crypto from 'crypto';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"


export const POST = async ({request, cookies}) => {
	const body = await await request.json();
	const session = cookies.get("session");

	const sessionCheck = await prisma.session.findUnique({
		where: {
			sessionToken: session
		}, 
		include: {
			user: true
		}
	})

	if(!sessionCheck || !sessionCheck.user) {
		throw error(400, "not logged in")
	}

	const fileName = body.fileName
	
	if(!fileName) {
		throw error(400, "No Filename")
	}

	const newKey = `${crypto.randomBytes(64).toString('hex')}/${fileName}`
	let signedURL = await getSignedUrl(S3, new PutObjectCommand({Bucket: bucket, Key: `${newKey}`}), {expiresIn: 3600})


	if(r2endpointFront != r2endpoint) {
		signedURL = signedURL.replace(r2endpoint, r2endpointFront)
	}

	return new Response(JSON.stringify({
		signedURL
	}))
}
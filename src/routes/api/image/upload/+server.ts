import { PutObjectCommand } from '@aws-sdk/client-s3'
import { error } from '@sveltejs/kit'
import crypto from "crypto"

import { bucket, mediaurl } from '$env/static/private'
import { prisma } from '$lib/server/prismaConnection.js'
import { S3 } from '$lib/server/s3.js'
import { verifyOptionalSession } from '$lib/server/verifySession.js'




export const POST = async ({request, cookies}) => {
	const file = (await request.formData()).get("file") as File
	
	if(!file) {
		throw error(400, {
			message: "No file submitted"
		})
	}

	if(!file.type.match(/^image/)) {
		throw error(400, {
			message: "MIME error."
		})
	}

	if(file.size > 10e6) {
		throw error(400, {
			message: "File too large, max of 10mb"
		})
	}


	const user = await verifyOptionalSession(cookies.get("session"))
	if(!user) {
		throw error(401, {
			message: "You are not logged in"
		})
	}

	let fileName = file.name;
	if (fileName.length > 32) {
		fileName = fileName.substring(fileName.length - 32);
	}
	const randomId = crypto.randomBytes(32).toString("base64url")
	const key = `${user.id}/${randomId}/${fileName}`

	await prisma.userImage.create({
		data: {
			fileType: file.type,
			size: file.size,
			userId: user.id,
			key: `${mediaurl}/${key}`
		}
	})

	const fileBuffer = await file.arrayBuffer();

	await S3.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: new Uint8Array(fileBuffer)
		})
	);

	return new Response(null, {
		status: 200
	})
}
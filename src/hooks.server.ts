import { S3 } from "$lib/s3"

import { ListBucketsCommand, type CreateBucketCommandInput } from "@aws-sdk/client-s3"
import type { Handle } from "@sveltejs/kit"

//check if we have access to an s3 bucket before the app starts


export const handle: Handle = async ({event, resolve}) => {
	console.log(
		await S3.send(
		  new ListBucketsCommand('')
		)
	  );
	return await resolve(event)
}
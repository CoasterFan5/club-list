import { S3 } from '$lib/s3';
import { bucket } from '$env/static/private';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

//check if we have access to an s3 bucket before the app starts
const bucketCheck = await S3.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1 }));
if (bucketCheck.$metadata.httpStatusCode != 200) {
	throw new Error('s3 Bucket not found');
} else {
	console.log('Bucket Found');
}

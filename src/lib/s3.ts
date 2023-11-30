import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { r2endpoint, accessKeyId, accessKeySecret } from "$env/static/private";

export const S3 = new S3Client({
	region: "auto",
	endpoint: r2endpoint, 
	credentials: {
		accessKeyId: accessKeyId,
		secretAccessKey: accessKeySecret
	},
})


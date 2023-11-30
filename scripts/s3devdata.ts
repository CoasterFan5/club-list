import { S3Client, CreateBucketCommand, type CreateBucketCommandInput, BucketLocationConstraint } from "@aws-sdk/client-s3";

const S3 = new S3Client({
	region: "us-east-1",
	endpoint: "http://s3.docker.test:8000",
	forcePathStyle: true,
	credentials: {
		accessKeyId: "accessKey1",
		secretAccessKey: "verySecretKey1"
	},
})




console.log(await S3.send(
	new CreateBucketCommand({
		Bucket: "clubsaurus",
	})
));

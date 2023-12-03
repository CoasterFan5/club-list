import {
	S3Client,
	CreateBucketCommand,
	BucketCannedACL,
	PutBucketPolicyCommand,
	ListBucketsCommand
} from '@aws-sdk/client-s3';

const S3 = new S3Client({
	region: 'us-east-1',
	endpoint: 'http://s3.docker.test:8000',
	forcePathStyle: true,
	credentials: {
		accessKeyId: 'accessKey1',
		secretAccessKey: 'verySecretKey1'
	}
});

const readOnlyAnonUserPolicy = {
	Version: '2012-10-17',
	Statement: [
		{
			Sid: 'AddPerm',
			Effect: 'Allow',
			Principal: '*',
			Action: ['s3:GetObject'],
			Resource: ['arn:aws:s3:::clubsaurus/*']
		}
	]
};

const bucketName = 'clubsaurus';

const hasBucket = await S3.send(new ListBucketsCommand({ })).then((data) => data.Buckets?.some((bucket) => bucket.Name === bucketName));

if (!hasBucket) {
	console.log(
		await S3.send(
			new CreateBucketCommand({
				Bucket: bucketName,
				ACL: BucketCannedACL.public_read
			})
		)
	);
}

console.log(
	await S3.send(
		new PutBucketPolicyCommand({
			Bucket: bucketName,
			Policy: JSON.stringify(readOnlyAnonUserPolicy)
		})
	)
);

import {
	S3Client,
	CreateBucketCommand,
	BucketCannedACL,
	PutBucketPolicyCommand,
	PutBucketCorsCommand,
	DeleteBucketCorsCommand
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

const corsConfiguration = {
	"CORSRules": [
	  {
		"AllowedOrigins": ["*"],
		"AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
		"AllowedHeaders": ["content-type"],
		"MaxAgeSeconds": 300,
	  },
	],
  };

console.log(
	await S3.send(
		new CreateBucketCommand({
			Bucket: 'clubsaurus',
			ACL: BucketCannedACL.public_read,
		})
	)
);

console.log(
	await S3.send(
		new PutBucketPolicyCommand({
			Bucket: 'clubsaurus',
			Policy: JSON.stringify(readOnlyAnonUserPolicy)
		})
	)
);

console.log(await S3.send(new DeleteBucketCorsCommand({Bucket: "clubsaurus"})))

console.log(
	await S3.send(
		new PutBucketCorsCommand({
			Bucket: "clubsaurus",
			CORSConfiguration: corsConfiguration
		})
	)
)

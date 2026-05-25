import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const REGION = process.env.AWS_REGION || '';
const BUCKET = process.env.S3_BUCKET_NAME || '';

export const s3 = new S3Client({ region: REGION, credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
}});

export const uploadToS3 = async (key: string, body: Buffer | Uint8Array | Blob | Readable) => {
  if (!BUCKET) throw new Error('S3 bucket not configured');
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ACL: 'public-read' });
  await s3.send(command);
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
};

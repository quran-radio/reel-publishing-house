import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { loadEnvFile } from "node:process";
import process from "node:process";

loadEnvFile()
const bucketName = "first-bucket";

const s3 = new S3Client({
  region: "auto", // Required by AWS SDK, not used by R2
  // Provide your R2 endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  endpoint: process.env.ENDPOINT,
  credentials: {
    // Provide your R2 Access Key ID and Secret Access Key
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET,
  },
});

export async function uploadFile(fileContent, key) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: "video/mp4"
    }),
  );
  // Upload a file
  console.log(`Uploaded ${key}`);
}

export async function getPresignedUrl(key) {
  const getUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucketName, Key: key }),
    { expiresIn: 3600 }, // Valid for 1 hour
  );
  console.log(`here is the url: ${getUrl}`)
  return getUrl
}
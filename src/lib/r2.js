import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload satu file ke Cloudflare R2
 * @param {File} file - File object dari FormData
 * @param {string} folder - Folder tujuan (default: "products")
 * @returns {Promise<string>} URL publik file yang di-upload
 */
export async function uploadFileToR2(file, folder = "products") {
  const arrayBuffer = await file.arrayBuffer();
  const body = Buffer.from(arrayBuffer);

  // Generate unique filename dengan timestamp + random
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = file.name.split(".").pop() || "jpg";
  const key = `${folder}/${timestamp}-${randomStr}.${ext}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: file.type || "application/octet-stream",
    }),
  );
  return key;
}

/**
 * Upload multiple files ke Cloudflare R2 secara paralel
 * @param {File[]} files - Array File objects dari FormData
 * @param {string} folder - Folder tujuan (default: "products")
 * @returns {Promise<string[]>} Array URL publik files yang di-upload
 */
export async function uploadFilesToR2(files, folder = "products") {
  return Promise.all(files.map((file) => uploadFileToR2(file, folder)));
}

export async function getR2SignedUrl(key) {
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }),
    {
      expiresIn: 3600,
    },
  );
}

/**
 * Hapus satu file dari Cloudflare R2
 * @param {string} key - Key file yang akan dihapus
 * @returns {Promise<void>}
 */
export async function deleteFileFromR2(key) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }),
  );
}

/**
 * Hapus multiple files dari Cloudflare R2 secara paralel
 * @param {string[]} keys - Array key files yang akan dihapus
 * @returns {Promise<void>}
 */
export async function deleteFilesFromR2(keys) {
  if (keys.length === 0) return;
  await Promise.all(keys.map((key) => deleteFileFromR2(key)));
}

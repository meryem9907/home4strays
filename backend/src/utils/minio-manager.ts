import { Client } from "minio";
import * as stream from "node:stream";
import { getSecret } from "../utils/secret-manager";

/**
 * Manages interactions with a MinIO object storage service.
 * This class provides a singleton pattern for accessing MinIO functionality.
 * It handles bucket operations, file uploads, and object management.
 */
export default class MinioManager {
  /**
   * Singleton instance of MinioManager.
   * Ensures only one instance of the class is created.
   */
  private static instance: MinioManager;
  /**
   * MinIO client instance configured with connection parameters.
   * This client is used to interact with the MinIO server.
   */
  private client: Client;
  /**
   * Name of the bucket used for storing files.
   * This value is retrieved from the secret manager.
   */
  private bucketName: string;
  /**
   * Private constructor to enforce singleton pattern.
   * Initializes the MinIO client with configuration parameters.
   * Configuration values are fetched from the secret manager.
   * If a secret value is not found, a default value is used.
   */
  private constructor() {
    this.client = new Client({
      endPoint: getSecret("MINIO_ENDPOINT", "home4strays.informatik.tha.de"),
      port: parseInt(getSecret("MINIO_PORT", "443")),
      useSSL: Boolean(
        JSON.parse(getSecret("MINIO_SSL", "false").toLocaleLowerCase()),
      ),
      accessKey: getSecret("MINIO_ACCESS_KEY"),
      secretKey: getSecret("MINIO_SECRET_KEY"),
      pathStyle: true,
    });
    this.bucketName = getSecret("MINIO_BUCKET_NAME");
  }

  /**
   * Returns the singleton instance of MinioManager.
   * If no instance exists, a new one is created.
   * @returns The singleton MinioManager instance.
   */
  static getInstance(): MinioManager {
    if (!MinioManager.instance) {
      MinioManager.instance = new MinioManager();
    }
    return MinioManager.instance;
  }

  /**
   * Lists all buckets available in the MinIO server.
   * @returns A promise that resolves to an array of bucket objects.
   */
  public async listBuckets() {
    return await this.client.listBuckets();
  }

  /**
   * Debug method to log MinIO configuration values.
   * This is intended for testing and diagnostic purposes.
   * Logs bucket name, access key, secret key, port, and endpoint.
   */
  public async debug() {
    console.log(getSecret("MINIO_BUCKET_NAME"));
    console.log(getSecret("MINIO_SECRET_KEY"));
    console.log(getSecret("MINIO_ACCESS_KEY"));
    console.log(getSecret("MINIO_PORT", "9000"));
    console.log(getSecret("MINIO_ENDPOINT"));
  }

  /**
   * Uploads a file to the MinIO bucket.
   * Automatically creates the bucket if it doesn't exist.
   * @param fileName - The name to use for the uploaded file.
   * @param sourceFile - The path to the source file on the local system.
   * @param metaData - Optional metadata to associate with the file.
   * @returns A promise that resolves to the ETag of the uploaded object.
   */
  public async uploadFile(
    fileName: string,
    sourceFile: string,
    metaData?: any,
  ) {
    console.log("Connecting to", getSecret("MINIO_ENDPOINT"));
    const exists = await this.client.bucketExists(this.bucketName);

    if (exists) {
      console.log("Bucket " + this.bucketName + " exists.");
    } else {
      await this.client.makeBucket(this.bucketName);
      console.log("Bucket " + this.bucketName + " created.");
    }

    console.log("Connecting to S3 ", getSecret("MINIO_ENDPOINT"));
    return await this.client.fPutObject(
      this.bucketName,
      fileName,
      sourceFile,
      metaData,
    );
  }

  /**
   * Uploads a file from a stream, buffer, or string to the MinIO bucket.
   * @param fileName - The name to use for the uploaded file.
   * @param stream - The data source (stream, buffer, or string).
   * @param metaData - Metadata to associate with the file.
   */
  public async uploadFileFromStream(
    fileName: string,
    stream: stream.Readable | Buffer | string,
    metaData: any,
  ) {
    await this.client.putObject(this.bucketName, fileName, stream, metaData);
  }

  /**
   * Generates a presigned URL for accessing a file in the MinIO bucket.
   * The URL is valid for the specified number of seconds.
   * @param filename - The name of the file to generate a URL for.
   * @param expirationSeconds - Optional expiration time in seconds for the URL.
   * @returns A promise that resolves to the presigned URL string.
   */
  public async getPublicURL(filename: string, expirationSeconds = undefined) {
    const presignedUrl = await this.client.presignedGetObject(
      await getSecret("MINIO_BUCKET_NAME"),
      filename,
      expirationSeconds,
    );

    // Build internal base URL using envs
    const endpoint = getSecret("MINIO_ENDPOINT"); // e.g. home4strays.informatik.tha.de
    const port = getSecret("MINIO_PORT"); // e.g. 9000
    const useSSL = getSecret("MINIO_SSL") === "true"; // e.g. true

    const internalBase = `${useSSL ? "https" : "http"}://${endpoint}:${port}`;

    // Replace with public base URL
    const publicBase = getSecret("MINIO_PUBLIC_URL"); // e.g. https://s3.home4strays.org

    // Replace base of the URL using standard string replacement
    const publicUrl = presignedUrl.replace(internalBase, publicBase);

    return publicUrl;
  }

  /**
   * Removes a single file from the MinIO bucket.
   * @param filename - The name of the file to delete.
   */
  public async removeFile(filename: string) {
    await this.client.removeObject(this.bucketName, filename);
  }

  /**
   * Removes multiple files from the MinIO bucket.
   * @param filenames - An array of filenames to delete.
   */
  public async removeFiles(filenames: Array<string>) {
    await this.client.removeObjects(this.bucketName, filenames);
  }
}

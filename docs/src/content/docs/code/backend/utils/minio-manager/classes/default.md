---
editUrl: false
next: false
prev: false
title: "default"
---

Defined in: home4strays-backend/src/utils/minio-manager.ts:10

Manages interactions with a MinIO object storage service.
This class provides a singleton pattern for accessing MinIO functionality.
It handles bucket operations, file uploads, and object management.

## Methods

### debug()

> **debug**(): `Promise`\<`void`\>

Defined in: home4strays-backend/src/utils/minio-manager.ts:68

Debug method to log MinIO configuration values.
This is intended for testing and diagnostic purposes.
Logs bucket name, access key, secret key, port, and endpoint.

#### Returns

`Promise`\<`void`\>

***

### getPublicURL()

> **getPublicURL**(`filename`, `expirationSeconds`): `Promise`\<`string`\>

Defined in: home4strays-backend/src/utils/minio-manager.ts:129

Generates a presigned URL for accessing a file in the MinIO bucket.
The URL is valid for the specified number of seconds.

#### Parameters

##### filename

`string`

The name of the file to generate a URL for.

##### expirationSeconds

`undefined` = `undefined`

Optional expiration time in seconds for the URL.

#### Returns

`Promise`\<`string`\>

A promise that resolves to the presigned URL string.

***

### listBuckets()

> **listBuckets**(): `Promise`\<`BucketItemFromList`[]\>

Defined in: home4strays-backend/src/utils/minio-manager.ts:59

Lists all buckets available in the MinIO server.

#### Returns

`Promise`\<`BucketItemFromList`[]\>

A promise that resolves to an array of bucket objects.

***

### removeFile()

> **removeFile**(`filename`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/utils/minio-manager.ts:141

Removes a single file from the MinIO bucket.

#### Parameters

##### filename

`string`

The name of the file to delete.

#### Returns

`Promise`\<`void`\>

***

### removeFiles()

> **removeFiles**(`filenames`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/utils/minio-manager.ts:149

Removes multiple files from the MinIO bucket.

#### Parameters

##### filenames

`string`[]

An array of filenames to delete.

#### Returns

`Promise`\<`void`\>

***

### uploadFile()

> **uploadFile**(`fileName`, `sourceFile`, `metaData?`): `Promise`\<`UploadedObjectInfo`\>

Defined in: home4strays-backend/src/utils/minio-manager.ts:84

Uploads a file to the MinIO bucket.
Automatically creates the bucket if it doesn't exist.

#### Parameters

##### fileName

`string`

The name to use for the uploaded file.

##### sourceFile

`string`

The path to the source file on the local system.

##### metaData?

`any`

Optional metadata to associate with the file.

#### Returns

`Promise`\<`UploadedObjectInfo`\>

A promise that resolves to the ETag of the uploaded object.

***

### uploadFileFromStream()

> **uploadFileFromStream**(`fileName`, `stream`, `metaData`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/utils/minio-manager.ts:114

Uploads a file from a stream, buffer, or string to the MinIO bucket.

#### Parameters

##### fileName

`string`

The name to use for the uploaded file.

##### stream

The data source (stream, buffer, or string).

`string` | `Readable` | `Buffer`\<`ArrayBufferLike`\>

##### metaData

`any`

Metadata to associate with the file.

#### Returns

`Promise`\<`void`\>

***

### getInstance()

> `static` **getInstance**(): `MinioManager`

Defined in: home4strays-backend/src/utils/minio-manager.ts:48

Returns the singleton instance of MinioManager.
If no instance exists, a new one is created.

#### Returns

`MinioManager`

The singleton MinioManager instance.

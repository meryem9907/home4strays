# Mock data files for MinIO

The database mock migration stores URLs like `http://localhost:9000/home4strays/mockdata/luna.jpg`.
Those objects must exist in the **`home4strays`** bucket under the **`mockdata/`** prefix.

## Docker (automatic)

On `docker compose up`, the **`minio-init`** service:

1. Uploads every file in this folder to MinIO
2. Sets public read access on `mockdata/` (local development only)

Generate minimal placeholders if the folder is empty:

```bash
node backend/scripts/generate-mockdata-placeholders.mjs
docker compose up --build
```

Replace placeholders with real images anytime; re-run:

```bash
docker compose run --rm minio-init
```

## Required filenames

Must match names referenced in `src/database/migrations/mock-data-migration.ts`:

- `claudia weber.jpg`, `jonas berger.jpg`, `nadine kunz.jpg`, `leon fischer.jpg`
- `pfotenhilfe_verificationdoc.pdf`, `pfotenhilfesued.jpg`
- `nordlicht_verificationdoc.pdf`, `nordlicht.png`
- `luna.jpg`, `luna2.jpg`, `max.jpg`, `max2.jpg`, `mimi.jpg`, `rocky.jpg`
- `bella.jpg`, `bella2.jpg`, `charly.jpg`, `nala.jpg`, `simba.png`

## Notes

- The backend migration only writes **database rows**; it does not upload files to MinIO.
- Filenames with spaces are URL-encoded in stored links (e.g. `claudia%20weber.jpg`).
- Object keys in MinIO are `mockdata/<filename>`, not `home4strays/mockdata/<filename>`.

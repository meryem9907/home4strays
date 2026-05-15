# 🐶🐾 Home4Strays: A digital solution to adopt stray animals all over the world 

As a team of 8 students, we committed ourselves to developing an app that facilitates the adoption of stray animals by suitable owners.
On our site NGOs can sign up to publish stray animals while shelters can sign up to search and find animals of their choice. 

## Current features:
- ✨ search, filter 
- ✨ bookmarking
- ✨ maintainance of ngo and shelter profiles
- ✨ verification of ngos by developers via document
- ✨ multilingual: english, german, turkish
- ✨ responsive design
- ✨ lightdarkmode

# Test version
We are still in development mode and our test version is available on: [[home4strays.org](https://home4strays.org/en)]. 

## Run with Docker

The repository root includes a `docker-compose.yml` that starts PostgreSQL, MinIO, the Express API, the Next.js app, and Adminer.

1. Copy the environment template and set a JWT secret (see [backend/README.md](backend/README.md) for how to generate `TOKEN_SECRET`):

   ```bash
   cp .env.docker.example .env
   ```

   On Windows PowerShell: `Copy-Item .env.docker.example .env`

   Edit `.env` and fill in `TOKEN_SECRET` at minimum.

2. Generate mock images and PDFs for seeded data (only needed once, or if `backend/mockdata/` is empty):

   ```bash
   node backend/scripts/generate-mockdata-placeholders.mjs
   ```

   On startup, **`minio-init`** uploads `backend/mockdata/*` into MinIO and allows public read on `mockdata/` for local development. See [backend/mockdata/README.md](backend/mockdata/README.md).

3. Build and start all services:

   ```bash
   docker compose up --build
   ```

4. Open the app at [http://localhost:3000](http://localhost:3000).

| Service | URL | Notes |
|--------|-----|--------|
| Frontend | http://localhost:3000 | Next.js |
| Backend API | http://localhost:3100 | Express |
| MinIO (S3 API) | http://localhost:9000 | Object storage for uploads |
| MinIO console | http://localhost:9001 | Web UI for buckets |
| Adminer | http://localhost:3400 | DB UI: system **PostgreSQL**, server **db**, user/database/password from `.env` |

Optional variables (ports, MinIO public URL, email) are in [.env.docker.example](.env.docker.example).

To re-upload mock files after changing them: `docker compose run --rm minio-init`

For database-only containers (without the API or frontend), use [backend/docker-compose.yaml](backend/docker-compose.yaml).


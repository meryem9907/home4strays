# Getting started

## Pre-Installations

### Install Nodejs (version 23.11.0)

- Linux (Debian/Ubuntu) über nvm mit npm (wer was anderes möchte: https://nodejs.org/en/download)

  ```
  sudo apt update

  # Download and install nvm:
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash

  # in lieu of restarting the shell
  \. "$HOME/.nvm/nvm.sh"

  # Download and install Node.js:
  nvm install 23

  # Verify the Node.js version:
  node -v # Should print "v23.11.0".
  nvm current # Should print "v23.11.0".

  # Verify npm version:
  npm -v # Should print "10.9.2".

  ```

- Windows über fnm mit npm (wer was anderes möchte: https://nodejs.org/en/download)

  - In Windows Powershell:

  ```
  # Download and install fnm:
  winget install Schniz.fnm

  # Download and install Node.js:
  fnm install 23

  # Verify the Node.js version:
  node -v # Should print "v23.11.0".

  # Verify npm version:
  npm -v # Should print "10.9.2".

  ```

### Install Node Modules

- in the backend folder, where the package.json file is run: `npm install`

## Running the server

- With `npm start` the server should start and you should see a starting page written:

  ```
  Express
  Welcome to Express
  ```

### Prepare a .env file

- Token Secret
  In order to encrypt and decrypt JWT-Tokens you need a secret. Go into your home directory and do the following things.

  - create a temp.js file with this content:

    ```
    console.log(require('crypto').randomBytes(64).toString('hex'))
    ```

  - in the same directory run from the cli:

    ```
    node temp.js

    // output: 9f26e402586e2faa8da4c98a35f1b20d6b033c60...
    ```

  - copy the secret

  - create an .env File just like .env.example and paste the secret to TOKEN_SECRET:

    ```
    TOKEN_SECRET=""
    ```

  - you may delete the temp.js. It was only neccessary to generate the secret

### Setup Database

- Install Docker or Podman
- Run

```bash
docker run --name postgresql -e POSTGRES_DB=home4strays -e POSTGRES_USER=home4strays -e POSTGRES_PASSWORD=home4strays -d postgres
```

- Copy `.env.example` to `.env`
- Change values corresponding to your docker container environment variables

### Minio Buckets

Certain files have to be saved in certain bucket pathes:

- verification files -> home4strays/verification
- ngo logos -> home4strays/ngo-logos

### Routes

- in dev mode:

  - basic URL: http://localhost:3000
  - for authentication:
    - registration: /api/register
    - login: /api/login
  - verification:
    - /api/request-verification
    - /api/pending-verifications
    - /api/reject-ngo
    - /api/verify-ngo
  - for users:
    - to get a user: /me
  - for profiles:
    - /all-animals
    - /all-ngos
  - for search
    - /search-animal
    - /search-ngo
    - /search-caretaker
  - for enums
    - /get-species
    - /get-breeds

  ## Rules for Query Files

  ### 1. Write a **function signature** with name like "sqlqueryCondition" e.g. "select" or "insert" or "deleteByName"

  ### 2. **Parameters** should be:

  - db: DatabaseManager
  - for insert user a model: Model like Breed etc.. That way it is more type safe.
  - for any other query you can choose what you want

  ### 3. **Return type** should be an promise array of the model or void array if its a delete or insert function:

  - Promise<void[]>

### Example: BreedQueries Rules

1.  Function signature:

```typescript
async sqlqueryCondition(db: DatabaseManager, args..): Promise<Breed[]>
```

- Example:

```typescript
async selectBreeds(db: DatabaseManager): Promise<Breed[]>
async insertBreed(db: DatabaseManager, breed: Breed): Promise<void>
/**"byName" is the specific condition*/
async deleteByName(db: DatabaseManager, name: string): Promise<void>
```

2.  Document each function with a short description of what it does

- Example:

````typescript
//** Selects all breeds from the database */
async selectBreeds(db: DatabaseManager): Promise<Breed[]>```

````

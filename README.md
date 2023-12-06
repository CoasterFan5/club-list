# Clubsaurus

Find clubs and organizations easily.

## Contributing

### Development Server

Ensure you have [docker](https://www.docker.com/) installed, and run `docker-compose up` in the project's root directory. This will start a variety of services:

- The frontend server hosts the web app on port `3000`.
- A Dev S3 cloud server will be started on port `8000` and hosted in memory. It will also, by default, create a bucket called `clubsaurus`.
- A [PostgreSQL](https://www.postgresql.org/) database will be started on port `5432`. It will be seeded when the front end runs.

### Default Accounts

The following accounts are created by default:

- `bstone@card.board:password` - Admin account for the default organization and clubs
- `leader@card.board:password` - Owner of the default organization

> [!NOTE]
> These will only be created when seeding the database; they will not exist if you deploy this app.

## Frontend

The frontend is created in [SvelteKit](https://kit.svelte.dev/). The start command for the dev server is `yarn dev`. The frontend is hosted on port `3000` in docker and `5173` outside docker.

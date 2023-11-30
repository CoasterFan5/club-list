# Clubsaurus

Find clubs and organizations easily.

## Start dev server
Ensure you have docker installed, and run `docker-compose up` in the root directory of the project. This will start a variety of services: 
- The frontend server at on port `3000` and hosts the web app.
- A dev s3 cloud server will be started on port `8000` and will be hosted in memory. It will also by default create a bucket called `clubsaurus`.
- A postgreSQL database will be started on port `5432`. It will be seeded when the front end runs

## Default Accounts
The following accounts are created by default:
- `bstone@card.board:password` - Admin account for the default organization and clubs
- `leader@card.board:password` - Owner of the default organization
Note: These will only be created when seeding the database, they will not exist if you deploy this app. 

## Frontend
The fron-tend is created in Svelte kit. The start command for the dev server is yarn dev. The front-end is hosted on port `3000` in docker and `5173` outside of docker.
# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Run Project

```bash
# Install Dependencies
npm install

# or
yarn
```

## Developing
To start developing, you need to start the web server.
```bash
npm run dev

# or
yarn dev
```

## Database
App requires a database, we use [SurrealDB](https://surrealdb.com/)
```bash
surreal start --user root --pass root file:database.db


# or 

surreal start memory --user root --pass root
```

Import database schema so it works! 
```bash
surreal import --conn http://localhost:8000 --user root --pass root --db clublist --ns clublist  setup/db.surql
```

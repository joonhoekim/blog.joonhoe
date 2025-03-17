# README.md

## Blog Architecture

1. Base: nextjs 15 & react 19
2. ORM: drizzle
3. DB: postgres
4. Editor: Lexical
5. Data Mutation: SWR
6. State Management: Jotai & Zustand

## .env example

example of env file

- `.env` for global env
- `.env.development` for `next dev`
- `.env.production` for `next build && next start`

> Recommendation: seperate dotenv for dev & prod.

### Example of development dotenv

Of course, ==this is NOT a bash script.== (for syntax highlighting)

```bash
# Nextauth
NEXTAUTH_SECRET="changeme"
NEXTAUTH_URL=http://localhost:3000

# DB Connection
DB_USER=user_name
DB_HOST=host_address
DB_NAME=database_name
DB_PASSWORD=database_password
DB_PORT=5432
```


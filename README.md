
 
## Running the code

Run `npm install` to install the dependencies.

Create a `.env.local` file from `.env.example` and set the Supabase project URL and
publishable anon key before enabling database-backed screens. Never put a Supabase
service-role key or a PostgreSQL connection string in this Vite application.

Run `npm run dev` to start the development server.

## Supabase setup

The app database uses the existing tables described in `src/lib/database.types.ts`.
Enable Supabase Auth email/password for administrators and create matching rows in
the `admins` table. Row Level Security policies should restrict admin mutations to
authenticated administrator identities before production use.

The member-management system is separate. Member sign-in is not connected yet;
it needs a server-side API or other secure verification endpoint from that system.
  
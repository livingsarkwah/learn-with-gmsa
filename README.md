
 
# Learn with GMSA

Learn with GMSA is a Vite and React resource library for KNUST students. It provides a public catalogue for academic resources and a protected Supabase-backed admin area for managing programmes, courses, uploads, publishing, and resource analytics.

## Requirements

- Node.js 20 or later
- npm 10 or later
- A Supabase project for database-backed features

## Getting started

Install dependencies:

```bash
npm install
```

Create a local environment file from `.env.example`:

```bash
copy .env.example .env.local
```

Set the Supabase project URL and publishable anon key in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-anon-key
```

Never put a Supabase service-role key, database password, or PostgreSQL connection string in this Vite application. `VITE_*` values are exposed to the browser.

## Commands

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Supabase setup

1. Run `schema.sql` against the Supabase project.
2. Confirm the `resources` storage bucket is private and has the configured MIME types and 200 MB size limit.
3. Enable Supabase Auth email/password authentication for administrators.
4. Add each authorized administrator's email to the `public.admins` table.
5. Apply the storage policies in `schema.sql`; they allow public access only to files referenced by published resources and allow management access only to authorized admins.
6. Configure Supabase Storage CORS to allow the deployed application origin. Browser-side semester ZIP creation fetches signed resource URLs and requires that origin to be allowed.

The application uses Row Level Security for public reads and admin mutations. The SQL migration must be applied to the deployed Supabase project; committing the file alone does not change an existing project.

## Resource downloads

Individual downloadable resources are fetched as blobs and saved using the original uploaded filename. If an original filename is unavailable, the application creates a readable title-based fallback.

## Semester packs

The Semester Pack page creates a ZIP in the browser. Downloadable resources are organized as:

```text
files/
	COURSE CODE - COURSE TITLE/
		RESOURCE CATEGORY/
			original-file-name.pdf
```

The ZIP also contains `MANIFEST.txt` with the selected resource details. YouTube resources are not downloaded as video files; their links are listed in the manifest. A progress indicator is shown while files are fetched and the archive is generated.

ZIP creation depends on successful browser access to the signed Supabase URLs. If a file cannot be fetched, the failure is recorded in the manifest.

## Authentication status

Administrator authentication uses Supabase Auth and the `admins` table. Student/member sign-in is not connected to a production membership verification service yet; it requires a server-side verification endpoint or equivalent secure session provider.

## Security notes

- Keep service-role credentials and database secrets out of the frontend environment.
- Keep the resources bucket private.
- Apply the RLS and Storage policies from `schema.sql` before production use.
- Review Supabase Storage CORS settings when deploying to a new origin.
- Update dependencies regularly and review `npm audit` results before releases.
  
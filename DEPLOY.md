# Production deployment

This project runs as two services: the Next.js website and the ASP.NET Core API. The API stores its SQLite database, data-protection keys, and uploaded images in persistent directories. Keep those directories when updating or moving the deployment. For MonsterASP deployment, follow [DEPLOY-MONSTERASP.md](./DEPLOY-MONSTERASP.md).

## Prepare the host

Install Docker Engine and the Docker Compose plugin on a Linux host. Copy the complete project to the host, including `public/`, `server/Academy.Api/`, `app/`, and the Docker files. Do not copy `node_modules`, `.next*`, or .NET `bin/obj` directories.

Create the production environment file:

```sh
cp .env.example .env
```

Edit `.env`: set `ADMIN_PASSWORD` to a unique strong password and `WEB_ORIGIN` to the exact HTTPS origin of the site (for example `https://academy.example.com`, with no trailing slash). Keep `.env` private.

If the project already has live content, first copy these directories from the current server into the same paths on the new host:

- `server/Academy.Api/App_Data/` (SQLite database and authentication keys)
- `server/Academy.Api/wwwroot/uploads/` (uploaded media)

Do not replace those directories with empty copies during an update. Back them up before changing hosts.

## Start and update

```sh
docker compose up -d --build
docker compose ps
docker compose logs -f academy-api academy-web
```

The website listens on `127.0.0.1:3000`. Configure the hosting provider’s reverse proxy to send the domain to that local port and enable HTTPS. Do not expose the API port publicly; the website reaches it over the private Compose network. The app’s `/api/*` and `/uploads/*` routes are proxied internally through Next.js.

For an update, copy the new source files without overwriting the two persistent data directories, then run `docker compose up -d --build`. Back up the database and uploads before each release.

## Verify

- Open the domain and `/admin` over HTTPS.
- Confirm the API health endpoint through the site at `/api/health`.
- Sign in with the `ADMIN_PASSWORD` from `.env`.
- Confirm existing content and uploaded images are present before making edits.

This setup prepares a standard Docker host. A hosting provider that does not support Docker Compose may require provider-specific configuration.

# Hostinger Deploy Notes

## Website app

- Domain: `https://menmithafoodproducts.com`
- Framework preset: `Create React App`
- Branch: `main`
- Node version: `22.x`
- Root directory: `./`
- Install command: `npm ci`
- Build command: `npm run build`
- Package manager: `npm`
- Output directory: `build`
- Start command: leave empty for static hosting, or use `npm run start` only on Node hosting
- Environment variables:

```env
NODE_ENV=production
VITE_ADMIN_API_BASE=https://api.menmithafoodproducts.com
```

Only the website app needs `VITE_ADMIN_API_BASE`. The `FRONTEND_URL`, `CORS_ORIGINS`,
and `ADMIN_PASSWORD` variables belong to the separate Admin API app.

If Hostinger fails with a missing Vite package during build, set the install command to
`npm ci --include=dev`. Some Hostinger builds apply `NODE_ENV=production` during install,
which can skip build tooling unless it is explicitly included.

The build script generates TanStack/Nitro output first, then `postbuild` copies the static
site from `.output/public` into `build/` for Hostinger's default static deploy flow.

## Admin API app

- Domain or subdomain: `https://api.menmithafoodproducts.com`
- Install command: `npm ci`
- Start command: `npm run admin:start`
- Root directory: `./`
- Node version: `22.x`
- Environment variables:

```env
NODE_ENV=production
FRONTEND_URL=https://menmithafoodproducts.com
CORS_ORIGINS=https://menmithafoodproducts.com,https://www.menmithafoodproducts.com
ADMIN_PASSWORD=replace-with-a-strong-password
```

The API stores orders and inventory in `.data/admin-store.json` on the server. Keep that folder backed up before redeploying or resetting the hosting app.

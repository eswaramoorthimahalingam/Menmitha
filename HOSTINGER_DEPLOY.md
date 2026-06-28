# Hostinger Deploy Notes

## Website app

- Domain: `https://menmithafoodproducts.com`
- Install command: `npm ci`
- Build command: `npm run build`
- Start command: `npm run start`
- Environment variables:

```env
NODE_ENV=production
VITE_ADMIN_API_BASE=https://api.menmithafoodproducts.com
```

## Admin API app

- Domain or subdomain: `https://api.menmithafoodproducts.com`
- Install command: `npm ci`
- Start command: `npm run admin:start`
- Environment variables:

```env
NODE_ENV=production
FRONTEND_URL=https://menmithafoodproducts.com
CORS_ORIGINS=https://menmithafoodproducts.com,https://www.menmithafoodproducts.com
ADMIN_PASSWORD=replace-with-a-strong-password
```

The API stores orders and inventory in `.data/admin-store.json` on the server. Keep that folder backed up before redeploying or resetting the hosting app.

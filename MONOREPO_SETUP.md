# POA Monorepo Setup Guide

## Structure
```
poa-monorepo/
├── apps/
│   ├── storefront/        # Next.js storefront (move existing code here)
│   └── booking/           # React booking app (Auricle-Booking)
├── packages/
│   └── shared/            # Shared types, utilities, components
├── package.json           # Root workspace config
└── vercel.json            # Vercel deployment config
```

## Next Steps

### 1. Move POA-Next to apps/storefront
```bash
# All source files from root go to apps/storefront
# Create apps/storefront/package.json with POA-Next dependencies
```

### 2. Setup apps/booking
```bash
# Clone or copy Auricle-Booking into apps/booking
# Update to use shared types from packages/shared
```

### 3. Install Monorepo Dependencies
```bash
# From root directory
yarn install
```

### 4. Run Development
```bash
# Start storefront
yarn dev

# Or start specific workspace
yarn workspace poa-storefront run dev
```

## Workspace Commands

- `yarn build` - Build all apps
- `yarn dev` - Run storefront dev server
- `yarn lint` - Lint all workspaces
- `yarn storefront` - Run commands in storefront workspace
- `yarn booking` - Run commands in booking workspace

## Vercel Deployment

Both apps will deploy to the same Vercel project:
- Storefront: `/` (root)
- Booking: `/booking` (separate app)

Environment variables are shared at the Vercel project level.

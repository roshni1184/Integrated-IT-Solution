# Integrated IT Solution

Integrated IT Solution is a MERN website for networking, cybersecurity, IT infrastructure, device rentals and sales, accessories, and corporate support.

## Architecture and implementation plan

- **Phase 1 — Frontend:** responsive React + Vite site with reusable sections and enquiry forms.
- **Phase 2 — Backend:** Express API, MongoDB/Mongoose models, validation, rate limits, email notifications, and API documentation.
- **Phase 3 — Admin:** JWT authentication, protected dashboard, lead and service management.
- **Phase 4 — Integration:** connect public forms and dashboard to the API.
- **Phase 5 — Verification:** validate forms, API permissions, admin actions, and responsive behavior.
- **Phase 6 — Deployment:** prepare Vercel, Render, and MongoDB Atlas configuration.

Phases 1 and 2 are implemented. Contact details and testimonials are intentionally omitted because verified company details were not supplied. Enquiry forms persist submissions when the API and database are configured.

## Run the frontend

```sh
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the backend API base URL when the backend is available. Frontend production build: `npm run build`.

## Run the backend

```sh
cd backend
npm install
cp .env.example .env
# Set MONGODB_URI and a unique random JWT_SECRET of at least 32 characters in .env
npm run dev
```

The API is available at `http://localhost:5000/api`. Set `VITE_API_URL=http://localhost:5000/api` in `frontend/.env` to connect the public enquiry forms.

Seed the service catalog with `npm run seed:services`. Create the first admin with environment variables (never a production default password):

```sh
$env:ADMIN_NAME="Site Administrator"
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="use-a-unique-password-at-least-14-characters"
npm run seed:admin
```

The API does not expose public admin registration. Configure SMTP variables in `backend/.env` to receive new enquiry notifications; notification failure does not discard a saved enquiry.

## API overview

- `GET /api/health` — API health status
- `POST /api/enquiries` — submit a contact or quote enquiry (validated and rate limited)
- `GET /api/services` and `GET /api/services/:slug` — active service catalog
- `POST /api/auth/login` and `GET /api/auth/me` — admin/team authentication
- `GET /api/enquiries`, `GET /api/enquiries/:id`, `PATCH /api/enquiries/:id`, `POST /api/enquiries/:id/notes`, `GET /api/enquiries/export.csv` — protected lead operations
- `GET /api/dashboard/analytics`, `/api/dashboard/customers`, `/api/dashboard/service-requests` — protected dashboard data and operations
- `POST`, `PATCH`, and `DELETE /api/services` — admin-only service management

Protected routes require `Authorization: Bearer <token>`. See `backend/API.md` for payload and filter details.

## Planned layout

```text
frontend/    React public site
backend/     Express API, models, middleware, scripts, API documentation
README.md    Project setup and deployment notes
```

## Deployment

Deployment is not configured or verified yet. The frontend is intended for Vercel, the API for Render, and persistence for MongoDB Atlas after later phases are implemented. Never put backend credentials in frontend environment variables.

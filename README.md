# Integrated IT Solution

Integrated IT Solution is a MERN website for networking, cybersecurity, IT infrastructure, device rentals and sales, accessories, and corporate support.

## Architecture and implementation plan

- **Phase 1 — Frontend:** responsive React + Vite site with reusable sections and enquiry forms.
- **Phase 2 — Backend:** Express API, MongoDB/Mongoose models, validation, rate limits, email notifications, and API documentation.
- **Phase 3 — Admin:** JWT authentication, protected dashboard, lead and service management.
- **Phase 4 — Integration:** connect public forms and dashboard to the API.
- **Phase 5 — Verification:** validate forms, API permissions, admin actions, and responsive behavior.
- **Phase 6 — Deployment:** prepare Vercel, Render, and MongoDB Atlas configuration.

The repository currently contains Phase 1. Contact details and testimonials are intentionally omitted because verified company details were not supplied. The enquiry UI will only persist submissions once the backend is configured.

## Run the frontend

```sh
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the backend API base URL when the backend is available. Frontend production build: `npm run build`.

## Planned layout

```text
frontend/    React public site
backend/     Express API (Phase 2)
README.md    Project setup and deployment notes
```

## Deployment

Deployment is not configured or verified yet. The frontend is intended for Vercel, the API for Render, and persistence for MongoDB Atlas after later phases are implemented. Never put backend credentials in frontend environment variables.

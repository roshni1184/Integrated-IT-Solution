# API reference

All endpoints are prefixed with `/api`. JSON bodies use `Content-Type: application/json`. Admin/team endpoints require `Authorization: Bearer <token>` unless marked public. The server validates environment variables and will not start with a missing or short JWT secret.

## Public endpoints

### `GET /health`

Returns `{ "status": "ok", "service": "integrated-it-solution-api" }`.

### `POST /enquiries`

Accepts `name`, `email`, `phone`, `company` (optional), `service`, `enquiryType` (`contact` or `quote`), `message`, and optional device fields `deviceType`, `quantity`, and `preference`. Name is 2–120 characters; message is 10–5000 characters. A valid request creates an enquiry and returns `201` with its ID. Rental and purchase preferences also create a service request and associate a customer record. SMTP notification is sent when configured.

Example:

```json
{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "phone": "+1 555 0100",
  "company": "Example Co",
  "service": "Laptop Rental",
  "enquiryType": "quote",
  "message": "We need laptops for a short term project team.",
  "deviceType": "Laptop",
  "quantity": 8,
  "preference": "Rental"
}
```

### `GET /services` and `GET /services/:slug`

Returns active service records. Run `npm run seed:services` to populate the initial catalog.

## Authentication

### `POST /auth/login`

Body: `{ "email": "admin@example.com", "password": "..." }`. Returns a JWT and minimal user profile. Login is rate limited. Public registration is not available.

### `GET /auth/me`

Returns the authenticated user's minimal profile.

## Protected enquiry endpoints

- `GET /enquiries`: pagination (`page`, `limit`, max 100), search (`search`), `status`, `service`, `enquiryType`, and ISO date filters `from` / `to`.
- `GET /enquiries/export.csv`: exports up to 10,000 matching rows with the same filters.
- `POST /enquiries/manual`: admin-only; accepts the public enquiry body.
- `GET /enquiries/:id`: full enquiry and notes.
- `PATCH /enquiries/:id`: update `status`, `followUpAt` (ISO date or null), and/or `assignedTo` (user ID or null).
- `POST /enquiries/:id/notes`: `{ "text": "Followed up by email" }`.

## Admin endpoints

- `GET /dashboard/analytics`: status totals, totals by service, daily enquiry counts, and monthly counts.
- `GET /dashboard/customers`: paginated list with optional `search`.
- `POST /dashboard/customers`: create a customer with `name` and optional `email`, `phone`, `company`, `notes`.
- `GET /dashboard/service-requests`: paginated requests with optional `status` and `requestType` filters.
- `PATCH /dashboard/service-requests/:id`: change `status` to `new`, `reviewing`, `fulfilled`, or `cancelled`.
- `POST /services`, `PATCH /services/:id`, `DELETE /services/:id`: admin-only service catalog management.
- `GET /services/manage`: admin-only complete service list, including inactive records.

## Security and operations

Helmet security headers, origin allowlisting (`CLIENT_ORIGIN`, comma-separated), JSON size limits, request/login/enquiry rate limits, Zod input validation, bcrypt password hashing, role checks, and generic server errors are enabled. The stricter enquiry limit applies to public submissions; authenticated admin enquiry reads and updates use the general API limit. CSV exports neutralize spreadsheet formula prefixes in user supplied fields. Set `trust proxy` correctly when deploying behind a proxy. MongoDB and SMTP credentials belong only in backend environment variables.

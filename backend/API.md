# API reference

All endpoints are prefixed with `/api`. JSON bodies use `Content-Type: application/json`. Admin/team endpoints require `Authorization: Bearer <token>` unless marked public. The server validates environment variables and will not start with a missing or short JWT secret.

## Public endpoints

### `GET /health`

Returns `{ "status": "ok", "service": "integrated-it-solution-api" }`.

### `GET /ready`

Returns HTTP `200` while MongoDB is connected, or HTTP `503` when the API process is running but MongoDB is unavailable. Use this endpoint for deployment readiness checks.

### `POST /enquiries`

Accepts `name`, `email`, `phone`, `company` (optional), `service`, `enquiryType` (`contact` or `quote`), `message`, and optional `source` (`website`, `whatsapp`, `phone`, `referral`, or `other`). Quote requests can include `deviceType`, `quantity`, `preference`, `deviceConfiguration`, `rentalDuration`, and `location`. Name is 2–120 characters; message is 10–5000 characters. A valid request creates an enquiry and customer record, and returns `201` with its ID. Rental, purchase, and sale/trade-in preferences also create a linked service request. SMTP notification is sent when configured.

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

- `GET /enquiries`: pagination (`page` 1–10,000; `limit` 1–100), search (`search`, max 120 characters), `status`, `source`, `service`, `enquiryType`, and `YYYY-MM-DD` date filters `from` / `to` (inclusive). Unknown or invalid query parameters return `400`.
- `GET /enquiries/export.csv`: exports up to 10,000 matching rows with the same filters, including source and quote requirements.
- `POST /enquiries/manual`: admin-only; accepts the public enquiry body and creates linked customer/service-request records when rental or purchase details are supplied.
- `GET /enquiries/:id`: full enquiry and notes.
- `PATCH /enquiries/:id`: update `status`, `followUpAt` (ISO date or null), and/or `assignedTo` (active user ID or null). Assignments to missing or inactive users are rejected.
- `POST /enquiries/:id/notes`: `{ "text": "Followed up by email" }`.

## Admin endpoints

- `GET /dashboard/analytics`: status totals, totals by service, daily enquiry counts, monthly counts, and up to eight upcoming or overdue follow-ups.
- `GET /dashboard/customers`: paginated list with optional `search` (max 120 characters); invalid or unknown query parameters return `400`.
- `POST /dashboard/customers`: create a customer with `name` and optional `email`, `phone`, `company`, `notes`.
- `GET /dashboard/customers/:id`: return a customer with up to 100 related enquiries and service requests.
- `GET /dashboard/service-requests`: paginated requests with optional `status` and `requestType` filters (`rental`, `purchase`, `sale_trade_in`, or `service`); invalid or unknown query parameters return `400`. Enquiries with the `Sale / trade-in` preference are saved as `sale_trade_in` requests.
- `PATCH /dashboard/service-requests/:id`: change `status` to `new`, `reviewing`, `fulfilled`, or `cancelled`.
- `POST /services`, `PATCH /services/:id`, `DELETE /services/:id`: admin-only service catalog management.
- `GET /services/manage`: admin-only complete service list, including inactive records.

## Security and operations

Helmet security headers, origin allowlisting (`CLIENT_ORIGIN`, comma-separated), JSON size limits, request/login/enquiry rate limits, Zod input validation, bcrypt password hashing, role checks, and generic server errors are enabled. Invalid JSON receives `400`; JSON bodies over 30 KB receive `413`. The stricter enquiry limit applies to public submissions; authenticated admin enquiry reads and updates use the general API limit. CSV exports neutralize spreadsheet formula prefixes in user supplied fields. Set `trust proxy` correctly when deploying behind a proxy. Set `MONGODB_DB_NAME` (defaults to `integrated-it-solution`) to choose the database while keeping credentials in the backend environment only.

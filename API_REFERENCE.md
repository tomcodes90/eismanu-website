# Reservation Service — API Reference

This document is the complete reference for building a frontend against the reservation-service backend.

## Base URL

```
http://localhost:8080
```

## Global Rules

- Every request must include the header `X-Tenant-Id: eismanufaktur-geratal`.
- All dates use ISO 8601 format: `yyyy-MM-dd` (e.g. `2026-04-25`).
- All times use 24-hour format: `HH:mm:ss` (e.g. `14:30:00`).
- All timestamps in responses are UTC.
- Protected endpoints require `Authorization: Bearer <accessToken>` in the header.
- All error messages are in German and can be shown directly to the user.

---

## How the Reservation Flow Works

**Reservations are auto-confirmed — there is no manual confirmation step.**

1. Guest books online → reservation is immediately set to **`CONFIRMED`**
2. A confirmation email is sent automatically with a **cancel link** (not a confirm link)
3. If there's a problem with the booking, staff calls the guest directly
4. Guest can cancel anytime by clicking the link in their email — no login needed
5. Staff marks the reservation as `COMPLETED` after the visit

### Status Flow
```
CONFIRMED → COMPLETED   (staff marks as fulfilled)
CONFIRMED → CANCELLED   (staff cancels, or guest cancels via email link)
COMPLETED → CONFIRMED   (revert an accidental completion)
```

---

## Authentication

### Login
`POST /api/v1/auth/login`

Public. Returns an access token (valid 8 hours) and a refresh token (valid 7 days).

**Request body:**
```json
{
  "username": "admin",
  "password": "admin123",
  "tenantId": "eismanufaktur-geratal"
}
```

**Response `200`:**
```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<uuid>",
  "accessTokenExpiresIn": 28800000,
  "tokenType": "Bearer"
}
```

---

### Refresh Token
`POST /api/v1/auth/refresh`

Public. Use when the access token expires. The old refresh token is immediately invalidated and a new pair is returned.

**Request body:**
```json
{ "refreshToken": "<refresh_token>" }
```

**Response `200`:** same shape as Login.

---

### Logout
`POST /api/v1/auth/logout`

Protected. Revokes all refresh tokens for the logged-in user.

**Headers:** `Authorization: Bearer <accessToken>`  
**Response `204`:** no body.

---

## Reservations (Public)

### Create a Reservation
`POST /api/v1/reservations`

Public. Guests use this to book a table. Bookings must be at least one day in advance — same-day bookings return `422`. The restaurant is closed on Mondays and Tuesdays; attempting to book on those days returns `400 CLOSED_DAY` unless the date is a German public holiday (in which case the booking proceeds normally). The reservation is immediately `CONFIRMED` and a confirmation email is sent.

**Headers:** `X-Tenant-Id`

**Request body:**
```json
{
  "name": "Thomas Micciche",
  "email": "thomas@example.com",
  "phone": "+49123456789",
  "date": "2026-04-25",
  "timeSlot": "14:30:00",
  "guests": 3,
  "seatingPreference": "TERRACE",
  "notes": "near the heater please"
}
```

| Field | Type | Rules |
|---|---|---|
| `name` | string | required |
| `email` | string | optional, valid email format if provided — confirmation email will not be sent if omitted |
| `phone` | string | optional |
| `date` | string | required, ISO date, must be at least tomorrow |
| `timeSlot` | string | required, `HH:mm:ss` |
| `guests` | integer | required, 1–20 |
| `seatingPreference` | string | optional — `TERRACE`, `INSIDE`, or `OTHER` |
| `notes` | string | optional — free text |

**Response `201`:** a `ReservationResponse` object (see schema below).

**Errors:**
- `400` — validation failed (missing or invalid fields)
- `400` `CLOSED_DAY` — the requested date is a closed day (Monday/Tuesday) and is not a public holiday; message: `"An diesem Tag ist das Lokal geschlossen. Reservierungen sind nicht möglich."`
- `409` — time slot is fully booked
- `422` — same-day booking not allowed

---

### Cancel a Reservation (by guest)
`DELETE /api/v1/reservations/{cancelToken}/cancel`

Public. Guests use the link in their confirmation email. No authentication required.

**Path param:** `cancelToken` — UUID found in the `ReservationResponse` and included in the confirmation email link.

**Response `204`:** no body.

**Errors:**
- `404` — token not found
- `422` — reservation already completed or cancelled

---

## Availability (Public)

### Check Availability
`GET /api/v1/availability?date=2026-04-25&time=14:00:00&partySize=4`

Public. Returns whether a table (or connected group) is available for the 2-hour window starting at the requested time. Only active tables are considered. Returns `available: false` with reason `CLOSED_DAY` when the date is a closed day and not a public holiday — use this to grey out closed dates in a date picker before the user attempts to book.

**Headers:** `X-Tenant-Id`

**Query params:**

| Param | Type | Required | Example |
|---|---|---|---|
| `date` | ISO date | yes | `2026-04-25` |
| `time` | ISO time | yes | `14:00:00` |
| `partySize` | integer 1–20 | yes | `4` |

**Response `200`:**
```json
{
  "date": "2026-04-25",
  "time": "14:00:00",
  "partySize": 4,
  "available": true,
  "primaryTableNumber": 3,
  "connectedTables": [4],
  "combinedCapacity": 8,
  "unavailableReason": null
}
```

| Field | Meaning |
|---|---|
| `available` | Whether a table exists for this party at this time |
| `primaryTableNumber` | Main table assigned (null if unavailable) |
| `connectedTables` | Adjacent tables combined for large parties (null if not needed) |
| `combinedCapacity` | Total capacity of primary + connected tables |
| `unavailableReason` | `null`, `"NO_TABLE_AVAILABLE"`, or `"CLOSED_DAY"` |

**`unavailableReason` values:**

| Value | Meaning |
|---|---|
| `null` | Available |
| `NO_TABLE_AVAILABLE` | No table fits the party at this time |
| `CLOSED_DAY` | The restaurant is closed on this day of the week and it is not a public holiday |

**Errors:** `400` — invalid params, `404` — tenant not found

---

## Admin — Reservations

All admin endpoints require:
- `Authorization: Bearer <accessToken>`
- `X-Tenant-Id: eismanufaktur-geratal`

---

### Create a Reservation (Staff)
`POST /api/v1/admin/reservations`

Protected. Staff use this to add a walk-in or phone booking. Same capacity, advance-booking, and closed-day rules apply. Email and phone are optional — confirmation email is only sent when an email address is provided.

**Request body:**
```json
{
  "name": "Thomas Micciche",
  "email": "thomas@example.com",
  "phone": "+49123456789",
  "date": "2026-04-25",
  "timeSlot": "14:30:00",
  "guests": 3,
  "seatingPreference": "INSIDE",
  "notes": null,
  "preferredTableNumber": 5
}
```

| Field | Type | Rules |
|---|---|---|
| `name` | string | required |
| `email` | string | optional, valid email if provided |
| `phone` | string | optional |
| `date` | string | required, ISO date, must be at least tomorrow |
| `timeSlot` | string | required, `HH:mm:ss` |
| `guests` | integer | required, 1–20 |
| `seatingPreference` | string | optional — `TERRACE`, `INSIDE`, or `OTHER` |
| `notes` | string | optional |
| `preferredTableNumber` | integer | optional — preferred table for this booking |

**Response `201`:** a `ReservationResponse` object.

**Errors:**
- `400` `CLOSED_DAY` — same closed-day rule as the public endpoint applies here too

---

### List All Reservations
`GET /api/v1/admin/reservations`

Paginated. Optionally filter by status.

**Query params:**

| Param | Default | Description |
|---|---|---|
| `page` | `0` | Page number (0-indexed) |
| `size` | `20` | Items per page |
| `status` | _(none)_ | Filter: `CONFIRMED`, `COMPLETED`, `CANCELLED` |

**Response `200`:**
```json
{
  "content": [ /* array of ReservationResponse */ ],
  "page": 0,
  "size": 20,
  "totalElements": 42,
  "totalPages": 3,
  "last": false
}
```

---

### Get Reservation by ID
`GET /api/v1/admin/reservations/{id}`

**Response `200`:** a `ReservationResponse` object.  
**Errors:** `404` — not found for this tenant

---

### Update Reservation Status
`PATCH /api/v1/admin/reservations/{id}/status`

Changes the status of a reservation. Only the following transitions are allowed:

```
CONFIRMED → COMPLETED
CONFIRMED → CANCELLED
COMPLETED → CONFIRMED   (revert accidental completion)
```

**Request body:**
```json
{ "status": "COMPLETED" }
```

**Response `200`:** updated `ReservationResponse`.  
**Errors:** `404` — not found, `422` — illegal status transition

---

### Auto-Assign Tables for a Day
`POST /api/v1/admin/reservations/assign-tables?date=2026-04-25`

Automatically assigns tables to all unassigned `CONFIRMED` reservations for the given day. Only active tables are considered.

**Response `200`:**
```json
{
  "date": "2026-04-25",
  "assigned": 5,
  "unassigned": 1,
  "assignments": [
    {
      "reservationId": 12,
      "guestName": "Thomas Micciche",
      "guests": 3,
      "timeSlot": "14:30:00",
      "assignedTableNumber": 3,
      "connectedTableNumbers": [],
      "reason": "BEST_FIT",
      "reuseCount": 0
    }
  ]
}
```

`reason` values: `PREFERRED_TABLE`, `BEST_FIT`, `CONNECTED`, `UNASSIGNED`, `MANUAL`, `SWAP`

---

### Unassign All Tables for a Day
`DELETE /api/v1/admin/reservations/assign-tables?date=2026-04-25`

Removes table assignments from all reservations on the given day.

**Response `200`:** no body.

---

### Manually Reassign a Table
`PATCH /api/v1/admin/reservations/{id}/table`

Manually assign a specific table (and optionally connected tables) to a reservation.

**Request body:**
```json
{
  "tableNumber": 3,
  "connectedTableNumbers": [4]
}
```

**Response `200`:** a `TableAssignmentResponse` object.

**Errors:** `400` — capacity or adjacency violation, `404` — reservation or table not found

---

### Swap Tables Between Two Reservations
`POST /api/v1/admin/reservations/swap-tables`

Atomically exchanges the table assignments of two `CONFIRMED` reservations in a single transaction. Both capacity constraints are validated before any change is made.

**Request body:**
```json
{
  "reservationIdA": 140,
  "reservationIdB": 202
}
```

**Response `200`:** array of two `TableAssignmentResponse` objects (one per reservation).

**Errors:** `400` — capacity violation (guest count doesn't fit the other's table), `404` — reservation not found

---

## Admin — Tables

All admin table endpoints require:
- `Authorization: Bearer <accessToken>`
- `X-Tenant-Id: eismanufaktur-geratal`

---

### Get Table Status for a Day
`GET /api/v1/admin/tables/status?date=2026-04-25`

Returns the occupancy state of every table for the given date, including inactive tables (they always appear as `available`).

**Response `200`:**
```json
{
  "date": "2026-04-25",
  "tables": [
    {
      "tableNumber": 3,
      "type": "SQUARE",
      "area": "TERRACE",
      "capacity": 4,
      "status": "occupied",
      "availableAt": "16:30:00",
      "currentReservationId": 12
    },
    {
      "tableNumber": 7,
      "type": "ROUND",
      "area": "INSIDE",
      "capacity": 4,
      "status": "available",
      "availableAt": null,
      "currentReservationId": null
    }
  ]
}
```

---

### List All Tables
`GET /api/v1/admin/tables`

Returns all tables including inactive ones, sorted by table number.

**Response `200`:** array of `CafeTableResponse` objects.

```json
[
  {
    "id": 1,
    "tableNumber": 3,
    "tableType": "SQUARE",
    "capacity": 4,
    "area": "INSIDE",
    "active": true,
    "connectableWith": [4, 5]
  }
]
```

---

### Get a Single Table
`GET /api/v1/admin/tables/{tableNumber}`

**Response `200`:** a `CafeTableResponse` object.  
**Errors:** `404` — table not found

---

### Create a Table
`POST /api/v1/admin/tables`

**Request body:**
```json
{
  "tableNumber": 27,
  "tableType": "SQUARE",
  "capacity": 6,
  "area": "TERRACE",
  "connectableWith": [26],
  "active": false
}
```

| Field | Type | Rules |
|---|---|---|
| `tableNumber` | integer | required, ≥ 1, must be unique for this tenant |
| `tableType` | string | required — `SQUARE` or `ROUND` |
| `capacity` | integer | required, ≥ 1 |
| `area` | string | required — `INSIDE` or `TERRACE` |
| `connectableWith` | array of integers | optional — table numbers this table can be joined with |
| `active` | boolean | optional, default `false` — must be explicitly set to `true` to make the table bookable |

**Response `201`:** a `CafeTableResponse` object.  
**Errors:** `400` — table number already exists

---

### Update a Table
`PUT /api/v1/admin/tables/{tableNumber}`

Updates the properties of an existing table. All fields are optional — only provided fields are changed. To clear all connections, pass `"connectableWith": []`.

**Request body:**
```json
{
  "capacity": 8,
  "active": true
}
```

| Field | Type | Notes |
|---|---|---|
| `tableType` | string | optional — `SQUARE` or `ROUND` |
| `capacity` | integer | optional, ≥ 1 |
| `area` | string | optional — `INSIDE` or `TERRACE` |
| `connectableWith` | array of integers | optional — `null` = no change, `[]` = clear all |
| `active` | boolean | optional — toggle visibility to assignment algorithm |

**Response `200`:** updated `CafeTableResponse`.  
**Errors:** `404` — table not found

---

### Delete a Table
`DELETE /api/v1/admin/tables/{tableNumber}`

**Response `204`:** no body.  
**Errors:** `404` — table not found

---

## Admin — Table Presets

Presets let you save and restore named table configurations. Useful for switching between a standard layout and an event layout (e.g. disco night with extra tables active and higher capacities).

### List Presets
`GET /api/v1/admin/tables/presets`

**Response `200`:**
```json
[
  {
    "id": 1,
    "name": "Standard",
    "createdAt": "2026-05-01T10:00:00",
    "tableCount": 22
  },
  {
    "id": 2,
    "name": "Disco Event",
    "createdAt": "2026-05-01T11:00:00",
    "tableCount": 26
  }
]
```

---

### Get Preset Detail
`GET /api/v1/admin/tables/presets/{presetId}`

Returns the full snapshot including every table's configuration at the time the preset was saved.

**Response `200`:**
```json
{
  "id": 1,
  "name": "Standard",
  "createdAt": "2026-05-01T10:00:00",
  "entries": [
    {
      "tableNumber": 3,
      "tableType": "SQUARE",
      "capacity": 4,
      "area": "INSIDE",
      "active": true,
      "connectableWith": [4, 5]
    }
  ]
}
```

**Errors:** `404` — preset not found

---

### Save Current Config as Preset
`POST /api/v1/admin/tables/presets`

Snapshots the current state of all tables (type, capacity, area, active flag, connections) and saves it under a name.

**Request body:**
```json
{ "name": "Disco Event" }
```

**Response `201`:** a full `PresetDetailResponse` object.  
**Errors:** `400` — a preset with that name already exists

---

### Apply a Preset
`POST /api/v1/admin/tables/presets/{presetId}/apply`

Restores all table properties from the snapshot. Tables that were deleted after the preset was saved are skipped and counted in `tablesNotFound`.

**Response `200`:**
```json
{
  "presetName": "Disco Event",
  "tablesUpdated": 26,
  "tablesNotFound": 0
}
```

**Errors:** `404` — preset not found

---

### Delete a Preset
`DELETE /api/v1/admin/tables/presets/{presetId}`

**Response `204`:** no body.  
**Errors:** `404` — preset not found

> Deleting a preset also removes all day schedules that reference it (cascade).

---

## Admin — Day Preset Scheduling

Schedule a specific preset for a given date without changing the global table config. The assignment algorithm and status board automatically use the day's preset when one is scheduled.

### List Scheduled Days
`GET /api/v1/admin/tables/schedules?from=2026-05-10`

Returns all scheduled presets from the given date onwards (default: today).

**Response `200`:**
```json
[
  { "id": 1, "date": "2026-05-10", "presetId": 2, "presetName": "Disco Event" },
  { "id": 2, "date": "2026-05-17", "presetId": 2, "presetName": "Disco Event" }
]
```

---

### Get Schedule for a Date
`GET /api/v1/admin/tables/schedules/{date}`

**Response `200`:** a `DayPresetScheduleResponse` object.  
**Errors:** `404` — no preset scheduled for this date (standard config is active)

---

### Schedule a Preset for a Date
`PUT /api/v1/admin/tables/schedules/{date}`

Idempotent — calling again with a different `presetId` replaces the existing schedule for that date.

**Request body:**
```json
{ "presetId": 2 }
```

**Response `200`:** a `DayPresetScheduleResponse` object.  
**Errors:** `404` — preset not found

---

### Remove Schedule for a Date
`DELETE /api/v1/admin/tables/schedules/{date}`

Reverts the day to the standard (live) table configuration.

**Response `204`:** no body.

---

## Admin — Tenant Config

### Get Tenant Config
`GET /api/v1/admin/tenants/config`

**Response `200`:**
```json
{
  "tenantId": "eismanufaktur-geratal",
  "name": "Eismanufaktur Geratal",
  "maxCapacity": 20,
  "timezone": "Europe/Berlin",
  "closedDays": ["MONDAY", "TUESDAY"],
  "holidayCountryCode": "DE"
}
```

---

### Update Tenant Config
`PATCH /api/v1/admin/tenants/config`

Updates one or more config fields. All fields except `maxCapacity` are optional — omit to leave unchanged.

**Request body:**
```json
{
  "maxCapacity": 30,
  "closedDays": ["MONDAY", "TUESDAY"],
  "holidayCountryCode": "DE"
}
```

| Field | Type | Rules |
|---|---|---|
| `maxCapacity` | integer | required, ≥ 1 |
| `closedDays` | array of strings | optional — days of the week to close: `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY` |
| `holidayCountryCode` | string | optional — ISO 3166-1 alpha-2 country code for public holiday detection, e.g. `"DE"`, `"AT"`, `"IT"` |

**Response `200`:** updated `TenantConfigResponse`.

> **How closed days work:** On a closed day, bookings return `400 CLOSED_DAY`. If the date is a national public holiday for the configured country, the closed-day rule is lifted automatically — no manual action needed.

---

## Schemas

### ReservationResponse
```json
{
  "id": 1,
  "tenantId": "eismanufaktur-geratal",
  "name": "Thomas Micciche",
  "email": "thomas@example.com",
  "phone": "+49123456789",
  "date": "2026-04-25",
  "timeSlot": "14:30:00",
  "guests": 3,
  "status": "CONFIRMED",
  "cancelToken": "550e8400-e29b-41d4-a716-446655440000",
  "notes": "near the heater please",
  "seatingPreference": "TERRACE",
  "assignedTableNumber": 3,
  "preferredTableNumber": null,
  "connectedTableNumbers": [],
  "createdAt": "2026-04-19T10:00:00",
  "updatedAt": "2026-04-19T10:00:00",
  "confirmationEmailSent": true
}
```

> `confirmationEmailSent` — use this flag to identify guests whose confirmation email failed to send. Staff can follow up manually.

### TenantConfigResponse
```json
{
  "tenantId": "eismanufaktur-geratal",
  "name": "Eismanufaktur Geratal",
  "maxCapacity": 20,
  "timezone": "Europe/Berlin",
  "closedDays": ["MONDAY", "TUESDAY"],
  "holidayCountryCode": "DE"
}
```

### TableAssignmentResponse
```json
{
  "reservationId": 12,
  "guestName": "Thomas Micciche",
  "guests": 3,
  "timeSlot": "14:30:00",
  "assignedTableNumber": 3,
  "connectedTableNumbers": [4],
  "reason": "BEST_FIT",
  "reuseCount": 1
}
```

### CafeTableResponse
```json
{
  "id": 1,
  "tableNumber": 3,
  "tableType": "SQUARE",
  "capacity": 4,
  "area": "INSIDE",
  "active": true,
  "connectableWith": [4, 5]
}
```

### DayPresetScheduleResponse
```json
{
  "id": 1,
  "date": "2026-05-10",
  "presetId": 2,
  "presetName": "Disco Event"
}
```

### SeatingPreference Values
| Value | Meaning |
|---|---|
| `TERRACE` | Guest prefers the outdoor terrace |
| `INSIDE` | Guest prefers indoors |
| `OTHER` | Custom preference — see `notes` field |
| _(null)_ | No preference stated |

### TableType Values
| Value | Meaning |
|---|---|
| `SQUARE` | Can be connected to adjacent tables for large groups |
| `ROUND` | Cannot be connected; preferred for smaller groups |

### TableArea Values
| Value | Meaning |
|---|---|
| `INSIDE` | Indoor seating |
| `TERRACE` | Outdoor terrace seating |

### Status Values
| Value | Meaning |
|---|---|
| `CONFIRMED` | Default status on creation |
| `COMPLETED` | Guest has been served |
| `CANCELLED` | Cancelled by guest or staff |

### ErrorResponse
All errors return this shape:
```json
{
  "code": "SLOT_UNAVAILABLE",
  "message": "Dieser Zeitslot ist vollständig ausgebucht. Es sind noch 2 Plätze verfügbar.",
  "timestamp": "2026-04-19T10:00:00"
}
```

Error messages are in German and can be shown directly to the user.

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Field validation failed |
| `CLOSED_DAY` | 400 | Closed day — not a public holiday; message safe to show user |
| `INVALID_REQUEST` | 400 | Constraint or argument violation |
| `INVALID_CREDENTIALS` | 401 | Bad username/password |
| `INVALID_REFRESH_TOKEN` | 401 | Bad or expired refresh token |
| `RESERVATION_NOT_FOUND` | 404 | Reservation doesn't exist |
| `TABLE_NOT_FOUND` | 404 | Table doesn't exist |
| `PRESET_NOT_FOUND` | 404 | Preset doesn't exist |
| `TENANT_NOT_FOUND` | 404 | Tenant not found |
| `SLOT_UNAVAILABLE` | 409 | Time slot is full |
| `SAME_DAY_NOT_ALLOWED` | 422 | Must book at least 1 day in advance |
| `INVALID_STATUS_TRANSITION` | 422 | Disallowed status change |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded — wait and retry |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Authentication Flow for the Staff App

1. Show a login screen — call `POST /api/v1/auth/login`.
2. Store `accessToken` and `refreshToken` (e.g. in memory / httpOnly cookie).
3. Attach `Authorization: Bearer <accessToken>` to every admin request.
4. When a request returns `401`, call `POST /api/v1/auth/refresh` to get a new token pair and retry.
5. On logout, call `POST /api/v1/auth/logout` then clear stored tokens.

Access tokens are valid for **8 hours**. Refresh tokens are valid for **7 days**.

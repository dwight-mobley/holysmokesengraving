# Database Schema

**Database:** PostgreSQL (hosted on Supabase)
**ORM:** Prisma 7
**Migration:** `prisma/migrations/20260425220824_init`

---

## Entity Relationship Overview
Product ──< OrderItem >── Order ──> Customer

- A **Customer** places many **Orders**
- An **Order** contains many **OrderItems**
- Each **OrderItem** references one **Product**
- Prices are stored as **integers in cents** throughout (e.g. `1999` = $19.99)

---

## Tables

### `Product`

| Column        | Type        | Constraints              | Notes                          |
|---------------|-------------|--------------------------|--------------------------------|
| `id`          | `TEXT`      | PK, UUID                 |                                |
| `name`        | `TEXT`      | NOT NULL                 |                                |
| `description` | `TEXT`      | nullable                 |                                |
| `price`       | `INTEGER`   | NOT NULL                 | Unit price in cents            |
| `quantity`    | `INTEGER`   | NOT NULL, default `0`    | Available inventory            |
| `tags`        | `TEXT[]`    | NOT NULL                 | Postgres array                 |
| `slug`        | `TEXT`      | NOT NULL, UNIQUE         | URL-safe identifier            |
| `image`       | `TEXT`      | nullable                 | URL to image                   |
| `createdAt`   | `TIMESTAMP` | default `now()`          |                                |
| `updatedAt`   | `TIMESTAMP` | auto-updated             |                                |

**Indexes:** `Product_slug_key` (unique)

---

### `Customer`

| Column      | Type        | Constraints     | Notes                    |
|-------------|-------------|-----------------|--------------------------|
| `id`        | `TEXT`      | PK, UUID        |                          |
| `firstName` | `TEXT`      | NOT NULL        |                          |
| `lastName`  | `TEXT`      | NOT NULL        |                          |
| `email`     | `TEXT`      | NOT NULL, UNIQUE| Normalized to lowercase  |
| `phone`     | `TEXT`      | nullable        |                          |
| `street`    | `TEXT`      | nullable        | Shipping address         |
| `city`      | `TEXT`      | nullable        |                          |
| `state`     | `TEXT`      | nullable        |                          |
| `zip`       | `TEXT`      | nullable        |                          |
| `createdAt` | `TIMESTAMP` | default `now()` |                          |
| `updatedAt` | `TIMESTAMP` | auto-updated    |                          |

**Indexes:** `Customer_email_key` (unique)

---

### `Order`

| Column       | Type          | Constraints              | Notes                         |
|--------------|---------------|--------------------------|-------------------------------|
| `id`         | `TEXT`        | PK, UUID                 |                               |
| `customerId` | `TEXT`        | NOT NULL, FK → Customer  |                               |
| `status`     | `OrderStatus` | NOT NULL, default `pending` | See enum below             |
| `total`      | `INTEGER`     | NOT NULL                 | Sum of all OrderItem totals, in cents |
| `createdAt`  | `TIMESTAMP`   | default `now()`          |                               |
| `updatedAt`  | `TIMESTAMP`   | auto-updated             |                               |

**Foreign keys:**
- `customerId` → `Customer.id` (RESTRICT on delete)

---

### `OrderItem`

| Column      | Type      | Constraints             | Notes                                     |
|-------------|-----------|-------------------------|-------------------------------------------|
| `id`        | `TEXT`    | PK, UUID                |                                           |
| `orderId`   | `TEXT`    | NOT NULL, FK → Order    |                                           |
| `productId` | `TEXT`    | NOT NULL, FK → Product  |                                           |
| `quantity`  | `INTEGER` | NOT NULL                |                                           |
| `price`     | `INTEGER` | NOT NULL                | Unit price **at time of purchase** (snapshot) |
| `total`     | `INTEGER` | NOT NULL                | `price × quantity` in cents               |

**Foreign keys:**
- `orderId` → `Order.id` (RESTRICT on delete)
- `productId` → `Product.id` (RESTRICT on delete)

> `price` is snapshotted at order creation so historical order totals are unaffected by future product price changes.

---

## Enums

### `OrderStatus`

| Value        | Meaning                              |
|--------------|--------------------------------------|
| `pending`    | Order created, payment not confirmed |
| `processing` | Payment confirmed, being fulfilled   |
| `shipped`    | Dispatched to carrier                |
| `delivered`  | Confirmed delivery                   |
| `cancelled`  | Cancelled before shipment            |
| `refunded`   | Payment refunded                     |

---

## Design Decisions

- **All monetary values are integers (cents)** — avoids floating-point rounding errors. Use `formatMoney()` from `@hse/shared` for display.
- **`OrderItem.price` is a snapshot** — product price at time of purchase, not a live FK reference.
- **`DELETE RESTRICT` on all FKs** — orders and items are never cascade-deleted; they must be explicitly managed to preserve audit history.
- **`slug` as the public product identifier** — routes use `/products/:slug` rather than exposing internal UUIDs.
- **Address fields on Customer are optional** — supports guest checkout where address is captured at order time (future: move address to Order for multi-address support).
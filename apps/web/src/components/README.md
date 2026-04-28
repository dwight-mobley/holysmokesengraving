# Component Library

Shared UI components for the Holy Smokes Engraving storefront. Built with React 19, TypeScript, and Tailwind CSS v4.

Storybook is available for interactive component development:

```bash
npm run storybook
```

---

## UI Primitives (`ui/`)

### `Button`

General-purpose button with variant and size support.

```tsx
<Button variant="primary" size="md">Click Me</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="accent" size="lg" disabled>Processing...</Button>
```

| Prop      | Type                                   | Default     | Description           |
| --------- | -------------------------------------- | ----------- | --------------------- |
| `variant` | `'primary' \| 'secondary' \| 'accent'` | `'primary'` | Visual style          |
| `size`    | `'sm' \| 'md' \| 'lg'`                 | `'md'`      | Padding and font size |

Extends all native `<button>` attributes.

---

### `Input`

Styled text input with validation state support.

```tsx
<Input placeholder="Email" size="md" />
<Input invalid={true} inputMode="numeric" />
```

| Prop      | Type                   | Default | Description                      |
| --------- | ---------------------- | ------- | -------------------------------- |
| `size`    | `'sm' \| 'md' \| 'lg'` | `'md'`  | Padding and font size            |
| `invalid` | `boolean`              | `false` | Applies error border/ring styles |

Extends all native `<input>` attributes except `size`.

---

### `Card`

Surface container with configurable shadow and padding.

```tsx
<Card shadow="md" padding="lg">
  <p>Content goes here</p>
</Card>
```

| Prop      | Type                             | Default | Description      |
| --------- | -------------------------------- | ------- | ---------------- |
| `shadow`  | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'`  | Box shadow level |
| `padding` | `'sm' \| 'md' \| 'lg'`           | `'md'`  | Inner padding    |

Extends all native `<div>` attributes.

---

## Feature Components

### `ProductCard`

Displays a product in the catalog grid with image, name, price, and add-to-cart.

| Prop          | Type      | Required | Description                                     |
| ------------- | --------- | -------- | ----------------------------------------------- |
| `id`          | `string`  | Yes      | Product ID                                      |
| `name`        | `string`  | Yes      | Display name                                    |
| `slug`        | `string`  | Yes      | URL slug for detail page link                   |
| `price`       | `number`  | Yes      | Price in cents                                  |
| `image`       | `string`  | No       | Image URL                                       |
| `description` | `string`  | No       | Short description                               |
| `priority`    | `boolean` | No       | LCP hint for first card (`next/image` priority) |

---

### `AddToCartButton`

Add to cart / quantity controls. Reads and writes Zustand cart store.

| Prop        | Type     | Required | Description                   |
| ----------- | -------- | -------- | ----------------------------- |
| `productId` | `string` | Yes      | Product ID                    |
| `name`      | `string` | Yes      | Product name (stored in cart) |
| `price`     | `number` | Yes      | Price in cents                |

---

### `ShopClient`

Client component for the `/shop` page. Handles search, tag filtering, and product grid rendering.

| Prop       | Type        | Required | Description                              |
| ---------- | ----------- | -------- | ---------------------------------------- |
| `products` | `Product[]` | Yes      | Full product list (filtered client-side) |

---

### `Navbar`

Site-wide navigation with cart icon and mobile hamburger menu. No props — reads cart state from Zustand internally.

---

### `Footer`

Static site footer. No props.

---

### `CartClient`

Full cart page UI — item list, quantity controls, order summary, and link to checkout. No props — reads cart state from Zustand internally.

---

### `CheckoutClient`

Checkout form (contact + shipping address) with React Hook Form + Zod validation. Submits to `POST /api/checkout`. No props — reads cart state from Zustand internally.

---

### `CheckoutSuccess`

Order confirmation page. Clears cart on mount via Zustand. No props.

---

### `LoginClient`

Login form with email/password validation. Submits to `POST /api/auth/login`. No props.

---

### `RegisterClient`

Registration form with first name, last name, email, optional phone, password, and confirm password. Submits to `POST /api/auth/register`. No props.

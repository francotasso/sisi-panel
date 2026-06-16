<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sisi Panel — Project Conventions

## Image Upload Flow

- `POST /api/v1/products/{product_id}/image` — multipart/form-data with field `file`
- Accepts: `image/jpeg`, `image/png`, `image/webp`, `image/gif` — max 5MB
- Uploads to Cloudinary with `q_auto`, `f_auto`
- If the product already had an image, deletes it from Cloudinary before uploading the new one
- Returns `ProductDetailResponse` with `image: str | None` (Cloudinary URL)
- `POST /products` and `PUT /products/{id}` still accept `image` as an optional string (manual URL)

## Image Handling in ProductForm

- The form has **two mutually exclusive modes**:
  - **URL**: text input to paste a URL — preview updates instantly
  - **Upload**: drag-and-drop or file picker — generates preview with `URL.createObjectURL()`
- If the user drops a file, the URL field is cleared and disabled
- If the user types a URL, any pending file is cleared
- `PendingImage` type: `{ file: File; preview: string }` — passed to parent via `onPendingImageChange`
- Preview is validated: only renders `<Image>` if the URL starts with `http://`, `https://`, `blob:`, or `data:`

## Create/Edit Page Flow (Two-step)

1. Form data is submitted without `image` if there's a `pendingImage`
2. If the product mutation succeeds and there's a `pendingImage`, `uploadImage.mutate({ productId, file })` is called
3. **Single toast** at the end of the full flow (product + optional image)
4. If image upload fails, the product is still created/updated — a partial error toast is shown

## State Management

- **Auth**: Zustand + localStorage/cookie (see `src/stores/auth-store.ts`)
- **Theme**: Custom Zustand store (NOT `next-themes` even though it's a dependency)
- **Server state**: @tanstack/react-query with per-operation and per-entity hooks
- **Form state**: react-hook-form + zod schemas + shadcn `<Form>` wrapper

## API Client (`src/lib/api-client.ts`)

- `ApiClient` class with methods: `get`, `post`, `put`, `patch`, `delete`, `uploadFile`
- `uploadFile` uses raw `fetch` (no `Content-Type` header — lets the browser set it for `multipart/form-data`)
- Auto-redirects to `/login?expired=1` on 401/403
- `cn()` uses `clsx` + `tailwind-merge` (see `src/lib/utils.ts`)

## Design System

- **Accent**: rose/blush — `oklch(0.55 0.18 15)` in light mode, `oklch(0.75 0.14 15)` in dark mode
- **Typography**: Geist Sans (body) + Playfair Display (headings via `--font-heading`)
- **Components**: shadcn "base-nova" style with Tailwind v4
- **Icons**: lucide-react
- **Toasts**: sonner with `richColors`

## Patterns

- Each feature follows DDD-lite: `types.ts`, `services.ts`, `hooks/`, `components/`
- Tables: `rounded-xl border overflow-hidden bg-card`, striped rows (`bg-muted/20`), thumbnail column
- Contextual empty states with icon, gradient, and `font-heading`
- Command palette (Ctrl+K) via cmdk — mounted in `admin-layout.tsx`

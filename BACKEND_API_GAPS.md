# Backend API Gaps

## Products

- `GET /api/products/:id` for product lookup by Mongo ObjectId.
- `POST /api/products` for product creation.
- `PUT /api/products/:id` or `PATCH /api/products/:id` for product updates.
- `DELETE /api/products/:id` or batch delete for product deletion.
- Product image upload endpoint with multipart support.
- Product validation endpoint or route-level request validation for admin create/update payloads.
- Product duplicate endpoint.
- Product archive endpoint.
- Product restore endpoint.
- Product list total count and total pages in `GET /api/products/filter`.
- Product status filtering endpoint or documented mapping.

## Categories

- `POST /api/categories` for category creation.
- `PUT /api/categories/:id` or `PATCH /api/categories/:id` for category updates.
- `DELETE /api/categories/:id` for category deletion.
- `GET /api/categories/:id` for category lookup by Mongo ObjectId.
- Category duplicate endpoint.
- Category archive endpoint.
- Category restore endpoint.
- Category image upload endpoint with multipart support.
- Server-side search, filtering, pagination, and total counts.
- Category validation endpoint or route-level request validation for admin create/update payloads.

## Brands

- `GET /api/brands` for listing all brands without requiring a subcategory query.
- `GET /api/brands/:id` or `GET /api/brands/:slug` for direct brand detail.
- `POST /api/brands` for brand creation.
- `PUT /api/brands/:id` or `PATCH /api/brands/:id` for brand updates.
- `DELETE /api/brands/:id` for brand deletion.
- Brand duplicate endpoint.
- Brand archive endpoint.
- Brand restore endpoint.
- Brand image upload endpoint with multipart support.
- Server-side search, filtering, pagination, and total counts.
- Brand validation endpoint or route-level request validation for admin create/update payloads.

## Materials

- `POST /api/materials` for material creation.
- `PUT /api/materials/:id` or `PATCH /api/materials/:id` for material updates.
- `DELETE /api/materials/:id` for material deletion.
- `GET /api/materials/:id` for material lookup by Mongo ObjectId.
- Material duplicate endpoint.
- Material archive endpoint.
- Material restore endpoint.
- Server-side search, filtering, pagination, and total counts.
- Material validation endpoint or route-level request validation for admin create/update payloads.

## Machine Components

- `GET /api/machine-components/:id` or `GET /api/machine-components/:slug` for direct product detail.
- `POST /api/machine-components` for machine component creation.
- `PUT /api/machine-components/:id` or `PATCH /api/machine-components/:id` for updates.
- `DELETE /api/machine-components/:id` for deletion.
- Machine component duplicate endpoint.
- Machine component archive endpoint.
- Machine component restore endpoint.
- Machine component image upload endpoint with multipart support.
- Server-side search, filtering, pagination, and total counts.
- Machine component validation endpoint or route-level request validation for admin create/update payloads.

## Authentication And Permissions

- Admin login endpoint.
- Admin logout endpoint.
- Admin refresh-token endpoint.
- Admin current-user endpoint.
- Admin permission-loading endpoint.

## Uploads

- General image upload endpoint.
- General PDF upload endpoint.
- General multipart upload endpoint.

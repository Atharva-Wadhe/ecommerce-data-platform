# Join Strategy

## Purpose

Defines how source datasets will be joined during transformation.

---

| Left Table | Right Table | Join Key | Join Type |
|------------|-------------|-----------|-----------|
| Orders | Customers | customer_id | Inner |
| Order Items | Orders | order_id | Inner |
| Order Items | Products | product_id | Left |
| Order Items | Sellers | seller_id | Left |
| Payments | Orders | order_id | Left |
| Reviews | Orders | order_id | Left |
| Products | Category Translation | product_category_name | Left |

---

# Join Principles

- Preserve transactional integrity.
- Prevent duplicate revenue.
- Avoid cartesian joins.
- Validate foreign keys before joining.

---

# Join Order

Orders

↓

Customers

↓

Order Items

↓

Products

↓

Sellers

↓

Payments

↓

Reviews

---

# Potential Risks

- Missing foreign keys
- Duplicate order IDs
- Orphan records
- Incorrect join cardinality
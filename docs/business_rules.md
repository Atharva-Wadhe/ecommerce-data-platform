# Business Rules

## Purpose

Defines the business logic applied during transformation.

---

# Revenue

Revenue is calculated using successful payment values.

Cancelled orders are excluded.

---

# Delivery Time

Delivery Time

=

Order Delivered Date

-

Purchase Date

---

# Average Order Value

Revenue

/

Completed Orders

---

# Repeat Customer

Customer with more than one completed order.

---

# Payment Success

Payment exists

AND

Order status is delivered.

---

# Product Sales

Calculated from order items.

Not from orders.

---

# Review Score

Average of review scores per product.

---

# Category Names

Translate Portuguese names into English.

---

# Invalid Data

Rows violating business rules are quarantined.

Examples:

- Negative payment
- Invalid dates
- Missing primary keys

---

# Pipeline Behavior

Pipeline should be idempotent.

Reprocessing the same file must not create duplicate records.
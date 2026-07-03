# Conceptual Data Model

The platform models the operational workflow of an e-commerce marketplace.

Customer

↓

Order

↓

Order Item

↓

Product

↓

Seller

↓

Payment

↓

Review

---

## Business Relationships

Customer places many Orders

Order contains many Order Items

Order Item references one Product

Order Item belongs to one Seller

Order has one or more Payments

Order may have one Review

---

## Cardinality

Customer (1) ------ (N) Orders

Orders (1) ------ (N) Order Items

Product (1) ------ (N) Order Items

Seller (1) ------ (N) Order Items

Orders (1) ------ (N) Payments

Orders (1) ------ (1) Reviews
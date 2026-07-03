# Table Grain

## Purpose

This document defines the grain (lowest level of detail) for every source table.

Understanding table grain prevents incorrect joins and inaccurate aggregations.

---

| Table | Grain |
|---------|-------|
| Customers | One row per customer |
| Orders | One row per order |
| Order Items | One row per product within an order |
| Products | One row per product |
| Sellers | One row per seller |
| Payments | One row per payment transaction |
| Reviews | One row per review |
| Geolocation | One row per ZIP code prefix |
| Category Translation | One row per product category |

---

# Notes

## Orders

Represents the lifecycle of an order.

Contains:

- Purchase timestamp
- Delivery timestamp
- Estimated delivery
- Order status

---

## Order Items

Contains line-level sales information.

Example:

Order A

Laptop

Mouse

Keyboard

This results in three rows.

---

## Payments

One order can have multiple payment records.

Example:

Order 101

Credit Card

Voucher

Two payment rows.

---

## Reviews

Typically one review per order.

Contains customer satisfaction metrics.

---

# Engineering Implications

Revenue should be calculated from order item or payment grain rather than order grain to avoid inaccuracies.
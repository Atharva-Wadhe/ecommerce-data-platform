# Entity Relationships

## Purpose

This document describes how business entities relate to one another.

---

# Business Entity Diagram

Customer
    │
    │ Places
    ▼
Order
    │
    ├───────────────┐
    ▼               ▼
Order Item      Payment
    │
    ▼
Product
    │
    ▼
Seller

Order
   │
   ▼
Review

---

# Relationship Summary

| Parent | Child | Relationship |
|---------|--------|-------------|
| Customer | Orders | 1:N |
| Orders | Order Items | 1:N |
| Orders | Payments | 1:N |
| Orders | Reviews | 1:1 |
| Product | Order Items | 1:N |
| Seller | Order Items | 1:N |

---

# Business Flow

Customer

↓

Places Order

↓

Makes Payment

↓

Seller Ships Product

↓

Order Delivered

↓

Customer Leaves Review
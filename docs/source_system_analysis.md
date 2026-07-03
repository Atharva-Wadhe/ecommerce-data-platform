# Source System Analysis

## Purpose

This document describes the source operational system, the datasets received, their business purpose, and how they contribute to the analytics platform.

---

# Source System Overview

The source data represents a Brazilian e-commerce marketplace where customers purchase products from multiple sellers. The platform captures operational events such as customer registration, order placement, payments, product reviews, and deliveries.

The data is delivered as daily CSV extracts and serves as the input to the batch data pipeline.

---

# Source Tables

| Table | Type | Business Domain | Description |
|---------|------|----------------|-------------|
| olist_customers_dataset | Master | Customer | Customer information and location |
| olist_orders_dataset | Transaction | Orders | Order lifecycle and status |
| olist_order_items_dataset | Transaction | Sales | Individual products purchased in an order |
| olist_products_dataset | Master | Product | Product catalog and attributes |
| olist_sellers_dataset | Master | Seller | Marketplace seller information |
| olist_order_payments_dataset | Transaction | Finance | Payment information |
| olist_order_reviews_dataset | Transaction | Customer Experience | Customer feedback |
| olist_geolocation_dataset | Reference | Geography | ZIP code location mapping |
| product_category_name_translation | Reference | Product | Portuguese to English category mapping |

---

# Data Characteristics

- Batch-oriented data delivery
- Structured CSV files
- Relational dataset
- Historical records
- Multiple one-to-many relationships
- Moderate data volume (~100k orders)

---

# Business Process Flow

Customer Registration
        ↓
Product Browsing
        ↓
Order Placement
        ↓
Payment Processing
        ↓
Seller Fulfillment
        ↓
Order Delivery
        ↓
Customer Review

---

# Source System Assumptions

- Each order belongs to one customer.
- Orders may contain multiple products.
- Products are sold by sellers.
- Orders may have multiple payment records.
- Customers may submit one review per order.
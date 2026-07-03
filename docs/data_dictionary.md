# Data Dictionary

## Source Tables

| Table | Description |
|---------|------------|
| customers | Customer information |
| orders | Order lifecycle |
| order_items | Purchased products |
| products | Product catalog |
| sellers | Marketplace sellers |
| order_payments | Payment details |
| order_reviews | Customer reviews |
| geolocation | ZIP code mapping |
| product_category_translation | Category mapping |

---

## Primary Keys

| Table | Primary Key |
|---------|-------------|
| customers | customer_id |
| orders | order_id |
| products | product_id |
| sellers | seller_id |
| order_reviews | review_id |

---

## Important Foreign Keys

orders.customer_id

↓

customers.customer_id

order_items.product_id

↓

products.product_id

order_items.seller_id

↓

sellers.seller_id

payments.order_id

↓

orders.order_id

reviews.order_id

↓

orders.order_id
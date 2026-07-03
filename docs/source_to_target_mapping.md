# Source to Target Mapping

## Purpose

Maps source columns to the curated analytics model.

---

| Source Table | Source Column | Target Table | Target Column |
|--------------|--------------|--------------|---------------|
| Customers | customer_id | DimCustomer | customer_id |
| Customers | customer_city | DimCustomer | city |
| Customers | customer_state | DimCustomer | state |
| Products | product_id | DimProduct | product_id |
| Products | product_category_name | DimProduct | category |
| Sellers | seller_id | DimSeller | seller_id |
| Orders | order_purchase_timestamp | FactSales | purchase_date |
| Orders | order_status | FactSales | order_status |
| Order Items | freight_value | FactSales | freight_cost |
| Payments | payment_value | FactSales | sales_amount |
| Reviews | review_score | FactSales | review_score |

---

# Transformation Notes

- Dates converted to UTC.
- Categories translated to English.
- Revenue aggregated at order-item level.
- Surrogate keys generated during dimension loading.
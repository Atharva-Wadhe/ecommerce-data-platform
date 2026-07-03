# Dimensional Model

## Fact Tables

### FactSales

Measures:

- Revenue
- Quantity
- Freight Cost
- Delivery Time

Foreign Keys:

- Customer Key
- Product Key
- Seller Key
- Payment Key
- Date Key

---

## Dimension Tables

### DimCustomer

Customer information

---

### DimProduct

Product information

---

### DimSeller

Seller information

---

### DimDate

Calendar attributes

- Day
- Month
- Quarter
- Year

---

### DimPayment

Payment type

Installments

Payment value

---

## Star Schema

                DimDate
                   |
                   |
DimCustomer -- FactSales -- DimProduct
                   |
              DimSeller
                   |
             DimPayment
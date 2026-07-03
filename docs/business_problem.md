# Business Problem

## Background

ShopSphere is a large-scale e-commerce marketplace that generates operational data from multiple business domains, including orders, customers, products, payments, sellers, reviews, and logistics.

Every day, these operational systems export raw CSV files that are manually processed by different business teams to create reports.

The current reporting process is slow, inconsistent, and prone to errors due to duplicate records, missing values, and inconsistent business logic across teams.

---

## Current Challenges

- Manual preparation of business reports
- Reports require 6–8 hours to complete
- No centralized source of truth
- Duplicate and inconsistent data
- Delayed decision-making
- Limited visibility into business performance

---

## Business Objective

Design and implement an automated batch data platform that ingests daily operational data, performs validation and transformation, and produces trusted analytics-ready datasets before 6:00 AM every day.

The platform should provide consistent business metrics for all stakeholders while ensuring data quality, reliability, and scalability.

---

## Success Criteria

The solution should:

- Automatically process daily datasets
- Validate incoming data
- Handle duplicate and invalid records
- Generate curated analytics datasets
- Support business reporting
- Deliver reports before business hours
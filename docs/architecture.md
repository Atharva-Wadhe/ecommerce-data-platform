# System Architecture

## Overview

The platform follows a modern Medallion-style data architecture consisting of Bronze (Raw), Silver (Processed), and Gold (Curated) layers.

---

## High-Level Workflow

Source Systems

↓

Landing Zone (Raw CSV)

↓

Apache Airflow

↓

Apache Spark Validation

↓

Apache Spark Transformation

↓

Curated Parquet Layer

↓

Analytics Tables

↓

Business Reports

---

## Technology Stack

| Layer | Technology |
|---------|------------|
| Orchestration | Apache Airflow |
| Processing | Apache Spark |
| Storage | Local File System / Parquet |
| Database | PostgreSQL |
| Language | Python |
| Containerization | Docker |
| Version Control | Git |

---

## Data Layers

### Bronze Layer

Purpose:

- Store raw immutable files.

Characteristics:

- Original schema
- No transformations
- Historical retention

---

### Silver Layer

Purpose:

- Clean and standardized data.

Operations:

- Remove duplicates
- Null handling
- Schema validation
- Standardization

---

### Gold Layer

Purpose:

Business-ready analytical datasets.

Contains:

- Fact tables
- Dimension tables
- Aggregated metrics
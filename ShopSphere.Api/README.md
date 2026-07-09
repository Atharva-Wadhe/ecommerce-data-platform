ShopSphere.Api

.NET 8 Minimal API that exposes analytics functions from the `analytics` schema.

Quick start:

1. Edit `appsettings.json` and set `ConnectionStrings:AnalyticsDb` to your OLTP DB connection string (use credentials from GoldLayer config).
2. From this folder run:

```bash
dotnet restore
dotnet run
```

Endpoints:

- GET /api/dashboard/summary?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
- GET /api/dashboard/revenue-trend?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
- GET /api/dashboard/order-status?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD

Notes:
- This project expects stored functions in `analytics` schema as described in the design.
- Uses Dapper + Npgsql for lightweight DB access.

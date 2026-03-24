# Druxcar Development Task List

## 1. Project Analysis
- [/] Review Product Requirements Document (PRD)
- [/] Review Database Design ([table-updated.csv](file:///d:/My%20Coding/backend/druxcars/Database%20Design/table-updated.csv))
- [/] Review Development Guidelines ([dev_guidelines.md](file:///d:/My%20Coding/backend/druxcars/api/dev_guidelines.md))
- [x] Audit currently implemented modules (`iam`, `fleet`, `rentals`)
- [x] Audit middleware (Auth Middleware)

## 2. Infrastructure & Setup
- [x] Basic Express/Node.js setup
- [x] Error Handling & Logging Middleware
- [x] Complete JWT Auth Middleware

## 3. Domain Modules Implementation
*Based on [table-updated.csv](file:///d:/My%20Coding/backend/druxcars/Database%20Design/table-updated.csv) and [dev_guidelines.md](file:///d:/My%20Coding/backend/druxcars/api/dev_guidelines.md)*

- [/] **IAM Domain** (Users, Roles, Permissions, Sessions)
- [x] **Catalog/Fleet Domain** (Vehicles, Makes, Models, Types, Features)
- [/] **Rentals Domain** (Bookings, Addons, Pricing Rules)
- [x] **Geography Domain** (Countries, Regions, Cities, Locations)
- [x] **Operations Domain** (Agencies, Settings, Waitlists)
- [ ] **Insurance Domain** (Plans, Coverages, Selections)
- [ ] **Maintenance Domain** (Logs, Items, Reports, Inspections)
- [ ] **Customer Success Domain** (Tickets, Feedback, Claims, FAQs)
- [ ] **Loyalty Domain** (Memberships, Transactions, Rewards)
- [ ] **Advertising Domain** (Advertisers, Campaigns, Coupons)
- [ ] **Subscriptions Domain** (Subscriptions, Plans)
- [/] **Finance Domain** (Transactions, Payouts, Invoices, Taxes)
- [ ] **Drivers Domain** (Schedules, Telematics)
- [ ] **Assistance Domain** (Providers, Plans, Requests)
- [ ] **System Domain** (AuditLogs, Settings)

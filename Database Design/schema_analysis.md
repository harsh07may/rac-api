# Database Schema Analysis & Recommendations

Based on the review of the 96 tables extracted from [tables.csv](file:///d:/My%20Coding/backend/druxcars/tables.csv), there are several issues related to naming conventions, over-normalization, and domain boundary bleed.

## 1. Naming Convention Inconsistencies

The current schema uses a mix of prefixes and styles that lack a unified convention:

- **Advertising Domain:** Mixes `adv_` and `advertisement_`. _(e.g., `adv_company_advertisements`, `advertisement_companyinformation`, `advertiser_subscriptions`)_
- **Employee/HR Domain:** Uses `emp_` as a prefix even for global lookup tables. _(e.g., `emp_cities`, `emp_countries`, `emp_regions` should just be `cities`, `countries`, `regions`)_
- **Rental Companies:** Mixes `rental_company_` and `rent_comp_`. _(e.g., `rental_company_subscriptions` vs `rent_comp_promodiscount`)_
- **Pluralization:** Mixes plural and singular nouns seemingly at random _(e.g., `users`, `vehicle_types` vs `customerfeedback`, `waitlist`)_.

## 2. Over-Normalization & Redundancy

Several tables are split out unnecessarily, which will lead to complex joins and performance bottlenecks:

### Advertising

- **Current:** `adv_company_advertisements`, `advertisement_companyinformation`, `advertiser_subscriptions`.
- **Recommendation:** Consolidate `advertisement_companyinformation` directly into a core `Advertisers` table. The `adv_subscription_payments` and `advertisement_subscriptionplan` can be integrated into a unified `Billing` or `Subscriptions` module rather than strictly tying payments directly to advertisers.

### Roles & Employees

- **Current:** `emp_employees`, `emp_staff_jobpositions`, `emp_rental_agents`, `emp_permissions`, `emp_roles`, `emp_role_permissions_linkingtbl`, `emp_user_roles_linkingtbl`.
- **Recommendation:** This is highly over-normalized. `emp_staff_jobpositions` and `emp_roles` basically serve the same purpose. `emp_rental_agents` could just be a role flag on an `employee` or `user` record. We can streamline this into `Users`, `Roles`, `Permissions`, and `User_Roles`.

### Payments & Transactions

- **Current:** `rental_agreement_payments`, `rental_agreement_payouts`, `rental_agreement_transactions`.
- **Recommendation:** Consolidate into a unified `Transactions` table with a `type` enum (`payment`, `refund`, `payout`).

### Geographic Data & Locations

- **Current:** `emp_cities`, `emp_countries`, `emp_regions`, `locations`.
- **Recommendation:** Move to a global shared module: `Cities`, `Countries`, `Regions`, `Locations`. Remove the `emp_` prefix entirely.

## 3. Domain Boundary Re-Alignment (The "Multiple Applications" View)

As highlighted, this document outlines multiple distinct applications. The database schema should reflect bounded contexts (Domain-Driven Design).

We should modularize the database schema into the following domains:

1.  **Identity & Access Management (IAM):** Users, Auth, Roles, Permissions.
2.  **Core Catalog (Vehicles):** Vehicles, Makes, Models, Features, Types.
3.  **Booking Engine (Rentals):** Agreements, Rules, Add-ons.
4.  **Billing & Payments:** Transactions, Invoices, Payouts, Taxes.
5.  **Partners & Operations:** Rental Companies, Branches, Maintenance, Subscriptions.
6.  **Marketing & Advertising:** Advertisers, Campaigns, Coupons.
7.  **Customer Success:** Claims, Support Tickets, Feedback.

## 4. Proposed Action Plan (Prisma ORM)

Transitioning to **Prisma ORM** (as requested) is a highly beneficial move here. Prisma's `schema.prisma` file will allow us to define these modular relationships much more cleanly. Prisma will handle the many-to-many linking tables automatically without us needing to explicitly define arbitrary linking tables like `emp_role_permissions_linkingtbl`.

# Product Requirements Document (PRD): Druxcar.com Ecosystem

## 1. Executive Summary
**Druxcar.com** is a comprehensive, nationwide online car rental ecosystem designed for Kosovo. The platform serves as a unified marketplace connecting customers with a diverse fleet of rental vehicles from participating rental companies. 

Recognizing the vast scope, **Druxcar is not a single application, but a suite of distinct interconnected applications** sharing a core data foundation.

The platform supports two distinct partnership models for rental agencies:
1. **Full-Service:** Druxcar handles the entire rental lifecycle (booking, payment, pickup, delivery, inspections).
2. **Subscription:** Rental companies pay a subscription fee to list their vehicles but manage their own rental operations and fulfillments.

## 2. Multi-Application Architecture
The ecosystem is sectioned cleanly into the following application modules:

### App 1: Customer Marketplace (B2C Web & Mobile App)
* **Goal:** A frictionless ecommerce experience for booking vehicles.
* **Features:** Advanced map-based search, rich vehicle discovery UI, multi-step booking engine, driver contracting, payment processing, loyalty point tracking, and support ticketing.

### App 2: Rental Company Workspace (B2B Portal)
* **Goal:** A SaaS operating system for car rental agencies.
* **Features:** Fleet management, availability blocking, booking approval/tracking, dynamic pricing, maintenance logging, damage reports, and subscription management.

### App 3: Advertiser Studio (Marketing Portal)
* **Goal:** A self-serve ad network for 3rd party partners.
* **Features:** UI to design/upload visual ads, demographic targeting, coupon generation, campaign analytics (CTR, impressions), and ad-subscription billing.

### App 4: Driver / Agent App (Mobile-first Utility App)
* **Goal:** An operational tool for chauffeurs and field agents.
* **Features:** Availability scheduling (calendar), ride acceptance/rejection, pre/post rental inspection checklists, breakdown reporting, and earnings tracking.

### App 5: Admin Control Center (Internal Operations)
* **Goal:** The master orchestrator for Druxcar staff.
* **Features:** Global dispute resolution, financial auditing (revenue splits, payouts), CMS for marketing pages, customer support center, global vehicle categorization overrides, and systemic health monitoring.

## 3. Technology Stack & Modern Tooling
The system adopts a modern, modular architecture:

* **Frontend:** Next.js (React) for CSR/SSR across the portals, managed via a Monorepo (e.g., Nx or Turborepo) sharing UI components.
* **Backend API:** Node.js backend structured using Domain-Driven Design (Clean Architecture). 
* **Database & ORM:** PostgreSQL/MySQL managed via **Prisma ORM**. Prisma will ensure type-safe database access and automatically manage the complex linking tables and relationships.
* **Caching & Queues:** Redis for caching and BullMQ for distributed task queues (emails, report generation).
* **3rd Party Integrations:** Stripe/PayPal (Payments), Twilio/SendGrid (SMS/Email).

## 4. Core Domain Models (Prisma Entities)
The overly normalized 96 tables have been conceptually optimized into bounded contexts:

* **IAM Domain:** `User`, `Role`, `Permission`, `Session`
* **Catalog Domain:** `Vehicle`, `VehicleMake`, `VehicleModel`, `Feature`
* **Rental Domain:** `Booking`, `BookingAddon`, `PricingRule`
* **Finance Domain:** `Transaction`, `Payout`, `Invoice`
* **Corporate Domain:** `Agency`, `Employee`, `Branch`
* **Operations Domain:** `MaintenanceLog`, `Inspection`, `DamageReport`
* **Advertising Domain:** `Advertiser`, `Campaign`, `Coupon`

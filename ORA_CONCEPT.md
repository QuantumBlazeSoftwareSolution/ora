# Ora - Project Master Plan

## 0. Origin & User Vision
**The Gap:** Sri Lanka has a huge crowd of small business owners (Gift box businesses, Artwork, Salons, Appointment scheduling) who don't know how to navigate the online market, resulting in a lost customer base.
**The Solution:** A SaaS web application designed specifically to fill this gap, enabling these businesses to easily go online without technical knowledge.

## 1. Executive Summary
**Vision:** Democratize digital commerce for Sri Lankan Micro, Small, and Medium Enterprises (MSMEs).
**Mission:** Empower non-technical business owners (Gift shops, Salons, Artists) to go online in under 10 minutes.
**Core Value:** A professional "Link-in-bio" store + Service Booking engine that bridges the gap between a website and WhatsApp conversational commerce.

## 2. Core Features

### A. Storefront (Products)
- **Public Page**: `ora.lk/[store_name]`
- **Product Catalog**: Images, Price, Description.
- **Shopping Cart**: Floating cart for mobile-first experience.
- **WhatsApp Checkout**: Instead of a complex payment gateway, the cart generates a pre-formatted WhatsApp message sent directly to the merchant.
    - *Message Format*: "Hello [Store], I want to buy: Item A (x2), Item B. Total: LKR 5000."

### B. Service & Booking Engine (Services)
- **Target Audience**: Salons, Consultants, Tutors.
- **Service Menu**: List services with Duration and Price.
- **Booking Flow**: Customers select services -> "Request Booking" via WhatsApp (MVP) or dedicated Calendar logic (Phase 2).

### C. Admin Dashboard
- **Analytics**: View Total Revenue, Active Products, Service Counts.
- **Management**: CRUD operations for Products and Services.
- **Settings**: Manage Store Name, Logo, WhatsApp Number.

## 3. Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4) + Shadcn/UI
- **Icons**: Lucide React

### Backend & Database
- **Database**: NeonDB (Serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Firebase Auth (Google + Email/Password)
- **File Storage**: Firebase Storage (Product Images)

### Infrastructure
- **Hosting**: Docker container on VPS.
- **Environment**: `.env.local` for secrets.

## 4. Data Architecture (Schema)

### Users (`users`)
- `id`: Firebase UID (PK)
- `email`: Merchant email
- `name`: Merchant name

### Stores (`stores`)
- `id`: Serial PK
- `userId`: FK to Users
- `slug`: Unique URL identifier (e.g., `my-shop`)
- `name`: Display Name
- `phoneNumber`: WhatsApp Number (Critical for checkout)
- `logoUrl`: Branding

### Products (`products`)
- `storeId`: FK to Stores
- `name`, `price`, `description`
- `imageUrl`: Firebase Storage URL
- `isVisible`: Toggle for catalog

### Services (`services`)
- `storeId`: FK to Stores
- `name`, `price`, `durationMin`
- `description`

### Bookings (`bookings`) / Orders (`orders`)
- *Note*: In the MVP, orders are handled via WhatsApp. The DB tables exist for future "On-Platform" tracking and analytics mastery.

## 5. Key Workflows

### Onboarding
1.  User signs up (Firebase).
2.  Server Action (`createStoreFromOnboarding`) runs.
3.  Checks if User exists in Postgres -> Creates if not.
4.   Creates a new Store entry with a unique Slug.

### Checkout Flow
1.  Customer visits `ora.lk/cool-gifts`.
2.  Adds "Red Mug" to Cart.
3.  Clicks "Checkout on WhatsApp".
4.  System opens `wa.me/9477...` with the order details pre-filled.

## 6. Future Roadmap
- **Custom Domains**: Allow `myshop.com` mapping.
- **SMS Integration**: Automated booking reminders.
- **Local Payment Gateways**: PayHere / WebXPay integration for direct payments.
- **Inventory Tracking**: Deduct stock automatically.

## 7. Development Guidelines
- **Zero Cost Phase**: Everything runs on free tiers (Neon Free, Firebase Spark, Vercel/VPS).
- **Mobile First**: All UI designs must be verified on mobile width first.
- **Simplicity**: If a feature takes more than 3 clicks, it's too complex for this market.

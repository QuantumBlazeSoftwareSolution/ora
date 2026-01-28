# Ora - Project Master Plan

## 0. Origin & User Vision

**The Gap:** Sri Lanka has a huge crowd of small business owners (Gift box businesses, Artwork, Salons, Appointment scheduling, Event Halls) who don't know how to navigate the online market. Generic e-commerce sites don't fit a Salon or a Hall Booking.
**The Solution:** A **Business Presence Platform** (not just a shop) designed to adapt to the business type, enabling these businesses to easily go online in under 10 minutes.

## 1. Executive Summary

**Vision:** Democratize digital commerce for Sri Lankan Micro, Small, and Medium Enterprises (MSMEs).
**Mission:** Empower non-technical business owners to go online with an interface that matches their business model (Retail vs Service vs Booking).
**Core Value:** A professional "Link-in-bio" store + Service Booking engine that bridges the gap between a website and WhatsApp conversational commerce.

## 2. Core Features (The "Tri-Type" Engine)

We categorize businesses into three distinct types to offer the perfect UI:

### A. Retail Engine (Products)

- **For**: Gift shops, Clothing, Electronics.
- **Key Entity**: `Product` (Physical Good).
- **Flow**: Browse -> Add to Cart -> WhatsApp Checkout / Payment.
- **UI Vibe**: Visual Grid, Collections, "Shop" feel.

### B. Service Engine (Appointments)

- **For**: Salons, Tutors, Consultants, Spas.
- **Key Entity**: `Appointment` (Time Service).
- **Flow**: View Portfolio -> Select Service -> Pick Time Slot -> Confirm.
- **UI Vibe**: Clean, Trust-driven, Calendar-focused.

### C. Booking Engine (Assets/Events)

- **For**: Wedding Halls, Hotels, Equipment Rentals, Ticketed Events.
- **Key Entity**: `Booking` (Space/Resource).
- **Flow**: Check Availability -> Select Dates/Seats -> Reserve.
- **UI Vibe**: Date-picker, Capacity management, "Reservation" feel.

### D. Admin Dashboard ("The Command Center")

- **Unified View**: Regardless of type, the admin sees "Orders", "Appointments", or "Bookings" in a unified inbox.
- **Analytics**: Tracks Revenue (Retail), Occupancy (Bookings), and Utilization (Services).
- **Store Settings**:
  - **Biz Type Toggle**: Merchant selects "Retail", "Service", or "Hybrid". The UI adapts automatically.

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
- `role`: merchant | admin

### Stores (`stores`)

- `userId`: FK to Users
- `slug`: Unique URL identifier
- `name`: Display Name
- `storeType`: 'retail' | 'service' | 'booking' | 'hybrid' (New Field)

### Products (`products`)

- `storeId`: FK to Stores
- `name`, `price`, `description`, `imageUrl`

### Services (`services`)

- `storeId`: FK to Stores
- `name`, `price`, `durationMin`

### Appointments (`appointments`)

- `storeId`, `serviceId`, `customerId`, `startTime`, `endTime`, `status`

### Bookings (`bookings`)

- `storeId`, `resourceId`, `customerId`, `startDate`, `endDate`, `status`

## 5. Key Workflows

### Explore Page (The Discovery Engine)

- **Goal**: Addictive discovery without clutter.
- **Strategy**: Distinct "Channels" for Shopping vs Booking. Use "Vibes" (Top-level categories) to guide intent.
- **Components**:
  - **Spotlight**: High-quality featured item/service.
  - **Discovery Header**: Dynamic shuffle of 5 categories to encourage clicking.
  - **Smart Grid**: Bento-style layout for visual engagement.

## 6. Future Roadmap

- **Custom Domains**: Allow `myshop.com` mapping.
- **SMS Integration**: Automated booking reminders.
- **Local Payment Gateways**: PayHere / WebXPay integration.
- **Inventory Tracking**: Deduct stock automatically.

## 7. Development Guidelines

- **Zero Cost Phase**: Everything runs on free tiers.
- **Mobile First**: All UI designs must be verified on mobile width first.
- **Differentiation**: Always ask "Is this a Product flow or a Service flow?" before coding. Don't force one into the other.

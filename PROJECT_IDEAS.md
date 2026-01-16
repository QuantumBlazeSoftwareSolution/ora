# Ora - Project Ideas & Concepts

## Core Philosophy

- **Customer First**: The main entry point (`/`) is a **Marketplace** for shoppers to discover local businesses, not a SaaS sales page.
- **Vibe Check**: The design must be "Vibrant", "Friendly", and "Premium". avoid the "Bureaucratic/Corporate" feel of traditional business registration sites.
- **Target Audience**: Creative MSMEs (Gift shops, Salons, Artists, Home Bakers).

## Key Features

- **WhatsApp Checkout**: The primary commerce engine. Minimal friction for buyers.
- **Link-in-Bio**: The store serves as a professional portfolio/storefront.
- **10-Minute Onboarding**: "Go online in 10 minutes."

## Administrative Flows

- **Application Queue**:
  - Prospective merchants submit an **Application** (Details + verification docs).
  - No user account is created yet.
  - Pending applications sit in `business_applications` table.
- **The "Ora Owners" Panel (`/ora-owners`)**:
  - Super Admin dashboard.
  - Review applications -> One-click "Approve & Mint Account".
- **Account Minting**:
  - When approved, the system generates the `User` and `Store` records.
  - Initial login credentials are generated/sent.

## Dashboard Experience

- **"Cockpit" Feel**: The dashboard should feel like a high-end tool. Dark mode default, crisp typography, data density without clutter.
- **Unified Control**: Products, Services, and Settings all accessible from one sidebar.
- **Live Preview**: When editing the store profile, offer a button to "View Live Store".

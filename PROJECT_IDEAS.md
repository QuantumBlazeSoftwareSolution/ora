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

- **Staged Registration**: Business signup follows a 4-step wizard:
  1.  **Personal Info**: User account creation.
  2.  **Business Info**: Store details.
  3.  **Verification**: Document upload (NIC/BR).
  4.  **Subscription**: Select a plan (Dynamic from DB).
- **Admin Approval**: "Human in the loop" system. Stores are `pending` until approved.
- **Dynamic Pricing**: Subscriptions are managed via the database (`subscriptions` table), allowing for flexible pricing updates without code changes.

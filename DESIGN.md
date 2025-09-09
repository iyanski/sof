# DESIGN.md — Shipments & Offer Explorer

## Overview

This document defines the design system, layout rules, and component guidelines for the **Shipments & Offer Explorer** app. It will be used to guide UI implementation in Cursor or similar AI-assisted coding environments.

---

## Brand & Visual Identity

* **Tone:** Professional, clean, trustworthy.
* **Primary Colors:**

  * Primary (CTA): `#2563EB` (blue-600)
  * Secondary: `#10B981` (green-500)
  * Background: `#F9FAFB` (gray-50)
  * Text: `#111827` (gray-900)
* **Typography:**

  * Font family: System fonts (Inter / sans-serif)
  * Headings: Bold, larger size
  * Body: Regular weight, base size 16px

---

## Layout & Spacing

* **Grid:** Mobile-first, 1-column; desktop 2-column where needed.
* **Card Components:** Rounded corners (`8px`), subtle shadow.
* **Spacing Scale:** 8px base → multiples of 8 (`8, 16, 24, 32`).
* **Touch Targets:** Min height `44px`.

---

## Pages

### 1. Landing Page (Home)

* **Header:**

  * Title: *Shipments & Offer Explorer*
  * Subtitle: *“Compare carriers. Find the best value. Ship smarter.”*
* **Hero Section:**

  * Icon/illustration of package/truck
  * CTA → scrolls to New Shipment form
* **Form Card:**

  * Fields: Origin, Destination, Weight, Dimensions, Quantity
  * Advanced accordion: Speed vs Cost slider, Max transit days
  * Actions: Primary \[Get Offers], Secondary \[Reset]
* **States:** Empty, valid, error (inline), loading (spinner + disabled form)

### 2. Offers Page (/offers)

* **Header bar:** Shipment summary + Edit link
* **Toolbar:**

  * Sort (Rank | Price | ETA)
  * Filters (price, transit days, carrier)
  * Toggle: Show ineligible offers
  * Scoring weights slider (Speed vs Cost)
* **Offer Cards:**

  * Carrier logo + name
  * Price, Delivery time
  * Score pill (0–100) with tooltip
  * Badges: Best Value, Fastest, Cheapest
  * Actions: \[Details], \[Select]
* **States:** Loading (skeleton cards), Empty (friendly illustration), Error (banner)

### 3. Offer Details (Drawer/Modal)

* **Tabs:** Overview | Eligibility | Scoring
* **Overview:** Price, ETA, service terms
* **Eligibility:** Checklist with ✓ or ✕ per rule
* **Scoring:** Breakdown (Cost, Time, Penalties → Total)
* **Actions:** \[Select Offer], \[Close]

### 4. Confirmation (/confirmation)

* Success icon + “Offer Selected”
* Shipment + Offer summary
* Actions: \[Start New Shipment], \[Export JSON], \[Copy link]

---

## Components

* **ShipmentForm**: Controlled form with validation, inline errors, advanced accordion.
* **OfferCard**: Carrier info, pricing, delivery, score, badges.
* **OfferDetailsDrawer**: Tabbed breakdown (overview, eligibility, scoring).
* **Toolbar**: Sort, filter, toggle, scoring slider.
* **Shared:** Badge, Pill, InlineAlert, SkeletonCard.

---

## States & Feedback

* **Validation:** Inline (e.g., “Weight must be greater than 0”).
* **API Error:** Banner (“We couldn’t fetch offers right now. Try again.”).
* **Empty Results:** Friendly text + CTA to adjust filters.
* **Loading:** Skeleton placeholders for cards.

---

## Accessibility

* Labels on all inputs
* `aria-describedby` for unit hints
* Keyboard navigation + focus rings
* Live regions for async messages (“Loading offers…”)
* Respect “reduce motion” preference for transitions

---

## Responsive Rules

* Mobile: Single-column forms & stacked offer cards
* Tablet/Desktop: Two-column layouts; toolbar inline
* Filters collapse to dropdowns/chips on small screens

---

## Example Wireframe (Landing Form)

```
-----------------------------------------------------
| Shipments & Offer Explorer                        |
-----------------------------------------------------
|  📦  Compare carriers. Find the best value.       |
|      Ship smarter.                               |
|                                                   |
|  [ Enter shipment details to get offers ]         |
-----------------------------------------------------

 [ New Shipment ]
+---------------------------------------------------+
| Origin Country:   [ NO ▼ ]                        |
| Destination:      [ SE ▼ ]                        |
| Weight:           [  90 ] [kg ▼]                  |
| Dimensions:       [ 10 ] × [ 10 ] × [ 15 ] [cm ▼] |
| Quantity:         [  1 ]                          |
|                                                     |
| Advanced ▼                                         |
|  - Speed vs Cost slider                           |
|  - Max transit days [   ]                         |
|                                                     |
| Actions: [ Get Offers ]   [ Reset ]                |
+---------------------------------------------------+
```

---

## Implementation Notes

* Use **React + TypeScript** with **RSuite**.
* State management: React Query.
* Mock API: `/offers` endpoint returning sample data.
* LocalStorage: Save last shipment for prefilled form.
* Query Params: `/offers?shipmentId=…` for deep linking.

---

This DESIGN.md should be used as a reference prompt to keep design consistent when generating components or pages with Cursor.

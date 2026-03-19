# Delivery Challan Dispatch System

![Google Apps Script](https://img.shields.io/badge/Platform-Google%20Apps%20Script-4285F4)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-Internal-blue)
![Architecture](https://img.shields.io/badge/Architecture-Transactional%20Dispatch-critical)
![UI](https://img.shields.io/badge/UI-Industrial%20Minimal-lightgrey)

---

## Overview

The **Delivery Challan Dispatch System** is a production-grade operational web application designed for real factory dispatch environments where ERP dispatch modules are unavailable or restricted or temprarily down.

This system enables continuous dispatch operations through:

- Atomic Delivery Challan (DC) number allocation
- Real-time log persistence
- Exact-format industrial PDF generation
- Google Drive document storage
- Lifecycle tracking (Open → Closed)
- Multi-operator concurrency safety
- Full Audit proof history
- Drive Commits

This is not a demo tool or learning project.  
It is designed as a **mission-critical industrial workaround system**.

---

## Business Context

Factories often face operational risk when ERP systems become unavailable due to:

- Licensing issues
- Payment lockouts
- Maintenance downtime
- Integration delays

Dispatch operations cannot stop.

This system ensures **operational continuity at dispatch dock level** with minimal infrastructure dependency.

---

## Core Features

### Transaction-Safe DC Allocation

- Continuous DC numbering (never resets)
- Atomic counter using Google LockService
- No duplicate DC generation possible
- Crash-safe log commitment

### Industrial PDF Generation

- Pixel-accurate A4 challan layout
- Multi-copy print format
- Exact dispatch document replica
- Automatic Drive archival

### Lifecycle Tracking

- DC status tracking: Open → Closed
- Invoice reconciliation support
- Dispatch aging visibility foundation
- Future ERP sync ready

### Multi-Operator Safe

- Concurrent dispatch supported
- Network instability tolerant
- Double-click safe
- Browser crash tolerant
- Multilevel validation (Idiot Proof)

### Operational Auditability

- Machine tracking
- Timestamp logging
- Immutable dispatch record
- Post-commit document model

---

## Technology Stack

- Google Apps Script (Server Logic)
- Google Sheets (Transactional Data Store)
- Google Drive (Document Storage)
- HTML / CSS / Vanilla JS (Frontend)
- LockService (Concurrency Control)

---

## System Architecture

### Dispatch Flow

1. Operator fills dispatch form
2. System locks counter
3. DC number allocated
4. Dispatch log committed atomically
5. Lock released
6. PDF generated
7. PDF stored in Drive
8. Link updated in log
9. Status entry created (OPEN)

### Closure Flow

1. Supervisor opens closure console
2. Selects pending DC
3. Reviews dispatch summary
4. Enters invoice reference
5. DC marked CLOSED

---

## Data Model

### SYSTEM_LOG_YYYY

Immutable dispatch transaction record.

### DC_STATUS

Operational lifecycle state table.

### MASTER_PART

Active part master with validation control.

### MASTER_CUSTOMER

Customer dispatch enablement control.

### CONFIG

Global DC counter (protected).

---

## Operational Characteristics

| Parameter | Value |
|--------|--------|
Dispatch Volume | ~150–250 DC/day |
Concurrency | 4–5 Operators |
Network Dependency | Low |
ERP Dependency | None |
Audit Risk | Controlled |
Infrastructure Cost | Minimal |

---

## Design Philosophy

- Reliability over elegance
- Transaction safety over performance
- Industrial usability over UI aesthetics
- Operational continuity over feature richness
- Human-error tolerance over strict workflow

---

## Known Constraints

- Google Apps Script execution quotas apply
- Spreadsheet performance degrades at very large scale
- No role-based authentication (by design)
- Lifecycle analytics layer not yet implemented
- ERP integration not currently active

---

## Future Roadmap

- Outstanding DC dashboard
- Aging analytics
- Retry engine for PDF failures
- Indexed lookup optimization
- ERP sync adapter layer
- Migration to dedicated database backend
- Operator authentication model
- Dispatch stock validation

---

## Deployment Model

Deployed as Google Apps Script Web App:

- Accessible via internal network browser
- No installation required
- Zero client maintenance
- Instant updates via script versioning

---

## Intended Usage

This system is intended for:

- Factory dispatch operations
- Logistics control environments
- Temporary ERP fallback scenarios
- Industrial process continuity planning

It is not intended as:

- Public SaaS product
- Consumer web application
- General document generator

---

## Contribution Policy

This repository represents an operational industrial system.

Changes must prioritize:

- Dispatch continuity
- Audit safety
- Transaction correctness
- Failure resilience

---

## License

Internal operational software.  
Not intended for public redistribution.

---

## Author

By Yash Aparajit

---

# RED Digital Therapy Platform – Development Blueprint (Medium Condensed)

## Introduction

RED: Digital therapy platform for Spanish speakers.  Goal: User-friendly, automated, ethical online therapy.  This blueprint guides development based on competitive analysis and RED's specs.

## Key Development Points (Competitive Insights)

*   **Onboarding:** Smooth, guided client & therapist onboarding crucial. Empathy, clear steps, minimal friction. **Key: Free initial mini-session.**
*   **Matching:** Evolve from semi-automated (MVP) to fully automatic (Phase 3).  Prioritize: Specialties, Availability, Therapist Responsiveness, Client Preferences.  Future: AI-driven matching.
*   **Design:** Calming, clean, accessible UI. Responsive design (mobile-first). WCAG accessibility (Phase 3).
*   **Payments & Sessions:** Stripe for secure payments & therapist payouts.  MVP: Calendly scheduling. In-app scheduling later. Clear cancellation policy. Scholarship support.
*   **Community (Phase 2+):** Client forums/groups, Therapist intervision/supervision, events. Differentiator for RED.
*   **Automation:** Extensive automation for notifications, matching, waitlist. Future: AI session summaries, content moderation.

## Development Blueprint

### 1. Technology Stack

*   **Frontend:** React.js (responsive web, potential React Native). Component library (MUI/Chakra UI). State: Context API/Redux Toolkit.  Consider Next.js (SSR).
*   **Backend:** Node.js + Express (REST API, scalable). Monolithic initial, microservices future.
*   **Database:** PostgreSQL (relational, reliable). ORM: Prisma/Sequelize.
*   **Hosting:** Scalable cloud (AWS/Google Cloud). Docker, CI/CD.

**Key Libraries:**

*   **Auth:** JWT, Passport.js/NextAuth, bcrypt/Argon2
*   **Real-time:** Firebase/WebSockets/Twilio Chat (evaluate options)
*   **Forms:** Formik/React Hook Form
*   **Payments:** Stripe SDK (Elements, Connect)
*   **Email:** SendGrid/AWS SES
*   **Video:** Calendly/Zoom (MVP), Twilio Video/Daily.co (future)
*   **Utilities:** (Refer to detailed list in previous versions - common JS utilities)

### 2. Database Schema (Core Tables & Key Fields)

*   **Users:** `user_id (PK)`, `name`, `email`, `password_hash`, `role`
*   **Therapists Profile:** `therapist_id (PK, FK)`, `license_number`, `verified`, `specialties`, `languages`, `availability`, `max_clients`, `status`
*   **Clients Profile:** `client_id (PK, FK)`, `preferred_language`, `preferred_therapist_gender`, `concern_tags`
*   **Therapy_Assignment:** `assignment_id (PK)`, `client_id (FK)`, `therapist_id (FK)`, `assigned_on`, `is_active`
*   **Sessions:** `session_id (PK)`, `client_id (FK)`, `therapist_id (FK)`, `start_datetime`, `end_datetime`, `status`, `is_intro`, `video_link`
*   **Payments:** `payment_id (PK)`, `client_id (FK)`, `therapist_id (FK)`, `session_id (FK, nullable)`, `amount`, `stripe_charge_id`, `status`
*   **(Other Tables: Packages, Waitlist, Messages, Forum, Scholarship -  basic structure as previously described)**

**Indices:** `Therapists (status, specialties)`, `Sessions (therapist_id, start_datetime)`, `Messages (conversation_id, timestamp)`.

### 3. Matching Algorithm (Phased Approach)

*   **Phase 1 (MVP): Manual Admin Matching.** Admin filters therapists by specialty, language, availability, assigns client.
*   **Phase 2: Automatic Broadcast Matching.**
    1.  Trigger: New client/therapist change.
    2.  Filter therapists (specialties, language, availability, capacity).
    3.  Notify eligible therapists ("New client - accept?").
    4.  First accept wins.
    5.  Client schedules session.
    6.  Waitlist for no match.
*   **Phase 3+ (Future): AI-Driven Matching.** Fit score algorithm (ML). Factors: therapist success, responsiveness, feedback.

### 4. Key Integrations

*   **Stripe:** Payments, therapist payouts (Connect). Stripe Elements (frontend). Webhooks (payment updates).
*   **Calendly (MVP):** Session scheduling, Zoom link generation.  Future: In-app calendar (Google Calendar API/Cronofy).
*   **Twilio (Communications):** SMS/WhatsApp reminders. Optional: Chat, Video.
*   **Firebase (Alternative Comms):** Push notifications (FCM), Realtime DB/Firestore (chat).
*   **Email:** SendGrid/AWS SES (system emails).

### 5. UX Principles

*   **Frictionless Onboarding:** Simple, empathetic, guided.
*   **Calm & Clear Design:** Soothing colors, clean UI, responsive.
*   **Guided Journey:** Progress, clear CTAs.
*   **Trust & Safety:** Therapist profiles, privacy features, emergency resources.
*   **Therapist-Friendly:** Easy tools, support access.
*   **Safe Community (Phase 2+):** Moderated, guidelines.

### 6. Libraries & Components

**(Refer to the detailed list in previous versions - essential for developers, keep externally if needed for context length)**

### 7. Security & Compliance (Key Points)

*   **GDPR:** Consent, access/erasure, minimization, encryption, EU servers, compliant vendors.
*   **Security:** Strong auth, JWT, input sanitization, access control, audit logs, testing.
*   **Secure Comms:** HTTPS, encrypted video.
*   **Legal/Ethical:** Policies, therapist verification, misuse prevention.
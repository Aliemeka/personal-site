---
layout: ../../layouts/Project.astro
title: "Dome Academy"
description: "A community-focused educational platform for developers, offering hands-on project-based learning and professional development resources."
image:
  url: "https://res.cloudinary.com/emekadinary/image/upload/q_60/v1772074710/Projects%20Screenshot/dome-new_fyoluz.webp"
  alt: "Dome Academy Screenshot"
pubDate: "2023-06-04"
author: "Emeka Allison"
tags: ["Next.js", "Supabase", "FastAPI", "PostgreSQL", "AWS"]
---

# Dome Academy

Dome Academy is a community-driven learning platform offering tech courses, live sessions, and structured cohorts — built to close the gap between theory and real-world practice. Learners don't just watch videos; they build projects, collaborate with peers, and leave with a portfolio that reflects genuine skills.

## The Problem

Most online learning platforms are passive. You watch, maybe take a quiz, and move on. There's little accountability, no real community, and nothing to show at the end of it. Developers need a space where learning is structured, social, and outcome-driven.

## Core Features

### Courses

Courses on Dome Academy are project-based by design. Each course is broken into modules with practical exercises that mirror real-world scenarios. Learners complete assignments, get feedback, and ship something tangible by the end — not just a certificate.

### Cohorts

Cohorts are time-boxed learning groups where a set of learners go through a course together. This structure creates accountability: everyone is on the same schedule, working through the same material, and supporting each other in the process. Instructors can monitor cohort progress, intervene early when learners fall behind, and run cohort-specific announcements or check-ins.

### Live Sessions

Live sessions let instructors host real-time classes, Q&As, and workshops directly on the platform. Learners can join scheduled sessions, ask questions, and engage with the material in a way that recorded video simply can't replicate. Sessions are tied to courses or cohorts, so the context is always relevant to what learners are currently studying.

## Authentication — OTP with Supabase

For authentication, I went with a passwordless OTP flow using Supabase Auth. When a user signs up or logs in, they enter their email and receive a one-time code. No passwords to manage, no forgotten credentials, no OAuth dependency on third-party providers.

Supabase makes this straightforward — it handles OTP generation, email delivery, and session management out of the box. On the frontend, the flow is just two steps: enter your email, enter the code. The session token returned by Supabase is then used across the app for all protected routes and API calls.

The passwordless approach also reduced friction significantly during onboarding, which matters a lot for a platform trying to get learners to actually show up and start.

## Why FastAPI

The backend is built with FastAPI, and the choice came down to a few things. First, Python was already the right language for the data-heavy parts of the platform — progress tracking, analytics, scheduling logic. FastAPI gave me automatic request validation via Pydantic, async support out of the box, and auto-generated API docs that made it easy to iterate quickly.

Compared to Django REST Framework, FastAPI felt leaner for what I needed. I wasn't building a CMS — I needed a high-performance API layer, and FastAPI's async model handles concurrent requests well without the overhead of a heavier framework.

## Challenges

### Rate Limiting

One of the earlier pain points was rate limiting on the OTP endpoint. Without it, the email delivery system was exposed to abuse — someone could hammer the endpoint and rack up costs fast. I implemented rate limiting at the API layer using a sliding window approach, tracking requests per IP and per email address. The tricky part was making the limits strict enough to prevent abuse without being so aggressive that legitimate users (who sometimes double-click or retry) got locked out.

### Scheduling Email Reminders

Getting email reminders right was harder than expected. Learners need nudges — session reminders, cohort deadlines, inactivity alerts — but the timing has to feel helpful, not spammy. I used **Celery** with **Redis** as the message broker to handle this. Reminder tasks get queued and executed asynchronously, so the API never blocks waiting on email delivery.

The challenge was handling timezones correctly across a global user base and making sure reminders weren't sent to learners who had already completed the relevant action. Celery's scheduled tasks (beat) made it straightforward to run periodic checks against upcoming sessions and cohort milestones, but a few edge cases around cohort start/end boundaries — and avoiding duplicate sends when tasks retried — took longer than I'd like to admit to get right.

## Technologies Used

- **Next.js** — Frontend with server-side rendering for fast, SEO-friendly course pages
- **Supabase** — Passwordless OTP authentication, real-time subscriptions, and database access
- **FastAPI** — High-performance async API layer with automatic validation and docs
- **PostgreSQL** — Relational database for courses, cohorts, users, and progress tracking
- **AWS** — Cloud infrastructure, storage, and deployment

## Areas We Cover

- Software engineering
- Graphic design
- Product design
- Data Science
- 3D Animation
- Technical Writing
- Cloud
- Game development
- Augmented reality
- Blockchain
- Internet of things
- Sustainable tech

## What's Coming

### Forum Communities

The next major feature is community forums — threaded discussion spaces tied to courses and cohorts. Learners will be able to ask questions, share solutions, and help each other outside of live sessions. The goal is to make Dome Academy a place people come back to, not just when they have a scheduled class.

### Live Portfolio Tracking

Every project a learner completes will feed into a live portfolio — a public profile that tracks their skills, completed courses, and shipped work over time. Instead of a static resume, learners will have a living record of what they've actually built. This also gives employers a more meaningful signal than a certificate.

## Visit Dome Academy

You can check out Dome Academy at [thedomeacademy.com](https://thedomeacademy.com).

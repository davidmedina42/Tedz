# Insight Snaps

Product Requirements Document (PRD): Scroll_Tedz

1. Executive Summary & Vision

Scroll_Tedz is a mobile-first Progressive Web App (PWA) designed to transform casual scrolling downtime into focused micro-learning. It replicates the frictionless vertical-snap interaction model of TikTok and Instagram Reels while exclusively delivering curated 30- to 50-second insight clips from TED Talks.

2. Problem Statement & Value Proposition

The Problem: Short-form video feeds optimize for addictive dopamine loops, leaving users feeling mentally drained and unproductive after long sessions.

The Solution: A curated feed providing high-signal, zero-fluff educational moments that can be consumed in under a minute or used as a launchpad to watch the full lecture.

3. Target User Personas & User Stories

Personas

The High-Intent Commuter: Uses transit time or short work breaks for intellectual stimulation rather than social media entertainment.

The Conceptual Explorer: Discovers new domains (behavioral psychology, systems design, leadership frameworks) without committing to full 20-minute presentations upfront.

User Stories

As a user, I want to open the web app from my mobile home screen without browser chrome so it feels native.

As a user, I want videos to automatically start at the key moment and loop seamlessly so I can grasp the core idea without manual seeking.

As a user, I want to read the key takeaway quote directly on the screen so I can process the concept even before audio registers.

As a user, I want a direct link to the full original talk at that exact timestamp if I want to dive deeper.

4. Scope & Feature Matrix

FeatureDescriptionPriorityVertical Snap FeedFull-screen vertical swipe feed with hardware-accelerated CSS scroll snap (100dvh).P0 (MVP)Precision Clip LooperYouTube IFrame integration auto-playing between startSeconds and endSeconds.P0 (MVP)Global Audio & Playback ControllerSingle audio context toggle (Mute/Unmute) persisting across swipes; Intersection Observer auto-play/pause.P0 (MVP)Takeaway & Speaker OverlayFloating glassmorphism badge displaying speaker, talk title, category, and core quote.P0 (MVP)PWA Standalone ManifestService worker and web manifest allowing full-screen installation on iOS and Android.P0 (MVP)Outbound Source LinkAction rail button linking directly to the full talk on YouTube at t=startSeconds.P1Category Quick FilterTop pills/tabs to switch feeds (e.g., Productivity, Psychology, Leadership).P1Local BookmarkingSave clip IDs to browser localStorage for offline review.P1AI Ingestion PipelineCLI script using YouTube transcripts + LLM to automatically generate clip timestamps.P2Supabase Cloud SyncUser authentication and multi-device saved clips.P2

5. UI/UX Specifications

Layout Grid (Single Slide)

Viewport Height: Strictly 100dvh to prevent mobile address bar jumping.

Top Header (Z-Index 20): Category chip (left), Global Audio toggle button (right).

Video Canvas (Z-Index 0): Centered YouTube IFrame, scaled (scale-[1.35] on mobile) to clip letterboxing and fill vertical space.

Action Rail (Right, Z-Index 20): Vertical stack with Bookmark, Share, and "Watch Full" icons.

Bottom Panel (Left/Bottom, Z-Index 20): Speaker name (bold), talk title, and frosted glass quote card.

Gestures & Physics

Vertical swipe transitions snap directly to the next slide boundary (snap-always, snap-start).

Scrolling out of active viewport immediately pauses current video buffer.

6. Technical Architecture & Constraints

src/
├── app/
│   ├── layout.tsx         # Mobile viewport meta tags, manifest registration
│   ├── page.tsx           # Snap feed container & IntersectionObserver
│   └── globals.css        # Scroll-snap & custom scrollbar reset
├── components/
│   ├── VideoSlide.tsx     # YouTube player instance & overlay HUD
│   ├── ActionRail.tsx     # Share, bookmark, source actions
│   └── CategoryPills.tsx  # Horizontal filter bar
├── hooks/
│   ├── useYouTubeLoop.ts  # Interval loop checker (start/end timestamp bounds)
│   └── useIntersection.ts # Viewport active-index tracking
├── lib/
│   └── utils.ts           # Time formatting & clipboard helpers
├── types/
│   └── clip.ts            # TypeScript interfaces
└── data/
    └── seedClips.ts       # Fallback mock dataset


Technical Constraints

Autoplay Policy: Mobile WebKit requires muted autoplay on first user touch. All slides initialize with mute=1; tapping unmute activates audio globally.

DOM Memory Management: Active slide pool must not exceed 3 mounted iframe instances simultaneously to maintain 60fps scrolling on lower-end devices.

7. Data Contract

TypeScript

export type Category = 
  | "Productivity"
  | "Psychology"
  | "Leadership"
  | "Technology"
  | "Science"
  | "Creativity";

export interface Clip {
  id: string;
  title: string;
  speaker: string;
  speakerTitle?: string;
  youtubeId: string;
  startSeconds: number;
  endSeconds: number;
  keyTakeaway: string;
  category: Category;
  tags?: string[];
  likesCount: number;
  savedCount: number;
}


8. Development Milestones & Checklist

[x] Milestone 1: Project Setup & Architecture

Git repository initialized and connected to GitHub.

src/ folder structure, TypeScript data model (clip.ts), and seed data created.

[ ] Milestone 2: Video Playback & Loop Hook (Next)

Build useYouTubeLoop.ts to control time intervals.

Build VideoSlide.tsx with iframe scaling and metadata HUD.

[ ] Milestone 3: Feed Assembly & Intersection Observer

Assemble page.tsx with CSS scroll-snap and sliding active index observer.

Implement global mute/unmute state machine.

[ ] Milestone 4: PWA Configuration & Mobile Testing

Configure service worker, icons, and manifest.json.

Verify full-screen standalone installation on physical iOS/Android device.

[ ] Milestone 5: Data Persistence & Filters

Implement category switching and localStorage bookmarking.

Build automated Python transcript scraper for scalable clip generation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b232155b-c61c-4551-b6e8-f9009d5ea8d7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

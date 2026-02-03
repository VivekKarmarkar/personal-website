# Learning Resources

A curated list of resources for understanding web development, hosting, and internet infrastructure — compiled during a deep-dive conversation on January 30, 2026.

---

## How to Use This Guide

You're in an unusual position: you've already *built* a sophisticated React/Vite/TypeScript website with interactive physics simulations, 3D graphics, and live code execution — but you're only now learning what HTML, CSS, and JavaScript actually are. That's like having already built a working engine before learning thermodynamics. The engine works. Now you want to understand *why* it works.

Your learning style (based on our conversation): you want to understand from first principles, you think in physics analogies, and you don't move on until something clicks. You're not a "follow the tutorial" person — you're a "but what is it *really*?" person. The recommendations below are ordered with that in mind.

### Recommended Learning Path

**Step 1: The Physical Layer (where your code actually lives)**
Start with the data center tours and internet fundamentals. You kept asking "but where is the hard drive?" and "who owns the building?" — these videos answer exactly that. Watch the Google data center tour first. It will ground everything else.

**Step 2: The Three Languages (what browsers actually understand)**
Watch the Fireship 100-second videos for HTML, CSS, and JavaScript — in that order. These are the three languages browsers speak. Everything else (React, TypeScript, Tailwind, JSX) is a convenience layer that Vite translates *back* into these three. You already know this conceptually; these videos will make it visual.

**Step 3: The Convenience Tools (what you've been writing in)**
Watch Fireship's React and Vite 100-second videos. Then watch one Web Dev Simplified video on React. You don't need a full React course — you've already built with it. You just need the "aha, so *that's* what I've been doing" moment.

**Step 4: Hosting and Deployment (your next actual task)**
Watch Fireship's "cloud computing in 100 seconds" and "serverless in 100 seconds." These map directly to what Vercel will do when you deploy. Skip the AWS deep-dives for now — you won't need your own server until Stage 5+ (thousands of users).

---

## How the Internet Actually Works

*Why this matters to you: When someone visits your site, their browser sends a request that bounces through routers, hits a Vercel CDN server, and downloads your compiled files. These videos show you what's happening in that chain.*

- **"How the Internet Works in 5 Minutes"** — Start here. Fastest possible overview. Gets the mental model in place before you go deeper.
  - https://youtu.be/7_LPdttKXPc
  - *Watch this one first. 5 minutes, done.*

- **Code.org "How the Internet Works" series** — Short, beautifully animated videos. Each one covers a concept: packets, routers, DNS, HTTP. Used in classrooms everywhere.
  - Search YouTube: `code.org how the internet works`
  - *These are the kind of videos you'd put on your own site. Good benchmark for educational quality.*

- **Crash Course Computer Science #29: "The Internet"** — Fast-paced but accessible overview of packets, routers, and hops.
  - https://youtu.be/AEaKrq3SpW8
  - *If you want more depth after Code.org but don't want Ben Eater's full deep-dive.*

- **Ben Eater's Internet series** — Meticulous, hands-on. Builds understanding from the physical layer up.
  - https://eater.net/inet
  - *This is the "HC Verma" of internet videos — rigorous, from first principles. Watch if you want to truly understand TCP/IP, not just know the words. Not urgent for deployment.*

- **freeCodeCamp's "How Does the Internet Work" course** — Covers everything from switches and routers to streaming and ISPs.
  - Available on freeCodeCamp's YouTube channel
  - *Comprehensive but long. Bookmark for later — you don't need all of this before deploying.*

---

## What's Inside a Data Center

*Why this matters to you: You kept asking "where is the hard drive?" and "who owns the building?" These videos answer that. GitHub's servers, Vercel's CDN nodes, Supabase's databases — they all live in places like these.*

- **Google Data Center Tour** — Joe Kava (VP of Google's Data Center Operations) walks through a Google facility. One of the most watched data center videos. The physical reality behind "the cloud."
  - Search YouTube: `google data center tour`
  - *Watch this one. It directly answers your question about what a "server" looks like in real life. Remember: a server is just a computer that waits for requests — this video shows thousands of them on racks.*

- **AWS Data Center Tours (Amazon Future Engineer)** — Amazon's own video tours of their data centers. See the racks, hard drives, cooling systems, security. Two tours: one on how the cloud works, one on keeping data safe.
  - https://www.amazonfutureengineer.com/datacenters
  - *AWS runs the infrastructure behind much of the internet (including parts of Vercel). This is where your site's files could physically end up.*

- **AWS "Cloud Computing Explained"** — Amazon's own overview of what cloud computing is.
  - https://aws.amazon.com/video/watch/d33fa5c7646/
  - *Optional. You already understand the concept from our conversation. Only watch if you want AWS's official framing.*

---

## HTML, CSS, JavaScript — The Three Foundational Web Languages

*Why this matters to you: Your browser understands exactly three languages. Everything you've been writing — JSX, TypeScript, Tailwind — gets translated by Vite into these three. You've been writing in "convenience languages" that compile down to the real thing, the same way Fortran compiles to machine code.*

- **Fireship (YouTube)** — His "100 seconds" series explains HTML, CSS, JavaScript, React, TypeScript, and Vite each in 100 seconds. The fastest possible format.
  - https://www.youtube.com/c/Fireship
  - Key videos to watch in order:
    1. "HTML in 100 seconds" — *the skeleton*
    2. "CSS in 100 seconds" — *the skin (what Tailwind compiles to)*
    3. "JavaScript in 100 seconds" — *the brain (what React, JSX, and TypeScript all compile to)*
    4. "React in 100 seconds" — *your main tool (like NumPy for JS)*
    5. "TypeScript in 100 seconds" — *what your EM Generator sim is written in*
    6. "Vite in 100 seconds" — *the translator that makes it all work*
  - *Fireship's style is dense and fast. You'll probably want to pause and rewind. That's normal — he packs a lot in. Total time: ~10 minutes for all six.*

- **Web Dev Simplified (Kyle Cook)** — Clear, concise explanations of web concepts. Good for understanding what React and Vite actually do.
  - https://www.youtube.com/c/WebDevSimplified
  - *After the Fireship speed-run, watch one of Kyle's "React in 10 minutes" or "What is Vite?" videos. He's slower and more thorough — good for the "but what is it really?" follow-up.*

- **Kevin Powell** — The CSS specialist. If you want to deeply understand styling.
  - https://www.youtube.com/kevinpowell
  - *You probably don't need this right now. Tailwind abstracts away most CSS. But if you ever want to understand what Tailwind is actually generating under the hood, Kevin is the person.*

- **Traversy Media (Brad Traversy)** — Practical, project-based learning. Over 2.1 million subscribers.
  - https://www.youtube.com/c/TraversyMedia
  - *Good for "build X from scratch" projects. Not your priority now — you've already built something more complex than most of his tutorials.*

- **The Net Ninja (Shaun Pelling)** — Step-by-step structured playlists. 1.3M subscribers, over 2,200 videos.
  - https://www.youtube.com/c/TheNetNinja
  - *Structured playlists for when you want to learn a specific tool end-to-end. Bookmark for later.*

---

## Cloud Computing, Servers, Hosting

*Why this matters to you: You're about to deploy. Vercel will take your git repo, run `npm run build`, and distribute the output to CDN servers worldwide. These videos explain the machinery behind that process.*

- **Fireship "cloud computing in 100 seconds"** and **"serverless in 100 seconds"** — Maps directly to the Vercel serverless functions concept.
  - Search YouTube: `fireship cloud computing 100 seconds`
  - Search YouTube: `fireship serverless 100 seconds`
  - *Watch both before deploying. "Serverless" is what you'll use for the LLM chatbot integration later — it's exactly the "gatekeeper" pattern we discussed (browser → Vercel serverless function → Anthropic API).*

- **AWS Official YouTube Channel** — Covers everything about AWS products across all experience levels.
  - https://www.youtube.com/c/amazonwebservices
  - *Skip for now. You won't need AWS until Stage 7 (own server). Bookmark it.*

- **IBM Cloud Computing YouTube** — "IBM Cloud Minute" series features industry insiders explaining cloud concepts succinctly.
  - *Same as above — bookmark, don't binge. You already understand the core concepts.*

---

## What You Can Skip (For Now)

You don't need to learn everything before deploying. Here's what you can safely ignore until later:

| Topic | Why you can skip it | When you'll need it |
|-------|--------------------|--------------------|
| Full CSS course | Tailwind handles it | If you ever ditch Tailwind |
| Full React course | You've already built 7 sims with it | If something breaks and you can't debug it |
| AWS / server management | Vercel handles it | Stage 5+ (thousands of users) |
| Database design | No database yet | Stage 4 (adding Supabase) |
| Networking deep-dives | Interesting but not blocking | Never, unless curiosity demands it |
| Ben Eater's full series | Rigorous but not urgent | When you want the "HC Verma" level understanding |

---

## Key Concepts Reference

A quick reference for the concepts discussed:

### The Three Foundational Web Languages
| Language | Role | Analogy |
|----------|------|---------|
| HTML | Skeleton — structure of the page | The frame of a house |
| CSS | Skin — appearance, colors, layout | Paint, furniture, decoration |
| JavaScript | Brain — interactivity, behavior | Electricity, plumbing, appliances |

### Convenience Tools (Built on Top)
| Tool | Built on | What it does |
|------|----------|-------------|
| React | JavaScript | Reusable UI components (like NumPy for Python) |
| JSX | JavaScript | HTML-like syntax inside JavaScript |
| TypeScript | JavaScript | Type enforcement (like Python type hints, but blocks you) |
| Tailwind | CSS | Shorthand utility classes (like NumPy for CSS) |
| Vite | All of the above | The translator — compiles everything to HTML, CSS, JS |

### The Deployment Chain
```
Your Laptop
    ↓ git push (internet)
GitHub (Microsoft's servers / hard drives)
    ↓ fetch source (internet)
Vercel Build Server (runs npm run build / Vite)
    ↓ copies dist/ folder
CDN Servers Worldwide (Mumbai, London, Virginia, etc.)
    ↓ internet
User's Browser (downloads files, runs everything locally)
```

### What Runs Where
| Component | Where it runs |
|-----------|---------------|
| Interactive sims, animations | User's browser (their CPU) |
| JSX → JS translation | Vercel build server (once, at deploy) |
| JAX code execution | MyBinder (temporary cloud server) |
| Video streaming | YouTube (Google's servers) |
| File serving | Vercel CDN |
| LLM chatbot (future) | Anthropic's GPUs, relayed via Vercel |
| Database (future) | Supabase or own AWS server |

### The Growth Stages
| Stage | What triggers it | Infrastructure |
|-------|-----------------|----------------|
| 1. Localhost | Development | Your laptop runs everything |
| 2. Static site | Want to share with the world | Vercel + CDN |
| 3. + Chatbot | Need server-side secrets | Add serverless function |
| 4. + Database | Need to remember users | Add Supabase |
| 5. Traffic surge | Thousands of concurrent users | Connection limits hit |
| 6. + Video | Large media content | YouTube embeds + AWS S3 |
| 7. Own server | Need full control | AWS server + database (same data center) |

*You are currently at Stage 1. Deploying to Vercel takes you to Stage 2. Everything else comes later — and only when you actually need it.*

### Key Vocabulary
- **Server** — Any computer that waits for requests and sends responses. Your laptop running Vite is a server.
- **Client** — Any computer that sends requests. Your browser is a client.
- **Static site** — Server just hands over files. No server-side computation.
- **CDN** — Content Delivery Network. Copies of your files on servers around the world. Users download from the nearest one.
- **S3** — Amazon's file storage. Upload files, get a URL. Like a hard drive in the cloud.
- **Serverless function** — A small piece of code that runs on Vercel/Netlify's servers only when called. Holds secrets (API keys, DB credentials).
- **npm** — Node Package Manager. Like pip for Python.
- **dist/ folder** — The compiled output of npm run build. Plain HTML, CSS, JS that browsers understand.
- **Cache** — Hidden storage in your browser. Files stay after you close a tab so the next visit loads faster.

---

*Compiled January 30, 2026*

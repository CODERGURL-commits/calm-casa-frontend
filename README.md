# calm-casa-frontend

Welcome to the frontend application for **CalmCasa** —a real-time, cozy digital sanctuary designed to help users ground their nervous systems, lay down heavy thoughts, and gather peacefully around a digital campfire. 

Built using **Next.js (App Router)** and stylized with modern, responsive utility lines via **Tailwind CSS**.

---

## Features Implemented
* **Interactive Gatherings:** Real-time visibility of online neighbors via the "Gathering Circle" synchronization tray.
* **The Campfire Chat:** A live websocket-enabled message room to share anonymous heavy thoughts.
* **The Encouragement Board:** A quiet sticky-note library space to leave or read uplifting cards.
* **The Worry Garden:** Plant burdens as digital sprouts and interactively water them to bloom into flowers.
* **Box Breathing Anchor:** A dynamic visual pacing guide to practice slow, rhythmic box breathing.
* **Procedural Avatars:** Custom automatic profile generations courtesy of DiceBear API seeds matching user nicknames.

---

## Core Dependencies

| Package | Purpose |
| :--- | :--- |
| `next` | React Framework for production web applications |
| `react` / `react-dom` | UI Rendering engine & state hooks |
| `socket.io-client` | Client-side WebSocket integration for real-time event polling |
| `@dicebear/core` | Core engine for procedural avatar string creation |
| `@dicebear/collection` | Vector asset collections for nickname avatar variations |
| `tailwindcss` | Utility-first CSS styling architecture |

---

##  Local Installation & Development

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Clone and Install Dependencies
Navigate into your frontend directory and install the necessary packages:
```bash
npm install

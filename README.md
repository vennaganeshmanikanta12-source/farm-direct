# farm-direct

AI-powered direct farm-to-consumer marketplace built for **HackWithAditya 2026** (AgriTech).

## Overview
`farm-direct` connects farmers directly with consumers to reduce middleman dependency, improve price transparency, and support smarter post-harvest decisions. This repository contains our initial prototype built for Level 1 screening, which we will expand during the 48-hour hackathon.

## Planned & Prototype Features
- **AI Dynamic Pricing Engine:** Suggests prices using demand, seasonal, and supply signals while enforcing a government Minimum Support Price (MSP) floor during low demand so farmers are protected from selling below baseline support.
- **Smart Shelf-Life & Delivery Routing:** Evaluates produce durability to prioritize short-shelf-life items for local markets and route longer-lasting produce to long-distance delivery.
- **Third-Party Logistics Integration:** Connects orders with external delivery partners for local and long-distance fulfillment.
- **Multilingual AI Voice Assistant:** Helps farmers with limited literacy list produce, check prices, and manage orders using voice in regional languages.

## Current Prototype Status
- **Included Files:** `index.html`, `login.html`, `farmer-dashboard.html`, `marketplace.html`, `ai.js`, `app.js`, `data.js`, and `style.css`
- **What Works Now:** Farmer and consumer interfaces, cart and order flow, Chart.js sales projections, and client-side heuristic modules in `ai.js` using sample data in `data.js`.
- **48-Hour Hackathon Roadmap:** Add explicit MSP price-floor enforcement, shelf-life and local/long-distance routing logic, speech/voice input support, and backend/API integrations.

## Running Locally
1. Clone or download the repository.
2. Open `index.html` in any modern web browser (no build step required for the current static prototype).

# 🌍 Quake

A web application that tracks and visualizes real-time earthquake activity around the world using live data from the USGS Earthquake API.

---

## What is this?

Quake is a browser-based disaster tracker that pulls live earthquake data and displays it on an interactive world map along with a card-based dashboard. You can filter, sort, and search through earthquakes happening right now — anywhere on the planet.

---

## Features

- **Interactive Map** — Live earthquake locations plotted on a world map using Leaflet.js. Circle size and color represent severity.
- **Earthquake Cards** — Each quake displayed with location, magnitude, depth, and timestamp.
- **Search** — Search earthquakes by country or region name.
- **Filter** — Filter by magnitude range and date range.
- **Sort** — Sort by strongest, most recent, or deepest.
- **Severity Color Coding** — Green (low) / Orange (moderate) / Red (high)
- **Stats Bar** — Total quakes loaded, strongest quake, average magnitude.

---

## Tech Stack
- HTML -> Structure 
- CSS -> Styling & Layout
- JavaScript -> Logic, Fetch, Array HOFs
- USGS Earthquake API -> Real-time earthquake data
- Leaflet.js -> Interactive map rendering 
- GitHub Pages -> Deployment 

---

## API Used

**USGS Earthquake Hazards Program API**
- Base URL: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson`
- Free to use — no API key required
- Returns real-time GeoJSON earthquake data

---

## Project Structure
```
Quake/
── index.html
── style.css
── script.js
── README.md
```

---

## Author

**Prince Dubey**
B.Tech CS (AI) — Rishihood University
GitHub: [@thisisprincedubey](https://github.com/thisisprincedubey)
# TrendPulse-AI: Real-Time Social Media Trend Detection & Semantic Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-3.8_Flash-8E75B5?logo=google)](https://ai.google.dev/)

**TrendPulse-AI** is an end-to-end, high-density semantic intelligence platform built to ingest, analyze, and visualize high-velocity social media discourse in real time. The application transforms unstructured streaming payloads into structured, actionable macro-trends using statistical anomaly detection, dimensional semantic clustering, and automated LLM executive synthesis.

---

## 📌 Features & Capabilities

### 1. High-Throughput Stream Telemetry
* **Multi-Source Data Ingestion:** Monitors streaming data across platforms including Reddit, Hacker News, ArXiv, X, and YouTube.
* **Pipeline Telemetry:** Live metric tracking for throughput rate (events/sec), processing latency (ms), buffer capacity, and packet integrity.
* **Dynamic Stream Controls:** Toggle ingestion states (`ACTIVE` / `PAUSED`), trigger manual burst simulations, and filter payloads by source platform.

### 2. Statistical Anomaly & Burst Detection
* **$z$-Score Anomaly Engine:** Applies dynamic rolling statistical outlier algorithms ($z > 3.0$) to distinguish organic viral surges from standard baseline chatter drift.
* **Velocity & Acceleration Tracking:** Calculates volume trajectory and dynamic momentum changes over rolling 24-hour windows.
* **Multi-Aspect Sentiment Polarity:** Computes normalized sentiment bias scores across positive, neutral, and negative post distributions per entity.

### 3. High-Dimensional Semantic Clustering
* **Interactive 2D Latent Vector Projection:** Maps unstructured conversational text embeddings into a 2D coordinate space simulating t-SNE / UMAP dimensionality reduction.
* **Unsupervised Cluster Discovery:** Groups high-density discourse into topic clusters (e.g., *Autonomous Agent Frameworks*, *Solid-State Storage*, *Spatial Computing*) before explicit hashtags form.
* **Adaptive Mobile Canvas:** Dynamic node density reduction, pinch-to-zoom, and collision prevention for smaller touch screens.

### 4. Automated Executive Synthesis (GenAI Layer)
* **Gemini-Powered Intelligence Briefings:** Synthesizes raw streaming telemetry into structured executive reports outlining key market drivers, risk signals, counter-narratives, and forward outlooks.
* **Interactive Query Assistant:** Embedded conversational interface allowing analysts to query streaming datasets using natural language.

---

## 🎨 Design System

Built with an **Eye-Safe Slate Dark Theme** optimized for data-dense analyst dashboards:

* **Canvas Background:** Deep Midnight Slate (`#0D1117`)
* **Panels & Cards:** Slate Blue-Gray (`#1E293B`) with dark borders (`#334155`)
* **Typography:** Crisp Ivory-White (`#F8FAFC`) with muted slate-beige subtext (`#94A3B8`)
* **Jewel-Tone Data Accents:**
  * 🩵 **Sapphire Cyan (`#0EA5E9`):** Active UI elements and tab navigation
  * 🟢 **Emerald Green (`#10B981`):** Positive growth velocity and bullish sentiment
  * 🔴 **Terracotta Crimson (`#EF4444`):** Critical statistical burst alerts ($z > 3.0$)
  * 🟣 **Amethyst & Amber (`#8B5CF6` / `#F59E0B`):** Unsupervised semantic vector clusters

---

## 📐 Mathematical Methodology

### 1. Statistical Anomaly Detection ($z$-score)
To identify statistically significant frequency spikes, the platform computes dynamic standard scores over dynamic sliding windows:

$$z = \frac{x - \mu}{\sigma}$$

* $x$: Observed token/topic volume in the current window.
* $\mu$: Rolling baseline mean volume.
* $\sigma$: Standard deviation of baseline volume.
* **Alert Thresholds:** $z > 2.0$ (High Anomaly) | $z > 3.0$ (Critical Burst Surge)

### 2. Growth Velocity & Acceleration
Measures the directional momentum rate of emerging topics:

$$V = \frac{\Delta \text{Volume}}{\Delta t} = \frac{x_t - x_{t-1}}{t - (t-1)}$$

$$\text{Acceleration } (A) = \frac{V_t - V_{t-1}}{\Delta t}$$

### 3. Dimensionality Reduction & Vector Space Mapping
High-dimensional text embeddings $\mathbf{e}_v \in \mathbb{R}^D$ are projected onto a 2D interactive coordinate plane $(x, y) \in \mathbb{R}^2$ by minimizing pairwise cross-entropy loss between high-dimensional features and low-dimensional projections:

$$L_{\text{projection}} = \sum_{i} \sum_{j} p_{ij} \log \left(\frac{p_{ij}}{q_{ij}}\right)$$

### 4. Normalized Sentiment Polarity
Determines the net directional sentiment bias:

$$S_{\text{bias}} = \frac{N_{\text{pos}} - N_{\text{neg}}}{N_{\text{pos}} + N_{\text{neu}} + N_{\text{neg}}} \quad \text{where } S_{\text{bias}} \in [-1, 1]$$

---

## 🛠️ Tech Stack

* **Frontend:** React 18 / Next.js
* **Styling:** Tailwind CSS + Lucide React Icons
* **Data Visualization:** Chart.js / Recharts / HTML5 Canvas API
* **AI Synthesis:** Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`)
* **State & Data Processing:** Reactive Custom Hooks & WebSockets Data Engine

---

## ⚙️ Local Installation & Setup

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm** or **yarn**

### Quickstart Guide

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/TrendPulse-AI.git](https://github.com/YOUR_USERNAME/TrendPulse-AI.git)
   cd TrendPulse-AI
2. **Install Dependencies:**
   ```bash
   npm install

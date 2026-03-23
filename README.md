# 🧠 AI CFO Cortex

AI CFO Cortex is a state-of-the-art AI-powered financial co-pilot. It combines a dynamic, sleek frontend dashboard with a powerful Python-based backend to provide real-time market insights, intelligent portfolio management, data science forecasting, and an autonomous AI companion (Marcus Intelligence).

## 🚀 Key Features

*   **Marcus Intelligence**: An autonomous AI agent that provides real-time financial analysis, market pulse breakdowns, and strategic investment advice.
*   **Sutra Engine**: The core financial computation engine handling portfolio analysis, scenario calculations, and autonomous trading logic.
*   **Dynamic Sector Heatmaps**: Advanced visual breakdowns of market sector performance.
*   **Data Science Signals**: Predictive forecasting (Prophet/ARIMA) and risk classification models built right into the backend.
*   **Command Center Dashboards**: Beautiful, low-latency React UI built for intense financial monitoring and war-room execution.

## 🛠️ Technology Stack

### Frontend (User Interface)
*   **Framework**: Next.js 14 (React)
*   **Styling**: Tailwind CSS, CSS Modules
*   **Animations**: Framer Motion & custom UI micro-interactions
*   **Architecture**: Context Providers (AgentContext, ChatContext)

### Backend (AI & Logic)
*   **Framework**: Python (FastAPI)
*   **Machine Learning**: `scikit-learn`, `prophet`, `pandas`, `numpy`
*   **AI Integration**: Sarvam AI APIs & Custom Agent Loops

## 🏗️ Repository Structure

This project is structured as a **monorepo**:

*   **`/frontend`**: Contains the complete Next.js web application.
*   **`/backend`**: Contains the Python FastAPI service, AI agents, and data science scripts.

## 🚀 Deployment

This monorepo is completely configured for decoupled cloud deployment:
*   **Frontend**: Designed to be deployed seamlessly on **Vercel** with the Root Directory set to `frontend`.
*   **Backend**: Designed to be deployed seamlessly on **Render** (or Railway/Heroku) with the Root Directory set to `backend`.

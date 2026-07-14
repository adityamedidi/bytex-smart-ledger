# 📊 Bytex Smart Ledger

A full-stack personal finance tracking application built for the Bytex Challenge. This application allows users to seamlessly log income and expenses, calculate real-time balances, and automatically flag anomalous transactions.

## 🚀 Live Demo
- **Frontend:** [Link to your Vercel URL will go here]
- **Backend API:** [Link to your Render URL will go here]

## 🛠️ Tech Stack
**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- PostgreSQL (Neon Serverless DB)

## ✨ Key Features
- **Real-time Dashboard:** Instantly calculates total income, expenses, and current balance.
- **Transaction Logging:** Add new financial records with categories and descriptions.
- **Smart Anomaly Detection:** Backend automatically flags unusually high expenses (>$1000).
- **Persistent Storage:** Fully integrated with a cloud-based PostgreSQL database.

## 💻 Local Setup Instructions

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/adityamedidi/bytex-smart-ledger.git
cd bytex-smart-ledger
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file inside the `backend` folder and add your Neon database credentials:
\`\`\`env
DATABASE_URL=postgresql://<username>:<password>@<neon-hostname>/<dbname>?sslmode=require
PORT=5000
\`\`\`
Start the server:
\`\`\`bash
node server.cjs
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

---
**Author:** Medidi Lakshmi Naga Aditya Kumar
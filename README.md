Honey Chain — Blockchain-Based Honey Traceability & Smart Beekeeping Management

Overview
- Full-stack prototype (React + Vite, Tailwind, Express backend)
- Mock IoT data, QR verification, simulated blockchain timeline

Quick start
1. Open two terminals.
2. Install server dependencies:

```bash
cd "c:\Users\harsh\OneDrive\Desktop\CODE X\honey-chain\server"
npm install
npm start
```

3. Install client dependencies and run dev server:

```bash
cd "c:\Users\harsh\OneDrive\Desktop\CODE X\honey-chain\client"
npm install
npm run dev
```

4. Open the client (Vite) dev URL shown in terminal (usually http://localhost:5173)

Notes
- Backend runs on port 4000 by default (API endpoints under `/api`).
- This is a simulated prototype; blockchain is simulated and labelled clearly.
 
Optional: run both client and server together from the project root (requires `concurrently`):

```bash
cd "c:\Users\harsh\OneDrive\Desktop\CODE X\honey-chain"
npm install
npm run dev
```

Optional MongoDB
- Copy `server/.env.example` to `server/.env` and set `MONGO_URI` to enable database-backed mode. Without it the server uses mock data.

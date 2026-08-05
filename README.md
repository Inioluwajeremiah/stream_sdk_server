# Stream Video – Token Backend

Minimal Express + TypeScript server that mints Stream Video user tokens.
Your API **secret** must only ever live here, never in the mobile app.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# then edit .env and paste your Stream API key + secret
# (Dashboard -> your app -> App Access Keys: https://dashboard.getstream.io)
```

## Run

```bash
npm run dev
```

Server starts on `http://localhost:3000` (override with `PORT` in `.env`).

## Endpoints

- `GET /health` — sanity check
- `POST /token` — body `{ "userId": "alice", "userName": "Alice" }` →
  `{ "token": "...", "apiKey": "...", "userId": "alice" }`

The Expo app calls this endpoint on startup to get a token for whichever
user is logging in, then uses that token to connect to Stream.

## Production build

```bash
npm run build
npm start
```
# stream_sdk_server

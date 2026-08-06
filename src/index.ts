import express, { Request, Response } from "express";
import cors from "cors";
import { StreamClient } from "@stream-io/node-sdk";
import { config } from "./config";

const app = express();
app.use(cors());
app.use(express.json());

// Server-side Stream client. NEVER ship the API secret to the mobile app —
// tokens must always be minted here, on a trusted server.
const streamClient = new StreamClient(config.streamApiKey, config.streamApiSecret);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

/**
 * POST /token
 * body: { userId: string }
 *
 * Issues a short-lived Stream user token for the given userId, and makes
 * sure that user exists on Stream (upsert is cheap/idempotent).
 */
app.post("/token", async (req: Request, res: Response) => {
  try {
    const { userId, userName } = req.body as { userId?: string; userName?: string };

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId (string) is required" });
    }

    // Make sure the user exists in Stream so their name/image show up in the call.
    await streamClient.upsertUsers([
      {
        id: userId,
        name: userName ?? userId,
        role: "user",
      },
    ]);

    const token = streamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60, // 1 hour
    });

    res.json({
      token,
      apiKey: config.streamApiKey,
      userId,
    });
  } catch (err) {
    console.error("Failed to issue token", err);
    res.status(500).json({ error: "Failed to issue token" });
  }
});

app.listen(config.port, () => {
  console.log(`Stream token server listening on http://localhost:${config.port}`);
});

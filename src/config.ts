import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Copy .env.example to .env and fill it in.`
    );
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  streamApiKey: requireEnv("STREAM_API_KEY"),
  streamApiSecret: requireEnv("STREAM_API_SECRET"),
};

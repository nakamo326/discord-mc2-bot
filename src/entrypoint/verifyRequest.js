import { verifyKey } from "discord-interactions";

export const verifyRequest = (event) => {
  const { headers, body } = event;
  const signature = headers["x-signature-ed25519"];
  const timestamp = headers["x-signature-timestamp"];
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!body || !signature || !timestamp || !publicKey) {
    return false;
  }
  return verifyKey(body, signature, timestamp, publicKey);
};

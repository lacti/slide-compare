import fetch from "node-fetch";

export default async function postToSlack(text: string): Promise<void> {
  if (!("SLACK_WEBHOOK_URL" in process.env)) {
    return;
  }
  const response = await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      channel: process.env.SLACK_CHANNEL,
      username: process.env.SLACK_HOOK_NAME ?? "Slide-Compare",
    }),
  });
  const responseText = await response.text();
  console.debug("Into the Slack", responseText);
}

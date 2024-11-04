import { OPENAI_API_KEY } from "./config.js";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log("in background");
  if (request.action === "fetchSummary") {
    console.log("fetching summary");
    const summary = await getSummary(request.url);
    sendResponse({ summary });
  }
  return true; // Required to use sendResponse asynchronously
});

async function getSummary(url) {
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        prompt: `Please summarize the following article: ${url}`,
        max_tokens: 150,
      }),
    });
    const data = await response.json();
    return data.choices[0].text.trim();
  } catch (error) {
    console.error("Error fetching summary:", error);
    return "Error fetching summary. Please try again.";
  }
}

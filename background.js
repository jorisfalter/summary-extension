const inProgressSummaries = new Set();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (
    request.action === "fetchSummary" &&
    !inProgressSummaries.has(request.url)
  ) {
    inProgressSummaries.add(request.url);

    // Handle the async operation properly
    getSummary(request.url)
      .then((summary) => {
        sendResponse({ summary });
        inProgressSummaries.delete(request.url);
      })
      .catch((error) => {
        console.error("Error in getSummary:", error);
        sendResponse({ summary: "Error fetching summary. Please try again." });
        inProgressSummaries.delete(request.url);
      });

    return true; // Keep the message channel open
  } else {
    sendResponse({ summary: "Duplicate request in progress." });
    return false; // No need to keep the channel open for immediate response
  }
});

const OPENAI_API_KEY = "";

async function getSummary(url) {
  console.log("here's what we're summarizing: " + url);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Please summarize the following article: ${url}`,
          },
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    console.log("here comes the response");
    console.log(data.choices[0].message.content);

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching summary:", error);
    return "Error fetching summary. Please try again.";
  }
}

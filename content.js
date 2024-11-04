document.addEventListener("mouseover", async (event) => {
  if (event.target.tagName === "A") {
    const url = event.target.href;
    console.log("received url");
    console.log(url);

    // Send message to background script to fetch summary
    chrome.runtime.sendMessage({ action: "fetchSummary", url }, (response) => {
      // console.log("sending message");
      if (response && response.summary) {
        console.log("received summary");
        showTooltip(event, response.summary);
      } else {
        showTooltip(event, "No summary available.");
      }
    });
  }
});

function showTooltip(event, url) {
  console.log("gonna show tooltip");

  // Create tooltip container
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";

  // Create prompt message
  const message = document.createElement("p");
  message.innerText = "Press the button to get a summary";

  // Create button for fetching summary
  const button = document.createElement("button");
  button.innerText = "Get Summary";
  button.addEventListener("click", () => fetchSummary(url, tooltip)); // Fetch summary on click

  // Append message and button to tooltip
  tooltip.appendChild(message);
  tooltip.appendChild(button);

  document.body.appendChild(tooltip);

  // Position tooltip
  tooltip.style.left = `${event.pageX}px`;
  tooltip.style.top = `${event.pageY}px`;

  // Remove tooltip after a timeout
  setTimeout(() => tooltip.remove(), 15000); // Keep it longer for interaction
}

async function fetchSummary(url, tooltip) {
  // Clear existing tooltip content and show loading state
  tooltip.innerHTML = "Fetching summary...";

  chrome.runtime.sendMessage({ action: "fetchSummary", url }, (response) => {
    if (chrome.runtime.lastError) {
      tooltip.innerText = "Error fetching summary.";
      console.error("Error:", chrome.runtime.lastError.message);
      return;
    }

    if (response && response.summary) {
      tooltip.innerText = response.summary;
    } else {
      tooltip.innerText = "No summary available.";
    }

    // Remove tooltip after displaying the summary
    setTimeout(() => tooltip.remove(), 2000); // Keep it visible longer for reading
  });
}

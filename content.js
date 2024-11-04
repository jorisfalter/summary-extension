// Listen for mouseover events
document.addEventListener("mouseover", (event) => {
  if (event.target.tagName === "A") {
    const url = event.target.href;
    console.log("received url: " + url);

    // Show tooltip with "Get Summary" button
    showTooltip(event, url);
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

  // Add click event listener to fetch the summary when button is clicked
  button.addEventListener("click", () => fetchSummary(url, tooltip));

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

  try {
    // Use Promise wrapper for chrome.runtime.sendMessage
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { action: "fetchSummary", url },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        }
      );
    });

    // Display the summary if available
    if (response && response.summary) {
      tooltip.innerText = response.summary;
    } else {
      tooltip.innerText = "No summary available.";
    }
  } catch (error) {
    console.error("Error:", error);
    tooltip.innerText = "Dit lukt nog niet.";
  }

  // Remove tooltip after displaying the summary
  setTimeout(() => tooltip.remove(), 5000);
}

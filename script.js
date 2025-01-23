const loveBar = document.getElementById("loveBar");
const messages = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const spillTeaBtn = document.getElementById("spillTea");

let loveScore = 50; // Initial love score
let chatHistory = []; // Timeline for "Spill the Tea"

// Function to send a message
sendBtn.addEventListener("click", async () => {
  const userMessage = userInput.value;
  if (!userMessage) return;

  // Add user message to chat
  addMessage("You", userMessage);

  // Send message to Gemini API
  const aiResponse = await getGeminiResponse(userMessage);

  // Add AI response to chat
  addMessage("AI", aiResponse.message);

  // Update love score based on AI feedback
  loveScore += aiResponse.loveChange;
  updateLoveBar();
});

// Update love bar
function updateLoveBar() {
  loveBar.textContent = loveScore;
  if (loveScore <= 0) alert("She stopped texting you. Restart the game!");
}

// Add message to chat window
function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = `${sender}: ${text}`;
  messages.appendChild(messageDiv);
  chatHistory.push({ sender, text });
}

// Simulate API call to Gemini
async function getGeminiResponse(userMessage) {
  const apiKey = "GOOGLE_API_KEY"; // Replace with your actual API key
  const response = await fetch("https://api-generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: {
        text: `You are a Japanese girl using modern slang. Respond to the user as if you are texting in a friendly or romantic tone.`,
      },
      userInput: userMessage,
    }),
  });

  const data = await response.json();
  const aiText = data.candidates[0].output;

  // Example response logic
  const loveChange = aiText.includes("いい感じ") ? 10 : -10;

  return { message: aiText, loveChange };
}

// Spill the Tea button
spillTeaBtn.addEventListener("click", () => {
  alert("Relationship Timeline:\n" + chatHistory.map(h => `${h.sender}: ${h.text}`).join("\n"));
});

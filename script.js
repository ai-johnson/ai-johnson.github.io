const loveBar = document.getElementById("loveBar");
const messages = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const spillTeaBtn = document.getElementById("spillTea");

let loveScore = 50; // Initial love score
let chatHistory = []; // Timeline for "Spill the Tea"

const GOOGLE_API_KEY = "GOOGLE_API_KEY"; // Replace with your Gemini API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-flash:generateText?key=${GOOGLE_API_KEY}`;

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

// Fetch response from Gemini API
async function getGeminiResponse(userMessage) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: {
          text: `You are a Japanese girl using modern slang. Respond to the user as if you are texting in a friendly or romantic tone.`,
        },
        userInput: userMessage,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message || "Failed to generate a response.");
    }

    const aiResponse = data.candidates[0].output || "Sorry, no response.";
    return {
      message: aiResponse,
      loveChange: aiResponse.includes("いい感じ") ? 10 : -10,
    };
  } catch (error) {
    console.error("Error in fetching Gemini API:", error);
    return { message: "Error: Could not connect to the API.", loveChange: 0 };
  }
}

// Spill the Tea button
spillTeaBtn.addEventListener("click", () => {
  alert(
    "Relationship Timeline:\n" +
      chatHistory.map((h) => `${h.sender}: ${h.text}`).join("\n")
  );
});

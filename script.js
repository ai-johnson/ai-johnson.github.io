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

async function getGeminiResponse(userMessage) {
    try {
        const response = await fetch("http://127.0.0.1:5000/generate", {
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
        if (data.error) {
            console.error("Error from Python backend:", data.error);
            return { message: "Error: Could not get a response", loveChange: 0 };
        }

        return { message: data.response, loveChange: data.response.includes("いい感じ") ? 10 : -10 };
    } catch (error) {
        console.error("Error in fetch:", error);
        return { message: "Error: Could not connect to backend", loveChange: 0 };
    }
}

// Spill the Tea button
spillTeaBtn.addEventListener("click", () => {
  alert("Relationship Timeline:\n" + chatHistory.map(h => `${h.sender}: ${h.text}`).join("\n"));
});

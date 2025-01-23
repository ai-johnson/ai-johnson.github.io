import google.generativeai as genai
from flask import Flask, request, jsonify

# Flask app setup
app = Flask(__name__)

# Configure the Gemini API key
genai.configure(api_key="GOOGLE_API_KEY")  # Replace with your Gemini API key

@app.route("/generate", methods=["POST"])
def generate_content():
    # Get the prompt from the request
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        # Use the Gemini model
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})  # Return the AI's response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

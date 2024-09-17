
# Quanta AI Chat Application

**Live Demo**: [Quanta Live](https://quanta-svnj.onrender.com)

Welcome to Quanta, an AI-powered chat application built with Google's GenerativeAI and powered by Flask.

## About Quanta

Quanta leverages Google's GenerativeAI for advanced natural language processing capabilities. The backend is built using Flask, allowing seamless interaction through a web interface.

### Setup and Configuration

1. **Configure Gemini API**:
   - Obtain your Gemini API key from [Google GenerativeAI](https://ai.google.dev/).
   - Update `config.py` with your `GEMINI_API_KEY`.

2. **Install Dependencies**:
   ```bash
   pip install google-generativeai flask
   ```

3. **Run the Application**:
   ```bash
   python app.py
   ```

### How to Set Up Quanta

- Clone the repository:
  ```bash
  git clone https://github.com/Student408/Quanta.git
  cd Quanta
  ```

- Configure Gemini API:
  - Obtain your API key from [Google GenerativeAI](https://ai.google.dev/).
  - Update `config.py` with your `GEMINI_API_KEY`.

- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```

- Run the application:
  ```bash
  python app.py
  ```
  

### Code Overview

```python
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
from config import GEMINI_API_KEY

app = Flask(__name__)

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Initialize chat session
chat_session = model.start_chat(history=[])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json['message']
    response = chat_session.send_message(user_message)
    return jsonify({'response': response.text})

if __name__ == '__main__':
    app.run(debug=True)
```

### Features

- **Advanced AI-driven Conversations**: Utilizes Google's GenerativeAI for sophisticated dialogue capabilities.
- **Web Interface**: Built on Flask, providing a user-friendly web-based chat interface.
- **Scalable**: Configurable generation settings for optimal performance.

---

Explore Quanta live at [https://quanta-svnj.onrender.com](https://quanta-svnj.onrender.com) and set up your own instance using the provided instructions!

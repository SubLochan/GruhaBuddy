# GruhaBuddy - AI-Powered Interior Design Assistant

GruhaBuddy is a cutting-edge web application that leverages AI to transform your living spaces. It combines local AI models (Stable Diffusion, Llama 3) with cloud fallbacks (Google Gemini) to provide photorealistic room redesigns and expert interior design advice.

## 🌟 Key Features

-   **AI Room Redesign**: Upload a photo of your room and get a photorealistic redesign in styles like Modern, Minimalist, Bohemian, Industrial, etc.
    -   **Local Generation**: Runs on your GPU using **Stable Diffusion v1.5** (Privacy-focused, no cost).
    -   **Cloud Fallback**: Automatically switches to **Google Gemini** for detailed design analysis if local generation fails.
-   **AI Chat Assistant**: Chat with "GruhaBuddy", an expert interior design AI powered by **Ollama (Llama 3)**.
    -   Strictly scoped to interior design topics.
-   **Smart Dashboard**: Manage your room designs, view history, and download high-quality results.
-   **Secure Authentication**: User signup and login system to protect your data.

## 🏗️ Tech Stack

-   **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion
-   **Backend**: Node.js, Express.js, MongoDB
-   **AI Service**: Python, Flask, PyTorch, Diffusers, Ollama

## 🚀 Getting Started

### Prerequisites

1.  **Node.js** (v18+)
2.  **Python** (v3.10+)
3.  **MongoDB** (Local or Atlas)
4.  **Ollama** (for Chat) -> Run `ollama pull llama3.1:latest`(if not downloaded visit `https://ollama.com/download`)
5.  **NVIDIA GPU** (Recommended for Local Image Gen) - *Works on CPU but slow.*

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd GruhaBuddy
```

#### 2. Backend Setup (Node.js)
```bash
cd server
npm install
# Create a .env file with:
# MONGO_URI=mongodb://127.0.0.1:27017/gruhabuddy
# JWT_SECRET=your_secret_key
# PORT=5000
npm run dev
```

#### 3. Frontend Setup (React)
```bash
cd client
npm install
npm run dev
```

#### 4. AI Service Setup (Python)
```bash
cd ai_service
# Create virtual environment
python -m venv .venv
# Activate: .venv\Scripts\activate (Windows) or source .venv/bin/activate (Mac/Linux)
pip install -r requirements.txt

# Create a .env file in ai_service/:
# GEMINI_API_KEY=your_gemini_key (Optional fallback)
# OLLAMA_MODEL=llama3

python app.py
```

## 🧠 AI Configuration

### Local Image Generation (Stable Diffusion)
The system automatically detects if you have a CUDA-enabled GPU.
-   **First Run**: It will download the Stable Diffusion v1.5 model (~4GB).
-   **generates**: Images are saved to `server/uploads` and served to the frontend.

### Chatbot (Ollama)
Ensure Ollama is running (`ollama serve`). The app connects to `http://localhost:11434`.

## 📂 Project Structure

```
GruhaBuddy/
├── client/          # React Frontend
├── server/          # Node.js API & Database
├── ai_service/      # Python AI Logic (SD + Ollama)
└── README.md        # Project Documentation
```

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)

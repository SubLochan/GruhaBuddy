const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

const axios = require('axios');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/design', require('./routes/design'));

// Proxy for Chat (Ollama via Python Service)
app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5001/chat', req.body);
        res.json(response.data);
    } catch (err) {
        console.error("Chat Proxy Error:", err.message);
        // Better error handling for connection refused (Ollama/Python down)
        if (err.code === 'ECONNREFUSED') {
            return res.status(503).json({ reply: "Service is waking up. Please try again in a moment." });
        }
        res.status(500).json({ reply: "Sorry, I'm having trouble connecting to the AI right now." });
    }
});

app.get('/', (req, res) => {
    res.send('GruhaBuddy API is running');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gruhabuddy')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

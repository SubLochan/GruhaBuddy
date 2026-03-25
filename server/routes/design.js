const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); // Ensure axios is required

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Upload Room Image
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { userId, roomType, style } = req.body;

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const room = new Room({
            user: userId,
            originalImage: req.file.path,
            roomType: roomType || 'living room',
            stylePreference: style || 'modern'
        });

        await room.save();
        res.json(room);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get User's Rooms
router.get('/user/:userId', async (req, res) => {
    try {
        const rooms = await Room.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(rooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Generate Design (Call Python Service)
router.post('/generate', async (req, res) => {
    try {
        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({ msg: "roomId is required" });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ msg: "Room not found" });
        }

        // 🔥 Convert to absolute path (CRITICAL FIX)
        const absoluteImagePath = path.resolve(room.originalImage);

        try {
            const aiResponse = await axios.post(
                'http://127.0.0.1:5001/generate/',  // ✅ trailing slash fixed
                {
                    roomType: room.roomType,
                    style: room.stylePreference,
                    imagePath: absoluteImagePath
                },
                {
                    timeout: 30000 // avoid hanging forever
                }
            );

            if (!aiResponse.data || aiResponse.data.status !== "success") {
                throw new Error("Invalid AI response");
            }

            room.generatedDesign = aiResponse.data.generated_image;
            await room.save();

            return res.json({
                msg: "Design generated",
                design: room.generatedDesign,
                details: aiResponse.data.message
            });

        } catch (aiError) {
            console.error("AI Service Error:", aiError.response?.data || aiError.message);

            // fallback (don't break UX)
            room.generatedDesign = room.originalImage;
            await room.save();

            return res.status(200).json({
                msg: "Design generated (fallback used)",
                design: room.generatedDesign
            });
        }

    } catch (err) {
        console.error("Server Error:", err.message);
        return res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;

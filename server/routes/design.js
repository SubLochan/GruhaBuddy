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
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ msg: 'Room not found' });
        }

        try {
            // Call Python Service
            const aiResponse = await axios.post('http://localhost:5001/generate', {
                roomType: room.roomType,
                style: room.stylePreference,
                imagePath: room.originalImage
            });

            room.generatedDesign = aiResponse.data.generated_image;
            await room.save();

            res.json({ msg: 'Design generated', design: room.generatedDesign, details: aiResponse.data.message });
        } catch (aiError) {
            console.error("AI Service Error:", aiError.message);
            // Fallback
            room.generatedDesign = room.originalImage;
            await room.save();
            res.json({ msg: 'Design generated (Fallback)', design: room.generatedDesign });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

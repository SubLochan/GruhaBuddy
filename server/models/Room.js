const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalImage: {
        type: String, // URL or Path
        required: true
    },
    generatedDesign: {
        type: String // URL or Path
    },
    roomType: {
        type: String,
        default: 'living room'
    },
    stylePreference: {
        type: String,
        default: 'modern'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', RoomSchema);

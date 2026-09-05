const mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionName: {
        type: String,
        default: "New Conversation"
    },
    messages: [
        {
            role: {
                type: String,
                enum: ['user', 'assistant'],
                required: true
            },
            content: String,
            image: String, 
            audio: String, 
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
},
{
    timestamps: true
}
);
module.exports = mongoose.model('Chat', ChatSchema);
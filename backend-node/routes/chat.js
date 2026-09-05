const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const Chat = require('../models/Chat');
const upload = multer();

router.get('/sessions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || userId === "guest") return res.json([]);
        const sessions = await Chat.find({ userId }).select('_id sessionName createdAt').sort({ createdAt: -1 });
        res.json(sessions);
    } catch (err) { 
        res.status(500).json({ error: "Failed to load sessions" }); 
    }
});
 
router.get('/session/:sessionId', async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.sessionId);
        res.json(chat ? chat.messages : []);
    } catch (err) { 
        res.status(500).json({ error: "Failed to load messages" }); 
    }
});

 
router.delete('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        await Chat.findByIdAndDelete(sessionId);
        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Delete failed" });
    }
});
 
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { message, userId, sessionId, google_search_enabled } = req.body;

        const form = new FormData();
        form.append('message', message || "");
        form.append('google_search_enabled', google_search_enabled || "false");
        if (req.file) {
            form.append('file', req.file.buffer, { 
                filename: req.file.originalname, 
                contentType: req.file.mimetype 
            });
        }

        const aiResponse = await axios.post('http://127.0.0.1:8000/chat', form, { 
            headers: { ...form.getHeaders() } 
        });

        const reply = aiResponse.data.reply;

        let chat;
        const userMsg = { role: 'user', content: message || "Attachment Sent" };
        const aiMsg = { role: 'assistant', content: reply };

        if (userId && userId !== "guest") {
            if (sessionId && sessionId !== "null" && sessionId !== "undefined") {
                chat = await Chat.findByIdAndUpdate(
                    sessionId, 
                    { $push: { messages: [userMsg, aiMsg] } }, 
                    { new: true }
                );
            } else {
                chat = new Chat({ 
                    userId, 
                    sessionName: message ? (message.substring(0, 30) + "...") : "New Conversation", 
                    messages: [userMsg, aiMsg] 
                });
                await chat.save();
            }
        }

        res.json({ 
            reply, 
            sessionId: chat ? chat._id : null 
        });

    } catch (error) {
        console.error("Node.js Chat Route Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: "AI Engine Error", 
            details: "Please ensure FastAPI is running on port 8000." 
        });
    }
});

module.exports = router;
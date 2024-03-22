const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [false]
    },
    from: Object,
    socketid: String,
    time: String,
    date: String,
    to: String,
    fileUrl: {
        type: String,
        required: [false]
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
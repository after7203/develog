const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    parentBoard: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    parentReply: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply' },
    writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contents: { type: String, required: true },
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
}, { timestamps: true }
);

module.exports = mongoose.model('Reply', replySchema);
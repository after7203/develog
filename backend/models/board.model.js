const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    //writer_mid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    writer: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true, },
    scope: { type: String, enum: ['public', 'private'], required: true },
    brief: { type: String, required: true },
    contents: { type: String, required: true },
    like: { type: Number, required: true, default: 0 },
    thumbnail: { type: String },
    tags: [{ type: String }],
    series: [{ type: String }],
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply'}]
}, { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
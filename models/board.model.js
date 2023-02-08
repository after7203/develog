const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    scope: { type: String, enum: ['public', 'private'], required: true },
    brief: { type: String },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    thumbnail: { type: String, required: true, default: 'https://velog.velcdn.com/images/after7203/post/10dffdfa-ff34-448b-906e-a341e560d1b6/image.png' },
    tags: [{ type: String }],
    series: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Series' }],
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
}, { timestamps: true }
);

// boardSchema.pre('find', function (next) {
//     this.like_count = this.like.length
//     next();
// });

module.exports = mongoose.model('Board', boardSchema);
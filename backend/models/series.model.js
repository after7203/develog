const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
});

module.exports = mongoose.model('Series', seriesSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    pw: { type: String, required: true },
    series: [{name: String, url: String}]
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    pw: { type: String, required: true },
    profile: { type: String, default: `https://velog.velcdn.com/images/after7203/profile/2d5b9fac-b879-4451-97a3-54e486942c48/social_profile.png`},
    series: [{name: String, url: String}]
});

module.exports = mongoose.model('User', userSchema);
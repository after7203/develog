const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require("../models/user.model");

router.post("/register", async (req, res) => {

    const { id, pw } = req.body
    const salt = await bcrypt.genSalt()
    const bpw = await bcrypt.hashSync(pw, salt)
    try {
        await User.create({ id: id, pw: bpw })
    } catch {
        return res.status(200).json({
            success: false
        });
    }

    return res.status(200).json({
        success: true
    });
});

router.post("/login", async (req, res) => {

    const { id, pw } = req.body
    const userData = await User.findOne({ id: id })
    if (await bcrypt.compare(pw, userData.pw)) {
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET);
        return res.json({
            success: true,
            token: token
        })
    }
    else {
        return res.json({
            success: false
        })
    }
});

module.exports = router;
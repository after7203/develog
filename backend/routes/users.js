const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require("../models/user.model");
const auth = require('../middleware/auth');

router.post("/register", async (req, res) => {

    const { id, pw } = req.body
    const salt = await bcrypt.genSalt()
    const bpw = await bcrypt.hashSync(pw, salt)
    try {
        await User.create({ id: id, pw: bpw })
    } catch(e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }

    const token = jwt.sign({ id: id }, process.env.JWT_SECRET);
    return res.status(200).json({
        success: true,
        token: token
    });
});

router.post("/login", async (req, res) => {
    const { id, pw } = req.body
    const userData = await User.findOne({ id: id })
    if (await bcrypt.compare(pw, userData.pw)) {
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET);
        return res.json({
            success: true,
            mongoose_id: userData._id,
            token: token
        })
    }
    else {
        return res.json({
            success: false
        })
    }
});

router.get("/series", auth, async (req, res) => {
    const user = await User.findOne({ id: req.query.id })
    return res.json({
        userSeries: user.series
    })
});

router.post("/series", auth, async (req, res) => {
    try{
        let userData = await User.findOne({ id: req.body.user })
        userData.series.push({name: req.body.name, url: req.body.url});
        userData.save()
        return
    }
    catch(e){
        return res.json({
            error: e
        })
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require("../models/user.model");

router.post("/register", async (req, res) => {

    await User.create(req.body);

    return res.status(200).json({
        success: true
    });
});

router.post("/login", async (req, res) => {

    const userData = await User.findOne(req.body)
    if(userData){
        return res.json({
            success: true
        })
    }
    else{
        return res.json({
            success: false
        })
    }
});

module.exports = router;
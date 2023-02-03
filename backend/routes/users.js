const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require("../models/user.model");
const auth = require('../middleware/auth');
const multer = require('multer');
const dotenv = require("dotenv")
dotenv.config();
const fsExtra = require('fs-extra');
const fs = require("fs");
const upload = multer({
    storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
        destination(req, file, done) { // 저장 위치
            const dir = `public/users/${req.decoded.id}/profile`
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            else {
                fsExtra.emptyDirSync(dir)
            }
            done(null, dir);
        },
        filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
            done(null, file.originalname);
        }
    }),
});

router.post("/register", async (req, res) => {

    const { id, pw } = req.body
    const salt = await bcrypt.genSalt()
    const bpw = await bcrypt.hashSync(pw, salt)
    try {
        const user = (await User.create({ id: id, pw: bpw })).toObject()
        user.token = jwt.sign({ id: id }, process.env.JWT_SECRET)
        return res.status(200).json({
            user: user
        })
    } catch (e) {
        console.log(e)
        return res.status(401)
    }
});

router.post("/login", async (req, res) => {
    const { id, pw } = req.body
    const user = (await User.findOne({ id: id })).toObject()
    if (await bcrypt.compare(pw, user.pw)) {
        user.token = await jwt.sign({ id: id }, process.env.JWT_SECRET)
        return res.json({
            user: user
        })
    }
    else {
        return res.status(401)
    }
});

router.get("/series", auth, async (req, res) => {
    const user = await User.findOne({ id: req.query.id })
    if (req.decoded.id !== user.id) throw new Error("mismatch", req.decoded.id, " !== ", user.id)
    return res.json({
        userSeries: user.series
    })
});

router.post("/series", auth, async (req, res) => {
    try {
        let user = await User.findOne({ id: req.body.user })
        if (req.decoded.id !== user.id) throw new Error("mismatch", req.decoded.id, " !== ", user.id)
        user.series.push({ name: req.body.name, url: req.body.url });
        user.save()
        return
    }
    catch (e) {
        return res.json({
            error: e
        })
    }
});

router.get("/:mongooseId", auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.mongooseId })
        if (req.decoded.id !== user.id) throw new Error("mismatch", req.decoded.id, " !== ", user.id)
        return res.json({
            user: user
        })
    }
    catch (e) {
        console.log(e)
        return res.json({
            error: e
        })
    }
});

router.put("/:mongooseId/profile", auth, upload.single('profile'), async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.mongooseId })
        if (req.decoded.id !== user.id) throw new Error("mismatch", req.decoded.id, " !== ", user.id)
        await User.updateOne({ _id: req.params.mongooseId }, { $set: { profile: `${process.env.REACT_APP_SERVER_URI}/public/users/${req.decoded.id}/profile/${decodeURIComponent(req.headers.profile)}` } })
        return res.json({
            profile: `${process.env.REACT_APP_SERVER_URI}/public/users/${req.decoded.id}/profile/${req.headers.profile}`
        })
    }
    catch (e) {
        console.log(e)
        return res.json({
            error: e
        })
    }
});

module.exports = router;
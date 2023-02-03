const express = require('express');
const router = express.Router();
const fs = require("fs");
const multer = require('multer');
const auth = require('../middleware/auth');
const Board = require('../models/board.model');
const Reply = require('../models/reply.model');
const User = require('../models/user.model');
const upload = multer({
    storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
        destination(req, file, done) { // 저장 위치
            const dir = `public/users/${req.decoded.id}/board/${req.params.boardURL}/contents`
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            done(null, dir);
        },
        filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
            done(null, file.originalname);
        }
    }),
});

router.get("/", async (req, res) => {
    try {
        const boards = await Board.find().populate('writer').populate('reply', 'reply')
        return res.status(200).json({
            boards: boards
        });
    } catch {
        return res.status(200).json({
            success: false
        });
    }
});

router.get("/:writer", async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.writer })
        const boards = await Board.find({ writer: user._id }).populate('writer', 'id').populate('reply', 'reply')
        return res.status(200).json({
            boards: boards
        });
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
});

router.get("/:writer/:boardURL", async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.writer })
        const board = await Board.findOne({ writer: user._id, url: req.params.boardURL }).populate('writer').populate({ path: 'reply', populate: [{ path: 'writer', select: 'id' }, { path: 'reply', populate: { path: 'writer', select: 'id' } }] })
        // console.log(board)
        const fs = require("fs").promises
        const contents = await fs.readFile(`public/users/${req.params.writer}/board/${req.params.boardURL}/contents/contents.txt`, 'utf8', function (err, data) {
            if (err) {
                console.log(err)
            }
            return data
        })
        return res.status(200).json({
            board: {
                ...board._doc,
                contents: contents
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
});

router.post("/:writer/:boardURL", auth, upload.array('files'), async (req, res) => {
    const { writer, title, tags, brief, scope, url, series, thumbnail } = JSON.parse(decodeURIComponent(req.headers.data))
    if (req.decoded.id !== writer) return
    const data = {
        writer: req.headers.mongoose_id,
        title: title,
        url: url,
        scope: scope,
        brief: brief,
        tags: tags,
        series: series,
        thumbnail: thumbnail
    }
    try {
        await Board.create(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
    return res.status(200).json({
        success: true
    });
});

router.put("/:boardId/", auth, upload.array('files'), async (req, res) => {
    const { writer, title, tags, brief, scope, url, series, thumbnail, _id } = JSON.parse(decodeURIComponent(req.headers.data))
    if (req.decoded.id !== writer) return
    const data = {
        writer: req.headers.mongoose_id,
        title: title,
        url: url,
        scope: scope,
        brief: brief,
        tags: tags,
        series: series,
        thumbnail: thumbnail
    }
    try {
        await Board.updateOne({ _id: _id }, { $set: data })
        return res.status(200).json({
            success: true
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
});

router.put("/:boardId/like", auth, async (req, res) => {
    if (req.decoded.id !== req.body.user) throw new Error("mismatch", req.decoded.id, " !== ", req.body.user)
    try {
        await Board.updateOne({ _id: req.params.boardId }, { $push: { like: req.body.mongooseId } })
        return res.status(200).json({
            success: true
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
});

router.put("/:boardId/unlike", auth, upload.array('files'), async (req, res) => {
    if (req.decoded.id !== req.body.user) throw new Error("mismatch")
    try {
        await Board.updateOne({ _id: req.params.boardId }, { $pull: { like: req.body.mongooseId } })
        return res.status(200).json({
            success: true
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
});

router.delete("/:writer/:boardURL", auth, async (req, res) => {
    // console.log(req.decoded.id, req.params.writer)
    if (req.decoded.id !== req.params.writer) return
    try {
        const replies = await Board.findOne({ url: req.params.boardURL }).populate('reply', 'reply')
        replies.reply.map(reply => {
            reply.reply.map(reply => {
                Reply.deleteOne({ _id: reply._id })
            })
            Reply.deleteOne({ _id: reply._id })
        })
        await Board.deleteOne({ url: req.params.boardURL })
        const dir = `./public/users/${req.params.writer}/board/${req.params.boardURL}`
        if (fs.existsSync(dir)) {
            fs.rm(dir, { recursive: true }, err => {
                console.log("err : ", err);
            })
        }
        return res.status(200).json({
            success: true
        });
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
});

module.exports = router;
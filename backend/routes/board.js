const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const fs = require("fs");
const multer = require('multer');
const auth = require('../middleware/auth');
const Board = require('../models/board.model');
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
        const boards = await Board.find().populate('reply', 'reply')
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
        //onsole.log(req.params.writer)
        const boards = await Board.find({ writer: req.params.writer }).populate('reply', 'reply')
        return res.status(200).json({
            boards: boards
        });
    } catch {
        return res.status(200).json({
            success: false
        });
    }
});

router.get("/:writer/:boardURL", async (req, res) => {
    try {
        const board = await Board.findOne({ writer: req.params.writer, url: req.params.boardURL }).populate({ path: 'reply', populate: [{ path: 'writer', select: 'id' }, { path: 'reply', populate: { path: 'writer', select: 'id' } }] })
        return res.status(200).json({
            board: board
        });
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
});

router.post("/:writer/:boardURL", auth, upload.array('files'), async (req, res) => {
    const { writer, title, tags, brief, scope, url, series, contents, thumbnail } = JSON.parse(decodeURIComponent(req.headers.data))
    // console.log(req.decoded.id, writer)
    if (req.decoded.id !== writer) return
    try {
        await Board.create({
            writer: writer,
            title: title,
            url: url,
            scope: scope,
            brief: brief,
            contents: contents,
            tags: tags,
            series: series,
            thumbnail: thumbnail
        })
    } catch (e){
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
    return res.status(200).json({
        success: true
    });
});

router.delete("/:writer/:boardURL", auth, async (req, res) => {
    if (req.decoded.id !== req.params.write) return
    try {
        await Board.deleteOne({ writer: req.params.writer, url: req.params.boardURL })
        fs.rm(`./public/users/${req.params.writer}/board/${req.params.boardURL}`, { recursive: true }, err => {
            console.log("err : ", err);
        })

        return res.status(200).json({
            success: true
        });
    } catch {
        return res.status(200).json({
            success: false
        });
    }
});

module.exports = router;
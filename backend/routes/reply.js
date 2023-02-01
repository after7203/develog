const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Board = require('../models/board.model');
const Reply = require('../models/reply.model');

router.post("/:writer/:boardURL", auth, async (req, res) => {
    if (req.decoded.id !== req.body.userId) return
    try {
        const reply = await Reply.create({ parentBoard: req.body.parentBoard, writer: req.body.mongooseId, contents: req.body.contents })
        await Board.updateOne({ writer: req.params.writer, url: req.params.boardURL }, { $push: { reply: reply._id } })
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

router.post("/:writer/:boardURL/:replyId", auth, async (req, res) => {
    // console.log(req.decoded.id, req.body.userId)
    if (req.decoded.id !== req.body.userId) return
    try {
        const reply = await Reply.create({ parentReply: req.params.replyId, writer: req.body.mongooseId, contents: req.body.contents })
        await Reply.updateOne({ _id: req.params.replyId }, { $push: { reply: reply._id } })
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

router.delete("/", auth, async (req, res) => {
    try {
        const reply = await Reply.findOne(req.body).populate('writer', 'id').populate('reply', '_id')
        if (req.decoded.id !== reply.writer.id) return
        if (reply.parentBoard) {
            await Board.updateOne({ _id: reply.parentBoard }, { $pull: { reply: req.body._id } })
        }
        else if (reply.parentReply) {
            await Reply.updateOne({ _id: reply.parentReply }, { $pull: { reply: req.body._id } })
        }
        reply.reply.map(async(el) => await Reply.deleteOne({ _id: el._id }))
        await Reply.deleteOne(req.body)
        return res.status(200).json({
            success: true
        });
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
});

router.put("/:writer/:boardURL/:replyId", auth, async (req, res) => {
    // console.log(req.decoded.id, req.body.writer)
    if (req.decoded.id !== req.body.writer) return
    try {
        await Reply.updateOne({_id: req.params.replyId}, {$set: {contents: req.body.contents}})
        return res.status(200).json({
            success: true
        });
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
});

router.put("/:replyId", auth, async (req, res) => {
    // console.log(req.decoded.id, req.body.writer)
    if (req.decoded.id !== req.body.writer) return
    try {
        await Reply.updateOne({_id: req.params.replyId}, {$set: {contents: req.body.contents}})
        return res.status(200).json({
            success: true
        });
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            success: false
        });
    }
});

module.exports = router;
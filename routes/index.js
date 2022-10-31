const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
const fs = require('fs');

const Post = require('../models/post');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images/');
    },
    filename(req, file, cb) {
        let dot = file.originalname.lastIndexOf('.');
        let name = file.originalname.substring(0, dot);
        let ext = file.originalname.substring(dot);
        cb(null, `${name}-${new Date().getTime()}${ext}`);
    },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/createpost', passport.authenticate('jwt', { session: false }), upload.single('image'), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const post = await Post.create({
        userId: req.user._id,
        imagePath: req.file.path,
        title: req.body.title,
        description: req.body.description,
        date: new Date()
    });
    res.status(200).send(post);
});

router.get('/post/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let post = await Post.findOne({ _id: req.params.id });
    res.status(200).send(post);
});

router.get('/posts', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let posts = await Post.find({ userId: req.user._id });
    res.status(200).send(posts);
});

router.delete('/deletepost/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    if (post) {
        fs.unlink(post.imagePath, (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
    res.sendStatus(200);
});

router.post('/editepost/:id', passport.authenticate('jwt', { session: false }), upload.single('image'), async (req, res) => {
    const post = await Post.findByIdAndUpdate({ _id: req.params.id }, req.body);
    if (req.file) {
        fs.unlink(post.imagePath, (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
        post.imagePath = req.file.path;
    }
    await post.save();
    res.sendStatus(200);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/add', async (req, res) => {
    // delete req.body.password1;
    // console.log(req.body);
    const checkUser = await User.findOne({email: req.body.email});
    if (checkUser) {
        res.send({});
    }
    else {
        const user = await User.create(req.body);
        
        res.send(user);
    }
});

router.post('/update', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await User.updateOne({ _id: req.body._id }, req.body);
    // console.log(req.body);
    res.sendStatus(200);
});

router.get('/get', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const users = await User.find();
    console.log(users);
    res.status(200).send(users);
});

router.get('/get/:email', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    console.log(user);
    res.status(200).send(user || {});
});

router.get('/available/:email', async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    console.log(user);
    res.status(200).send(!user);
});

router.delete('/delete/:email', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await User.findOneAndDelete({ email: req.params.email });
    res.sendStatus(200);
});

router.post('/login', async (req, res, next) => {
    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
                if (err || !user) {
                    const error = new Error('An error occurred.');
                    return next(error);
                }
                req.login(
                    user,
                    { session: false },
                    async (error) => {
                        if (error) return next(error);
                        const body = { _id: user._id, email: user.email };
                        const token = jwt.sign({ user: body }, 'TOP_SECRET');
                        return res.json({ token, email: user.email });
                    }
                );
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
});

module.exports = router;
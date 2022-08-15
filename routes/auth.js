const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');


const router = express.Router();

router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'name must be atleat 3 characters').isLength({ min: 3 }),
    body('password', 'Password must be atleat 5 characters').isLength({ min: 5 }),
], async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "sorry a user with this email already exists" })
        }
        user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            .then(user => res.json(user))
            // .catch(err => {
            //     console.log(err)
            //     res.json({ error: 'please enter a unique value for email', massage: err.message })
            // })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");
    }
});


module.exports = router;
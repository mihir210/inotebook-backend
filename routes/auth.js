const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "mihir";
var fetchuser = require('../middleware/fetchuser');
const router = express.Router();



// create user   // login not requird
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
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        const data = {
            id: user.id
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        // res.json(user)
        res.json({ authtoken });
        // .catch(err => {
        //     console.log(err)
        //     res.json({ error: 'please enter a unique value for email', massage: err.message })
        // })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error occured");
    }
});




// login user  

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "please try to login with correct details" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "please try to login with correct details" });
        }
        const data = {
            id: user.id
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("internal server error occured");
    }

})


// getuser  // login required
router.post('/getuser', fetchuser, async(req, res) => {

    try {

        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error occured");
    }
})


module.exports = router;
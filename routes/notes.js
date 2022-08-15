const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

const Note = require('../models/Notes');

const Notes = require('../models/Notes');
router.get('/fetchallnotes', fetchuser, async(req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error occured");
    }

});


router.post('/addnote', fetchuser, [
    body('title', 'title must be atleat 3 characters').isLength({ min: 3 }),
    body('description', 'name must be atleat 5 characters').isLength({ min: 5 }),
    body('title', 'Enter a valid title').isLength({ min: 3 }),
], async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const { title, description, tag } = req.body;
        const note = new Note({
            user: req.user.id,
            title,
            description,
            tag
        })
        const savednote = await note.save();
        res.json(savednote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error occured");
    }


});




router.put('/updatenote/:id', fetchuser, async(req, res) => {
    try {
        const { title, description, tag } = req.body;

        const newnote = {};

        if (title) { newnote.title = title };
        if (description) { newnote.description = description };
        if (tag) { newnote.title = tag };

        let note = await Note.findById(req.params.id);

        if (!note) { return res.status(404).send("not found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }


        note = await Note.findOneAndUpdate(req.params.id, { $set: newnote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error occured");
    }



})



router.delete('/deletenote/:id', fetchuser, async(req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("not found") };
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }



        note = await Note.findByIdAndDelete(req.params.id);

        res.json({ note: note, "success": `${req.params.id} has been deleted` });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error occured");
    }

})

module.exports = router;
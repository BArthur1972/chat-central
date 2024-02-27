const router = require('express').Router();
const User = require('../models/User');

// Get user by id
router.get('/getUserById/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log("Error: ", error.message);
    }
});

// Creating a new user or signing up
router.post('/', async (req, res) => {
    try {
        const { name, email, password, picture, bio } = req.body;
        const user = await User.create({ name, email, password, picture, dateJoined: Date.now() , bio});
        res.status(201).json(user);
    } catch (e) {
        let msg;
        if (e.code == 11000) {
            msg = "User already exists";
        } else {
            msg = e.message;
        }
        console.log(e);
        res.status(400).json(msg);
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        user.status = 'online';
        await user.save();
        res.status(200).json(user);
    } catch (e) {
        res.status(400).json(e.message);
    }
});

// Update the username
router.put('/updateUsername/:id/:newName', async (req, res) => {
    const { id, newName } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, { name: newName }, { new: true });
        res.status(200).json(user);
        console.log("User updated: ", user);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log("Error: ", error.message);
    }
});

// Update password
router.put('/updatePassword/:id/:newPassword', async (req, res) => {
    const { id, newPassword } = req.params;
    try {
        const user = await User.findById(id);
        user.password = newPassword;
        await user.save();
        res.status(200).json(user);
        console.log("User updated: ", user);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log("Error: ", error.message);
    }
});

// Update bio
router.put('/updateBio/:id/:newBio', async (req, res) => {
    const { id, newBio } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, { bio: newBio }, { new: true });
        res.status(200).json(user);
        console.log("User updated: ", user);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log("Error: ", error.message);
    }
});

// Get all users
router.get('/getUsers', async (req, res) => {
    try {
        let users = await User.find();
        res.status(200).json(users);
    } catch (e) {
        res.status(400).json(e.message);
    }
});

module.exports = router;
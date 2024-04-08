const router = require('express').Router();
const User = require('../models/User');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Get user by id
router.get('/getUserById/:id', auth, async (req, res) => {
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
        const user = new User({ name, email, password, picture, dateJoined: Date.now(), bio });

        const token = await user.generateAuthToken();
        await user.save();

        res.status(201).json({ user, token });
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
        
        const token = await user.generateAuthToken();
        user.status = 'online';
        await user.save();
        res.status(200).json({user, token});
    } catch (e) {
        res.status(400).json(e.message);
    }
});

// Update the username
router.put('/updateUsername/:id/:newName', auth, async (req, res) => {
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
router.put('/updatePassword/:id/:newPassword', auth, async (req, res) => {
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
router.put('/updateBio/:id/:newBio', auth, async (req, res) => {
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

// Update picture
router.put('/updatePicture/:id/:newPicture', auth, async (req, res) => {
    const { id, newPicture } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, { picture: newPicture }, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log("Error: ", error.message);
    }
});

// Delete account
router.delete('/deleteAccount/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);

        // Update the username in the messages
        await Message.updateMany({ "from._id": id }, { "from.name": "Deleted Account" });

        res.status(200).json(user);
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
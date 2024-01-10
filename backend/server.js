const express = require('express');
const cors = require('cors');
require('./connection.js');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const Message = require('./models/Message');

const channels = ['General', 'Announcements', 'Career Opportunities', 'DSA for Technical Interviews', 'Interview Resources'];

const app = express();

// Add middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add middleware to allow cross-origin requests from client side
app.use(cors());

// Add middleware to use userRoutes for all routes starting with /users
app.use('/users', userRoutes);

const server = require('http').createServer(app);
const PORT = 5001;

// Create socket connection and pass in server instance and cors options to allow for cross-origin requests from client side
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// get last messages from a channel
async function getLastMessagesFromChannel(channel) {
    // console.log(`getting last messages from ${channel}`);
    let channelMessages = await Message.aggregate([
        { $match: { to: channel } },
        { $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } }
    ]);
    // console.log(`last messages from ${channel}: `, channelMessages);
    return channelMessages;
}

// sort messages by date (most recent first)
function sortChannelMessagesByDate(messages) {
    return messages.sort(function (a, b) {
        let date1 = a._id.split('/');
        let date2 = b._id.split('/');

        // Convert date to YYYYMMDD format for comparison
        date1 = date1[2] + date1[0] + date1[1];
        date2 = date2[2] + date2[0] + date2[1];

        // Compare dates and return -1 if date1 is less than date2, otherwise return 1
        return date1 < date2 ? -1 : 1;
    });
}

// Create a socket connection
io.on('connection', (socket) => {

    // Let all users know when a new user joins
    socket.on('new-user', async () => {
        const members = await User.find({});

        socket.emit('new-user', members);
    });

    // Listen for a user joining a channel
    socket.on('join-channel', async (newChannel, previousChannel) => {
        // Join the new channel and leave the previous channel
        socket.join(newChannel);
        socket.leave(previousChannel);
        let channelMessages = await getLastMessagesFromChannel(newChannel);
        channelMessages = sortChannelMessagesByDate(channelMessages);
        // Send the last messages to the user
        socket.emit('channel-messages', channelMessages);
    });

    // Post new message
	// We need to use the socket to notify other users that there is a new message.
	socket.on('message-channel', async (channel, content, sender, time, date) => {
		const newMessage = await Message.create({ content, from: sender, time, date, to: channel });
		let channelMessages = await getLastMessagesFromChannel(channel);
		channelMessages = sortChannelMessagesByDate(channelMessages);
		// sending a message to a channel
		io.to(channel).emit('channel-messages', channelMessages);

        // sending a notification to a channel
		socket.broadcast.emit('notifications', channel);
	});

    // Log a user out of the app
	app.delete('/logout', async (req, res) => {
		try {
			const { _id, newMessages } = req.body;
			const user = await User.findById(_id);
			user.status = "offline";
			user.newMessages = newMessages;
			await user.save();
			const members = await User.find();
            // sending a notification to all users that a user has logged out of the app
			socket.broadcast.emit('new-user', members);
			res.status(200).send();
		} catch (e) {
			console.log(e);
			res.status(400).send();
		}
	});
});
 
// get all channels
app.get('/channels', (req, res) => {
    res.json(channels);
});

app.get("/", (req, res) => {
    res.send("Welcome to the Chat App");
});

// Listen for connection event and log to console
server.listen(PORT, () => {
    console.log('Listening to port: ', PORT);
});
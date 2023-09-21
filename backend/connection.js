require('dotenv').config();

const mongoose = require('mongoose');

const options = {
	connectTimeoutMS: 10000,
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

const dbUrl = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.frjpktp.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, options).catch((err) => console.log(err.message));

// Validate DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
	console.log("Connected to Mongo DB");
});
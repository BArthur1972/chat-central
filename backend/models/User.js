const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Can't be blank"]
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "Can't be blank"],
        index: true,
        validate: [isEmail, "Invalid Email"]
    },
    password: {
        type: String,
        required: [true, "Can't be blank"]
    },
    picture: {
        type: String,
        required: false
    },
    dateJoined: {
        type: Date
    },
    bio: {
        type: String,
        default: 'Hey there! I am using ChatCentral'
    },
    newMessages: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        default: 'online'
    },
    lastSeenDatetime: {
        type: Date,
        default: Date.now(),
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, { minimize: false });


// Hash the password before a user is saved
UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }

            user.password = hash
            next();
        });
    });
});

// Send response back as a JSON without the password
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

// Find a user
UserSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password')
    }

    return user;
};

// Generate an auth token
UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET );
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

// Remove token
UserSchema.methods.removeToken = async function (token) {
    const user = this;
    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
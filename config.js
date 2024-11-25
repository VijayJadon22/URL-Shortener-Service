const mongoose = require('mongoose');

async function connectToMongoDB() {
    return mongoose.connect("mongodb://localhost:27017/short-url");
}

module.exports = { connectToMongoDB };
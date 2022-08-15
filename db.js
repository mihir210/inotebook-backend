const mongoose = require('mongoose');
const uri = "mongodb://localhost:27017/inotebook";
const connectToMongo = () => {
    mongoose.connect(uri, () => {
        console.log("connected");
    })
}

module.exports = connectToMongo;
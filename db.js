const mongoose = require('mongoose');
const uri = "mongodb+srv://mihir:admin@cluster0.csp0gt1.mongodb.net/inotebook";
const connectToMongo = () => {
    mongoose.connect(uri, () => {
        console.log("connected");
    })
}

module.exports = connectToMongo;
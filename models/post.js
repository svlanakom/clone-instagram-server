const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: String,
    imagePath: String,
    title: String,
    description: String,
    date: Date
})

module.exports = mongoose.model("Post", postSchema);
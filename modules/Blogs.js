const mongoose = require('mongoose')
const Schema = mongoose.Schema
//enkel schema for å lage blogs
const blogSchema = new Schema({
    email: {
        type:String,
        required:true
    },
    title: {
        type:String,
        required:true
    },
    snippet:{
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog
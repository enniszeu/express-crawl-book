var mongoose = require('mongoose');


var postSchema = new mongoose.Schema({
	imageHome:String,
	nameHome:String,
	linkHome:String
});

var Post = mongoose.model('Post', postSchema, 'post');

module.exports = Post;
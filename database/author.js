const mongoose = require("mongoose");

// create an author schema
const AuthorSchema = mongoose.Schema(
 {
    id: Number,
    name: String,
    books: [String]
 }
);

// create an author model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;
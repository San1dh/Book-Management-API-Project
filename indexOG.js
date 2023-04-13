require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require("body-parser")

// database
const database = require('./database/database');

// models
const BookModel = require('./database/book');
const AuthorModel = require('./database/author');
const PublicationModel = require('./database/publication');

// initialize express
const booky = express();

booky.use(bodyParser.urlencoded({ extended: true }));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, 
 {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true

  // (StackOverflow, Sep. 15, 2021) From the Mongoose 6.0 docs:

  // useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex
  // are no longer supported options. Mongoose 6 always behaves as if 
  // useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and 
  // useFindAndModify is false. Please remove these options from your code. 
}
).then(() => console.log('connection established'));


// GET REQUESTS

// BOOKS

/*
Route           /
Description     get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});
/*
Route           /is
Description     get specific books based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    )

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }
    
    return res.json({ book: getSpecificBook });
});
/*
Route           /c
Description     get specific books based on category
Access          PUBLIC
Parameter       category
Methods         GET
*/
booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }

    return res.json({ book: getSpecificBook });
});
/*
Route           /
Description     get specific books based on language
Access          PUBLIC
Parameter       language
Methods         GET
*/
booky.get("/lang/:language", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for the language of ${req.params.language}`,
        });
    }

    return res.json({ book: getSpecificBook });
});

// AUTHORS

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/author", (req, res) => {
    return res.json({ authors: database.author });
});
/*
Route           /author
Description     get specific authors
Access          PUBLIC
Parameter       id
Methods         GET
*/
booky.get("/author/:id", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.id)
    );

    if (getSpecificAuthor.length === 0) {
        return res.json({
            error: `No author found for the id of ${req.params.id}`,
        });
    }

    return res.json({ author: getSpecificAuthor });
});
/*
Route           /author/book
Description     get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if (getSpecificAuthor.length === 0) {
        return res.json({
            error: `No author found for the book of ${req.params.isbn}`,
        });
    }

    return res.json({ author: getSpecificAuthor });
});

// PUBLICATIONS

/*
Route           /pub
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/pub", (req, res) => {
    return res.json({ publications: database.publications });
});
/*
Route           /pub
Description     get specific publications
Access          PUBLIC
Parameter       id
Methods         GET
*/
booky.get("/pub/:id", (req, res) => {
    const getSpecificPublication = database.publications.filter(
        (publication) => publication.id === parseInt(req.params.id)
    );

    if (getSpecificPublication.length === 0) {
        return res.json({
            error: `No publication found for the id of ${req.params.id}`,
        });
    }

    return res.json({ publication: getSpecificPublication });
});
/*
Route           /pub/book
Description     get all publications based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/pub/book/:isbn", (req, res) => {
    const getSpecificPublication = database.publications.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

    if (getSpecificPublication.length === 0) {
        return res.json({
            error: `No publication found for the book of ${req.params.isbn}`,
        });
    }

    return res.json({ publication: getSpecificPublication });
});

// POST REQUESTS

/*
Route           /book/new
Description     add new books
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/book/new", (req, res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({ books: database.books });
});
/*
Route           /author/new
Description     add new authors
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/author/new", (req, res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({ authors: database.author });
});  
/*
Route           /pub/new
Description     add new publications
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/pub/new", (req, res) => {
    const newPublication = req.body;
    database.publications.push(newPublication);
    return res.json({ publications: database.publications });
});

// PUT REQUESTS

/*
Route           /pub/update/book
Description     update/add new publications
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/pub/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            if(!publication.books.includes(req.params.isbn))
               return publication.books.push(req.params.isbn);
        }
    });

    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({
        books: database.books,
        publications: database.publications,
        message: "Successfully updated publication",
    });
});

// DELETE REQUESTS

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/
booky.delete("/book/delete/:isbn", (req, res) => {
    // which book to be deleted
    // copy each book except the one which is to be deleted
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase;

    return res.json({ books: database.books });
 });

// /*
// Route           /book/delete/author
// Description     delete an author from a book
// Access          PUBLIC
// Parameter       isbn, authorId
// Methods         DELETE
// */
booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // find the book from isbn and delete the author from it
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });

    return res.json({ books: database.books });
 });

/*
Route           /book/delete/author
Description     delete an author from a book and vice versa
Access          PUBLIC
Parameter       isbn, authorId
Methods         DELETE
*/

// find a book and delete an author from it

booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });

    // update the author database
    database.author.forEach((eachAuthor) => {
        if (eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });

    return res.json({
        book: database.books, 
        author: database.author, 
        message: "Author was deleted",
    });
});
 







booky.listen(3000, () => {
    console.log("Server is up and running")
});







const express = require('express');

// database
const database = require('./database');

// initialize express
const booky = express();

// BOOKS

/*
Route           /
Description     get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/", (req, res) => {
    return res.json({ books: database.books });
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





booky.listen(3000, () => {
    console.log("Server is up and running")
});







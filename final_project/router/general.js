const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            res.send(books);
        },6000)})

  //Write your code here
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        const isbn = req.params.isbn;
  res.send(books[isbn])
    },6000)})

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        const author = req.params.author;
        const filteredBooks = Object.values(books).filter(book => book.author === author);

        res.send(filteredBooks);
    },6000)})

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        const title = req.params.title;
        const filteredBooks = Object.values(books).filter(book => book.title === title);

        res.send(filteredBooks);
    },6000)})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        const reviews = book.reviews;
        res.send(reviews);
    } else {
        res.status(404).send("Book not found");
    }
});

module.exports.general = public_users;

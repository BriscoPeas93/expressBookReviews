const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
    const reviewText = req.query.review; // Assuming the review is provided as a query parameter
    const username = req.query.username; // Assuming the username is stored in the session

    if (!isbn || !reviewText || !username) {
        return res.status(400).json({ message: "Invalid request data: " + username });
    }

    const book = books[isbn]; // Assuming ISBN is used as the key in the books object

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews) {
        book.reviews = {}; // Initialize reviews if not present
    }

    // Check if the user already has a review for the same book
    if (book.reviews[username]) {
        // Modify the existing review
        book.reviews[username] = reviewText;
        return res.status(200).json({ message: "Review modified successfully" });
    } else {
        // Add a new review
        book.reviews[username] = reviewText;
        return res.status(201).json({ message: "Review added successfully" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.query.username; // Assuming the username is stored in the session

    if (!isbn || !username) {
        return res.status(400).json({ message: "Invalid request data" });
    }

    const book = books[isbn]; // Assuming ISBN is used as the key in the books object

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Delete the user's review
    delete book.reviews[username];

    res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

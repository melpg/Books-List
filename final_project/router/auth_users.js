const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password); 
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
          username: username 
        }, 'access', { expiresIn: '3h' });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.session?.authorization?.username;
// Check if the user is logged in
if (!username) {
  return res.status(401).json({ message: "User not logged in" });
}
  // Check if ISBN exists in the books database
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Ensure a review is provided in the query
  if (!review) {
    return res.status(400).json({ message: 'Review content is required' });
  }

  // Add or modify the review for the book
  books[isbn].reviews[username] = review;

  // Respond with a success message and the updated reviews for the book
  return res.status(200).json({
    message: `Review by ${username} has been ${books[isbn].reviews[username] ? 'modified' : 'added'}`,
    reviews: books[isbn].reviews,
  });
  
});
// Delete a book review (only if the review belongs to the logged-in user)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session?.authorization?.username;  // Get the logged-in user's username

  // Check if the user is logged in
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Check if ISBN exists in the books database
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Check if the user has a review for this book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "You have not reviewed this book" });
  }

  // Delete the review by the logged-in user
  delete books[isbn].reviews[username];

  // Respond with success message
  return res.status(200).json({
    message: `Review by ${username} has been deleted`,
    reviews: books[isbn].reviews,
  });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

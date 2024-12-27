const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
  // Return error if username or password is missing
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books))
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  res.send(books[isbn])
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author=req.params.author;
  const bookKeys=Object.keys(books);
  const matchingBooks=bookKeys
      .map(key=>books[key])
      .filter(book=>book.author===author);
      if(matchingBooks.length>0){
        res.status(200).json({books:matchingBooks})
      }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title=req.params.title;
  const bookKeys=Object.keys(books);
  const matchingBooks=bookKeys
      .map(key=>books[key])
      .filter(book=>book.title===title);
      if(matchingBooks.length>0){
        res.status(200).json({books:matchingBooks})
      }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  if(books[isbn]){
    const reviews=books[isbn].reviews;
    res.status(200).json({reviews});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Define an async function to get the list of books
const getBooks = async (callback) => {
  // Replace this URL with your API endpoint that provides books data
  const response = await axios.get('http://localhost:5000/'); 
  const books = response.data;

  // Call the callback function with the books data
  callback(books);
};

// Define the callback function
const handleBooks = (books) => {
  console.log("Books fetched successfully:");
  console.log(books);
};

// Call the async function and pass the callback
getBooks(handleBooks);

// Function to get book details by ISBN using Promises
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(`Book with ISBN ${isbn} not found`);
    }
  });
};

// Call the function and handle the result with `.then()` and `.catch()`
const isbn = 2; 
getBookByISBN(isbn)
  .then((bookDetails) => {
    console.log(`Details for book with ISBN ${isbn}:`, bookDetails);
  })
  .catch((error) => {
    console.error(error);
  });


  // Function to get books by author using async-await
const getBooksByAuthor = async (author) => {
  // Simulating asynchronous behavior with a Promise
  return new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter((book) => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject(`No books found for author: ${author}`);
    }
  });
};

// Call the function and handle the result
const fetchBooksByAuthor = async (author) => {
  try {
    const books = await getBooksByAuthor(author);
    console.log(`Books by ${author}:`, books);
  } catch (error) {
    console.error(error);
  }
};

// Test the function with an example author
fetchBooksByAuthor('Chinua Achebe')


// Function to get books by title using async-await
const getBooksByTitle = async (title) => {
  // Simulating asynchronous behavior with a Promise
  return new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter((book) => book.title === title);
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject(`No books found for title: ${title}`);
    }
  });
};

// Call the function and handle the result
const fetchBooksByTitle = async (title) => {
  try {
    const books = await getBooksByTitle(title);
    console.log(`Books by ${title}:`, books);
  } catch (error) {
    console.error(error);
  }
};

// Test the function with an example title
fetchBooksByTitle('The Divine Comedy')



module.exports.general = public_users;

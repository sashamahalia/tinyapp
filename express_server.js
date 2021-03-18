const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
const PORT = 8080; //default port 8080

app.set('view engine', 'ejs');

const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
  
};

const users = {

};

//functions

const getRandomChar = (string) => {
  return Math.floor(Math.random() * string.length);
};

const generateRandomString = (callback) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += chars[callback(chars)];
  }
  return randomString;
}; // apapted from https://www.coderrocketfuel.com/article/generate-a-random-letter-from-the-alphabet-using-javascript

<<<<<<< HEAD
const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
  
};

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
=======
// const getUserByEmail = (reqBody)

const validator = (userProperty, reqBody) => { //userProperty should be a property of the reqBody object, ie id or email, reqBody is the req.body object returned from form submission.
  for (const user in users) {
    if (reqBody[userProperty] === users[user][userProperty]) {
      return false;
    }
  }
  return true;
};

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies['user_id']};
>>>>>>> feature/user-registration
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = { user: req.cookies['user_id'] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.cookies['user_id'] };
  res.render("urls_show", templateVars);
});

//redirects to long url when given shortURl
app.get('/u/:shortURL', (req, res) => {
  const longURl = urlDatabase[req.params.shortURL];
  res.redirect(longURl);
});

app.get('/register', (req, res) => {
  const templateVars = { user: req.cookies['user_id'], valid: true};
  res.render('urls_register', templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = { user: req.cookies['user_id']};
  res.render('urls_login', templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(getRandomChar);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

<<<<<<< HEAD
app.get('/register', (req, res) => {
  res.render('urls_register')
});

//sets cookie on username
=======
//sets cookie on user_id
>>>>>>> feature/user-registration
app.post('/login', (req, res) => {
  if (validator('email', req.body)) { //validator returns true if email doesn't match an email in the user object
    res.sendStatus(403);
    return;
  }
  //refactor to one line if differention isn't needed
  if (validator('password', req.body)) { // validator returns true if password doesn't match a password in the user object
    res.sendStatus(403);
    return;
  }
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString(getRandomChar);
  users[id] = { id, email, password };
  res.cookie('user_id', users[id]);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// updates users object if email and password aren't empty strings, and email doesn't already exist in users object
app.post('/register', (req, res) => {
  if (!req.body['email'] || !req.body['password'] || !validator('email', req.body)) {
    const templateVars = {user: req.cookies['user_id'], valid: false };
    res.render('urls_register', templateVars);
    return;
  }
  if (validator('email', req.body)) {
    const email = req.body.email;
    const password = req.body.password;
    const id = generateRandomString(getRandomChar);
    users[id] = { id, email, password };
    res.cookie('user_id', users[id]);
    res.redirect('/urls');
  }
});

//redirects to page where the long URL can be updated
app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.urlupdate; // make the property value of the short URL be the updated long URL.
  res.redirect(`/urls/${shortURL}`);
});

//deletes a shortURl - longURL pair from urlDatabase
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  console.log('before', urlDatabase[shortURL]);
  delete urlDatabase[shortURL];
  console.log('after', urlDatabase[shortURL]);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

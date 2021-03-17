const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
const PORT = 8080; //default port 8080

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

app.set('view engine', 'ejs');

const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
  
};

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  console.log(templateVars.username);
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

//redirects to long url when given shortURl
app.get('/u/:shortURL', (req, res) => {
  const longURl = urlDatabase[req.params.shortURL];
  res.redirect(longURl);
});

app.get('/register', (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render('urls_register', templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(getRandomChar);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

//sets cookie on username
app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
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
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const { getRandomChar, generateRandomString, validator, getUserByEmail, urlsForUser } = require('./helpers');
const app = express();
app.set('view engine', 'ejs');
const PORT = 8080; //default port 8080

//Middleware
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const urlDatabase = {

};

const users = {

};

//Get routes

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
  if (templateVars.user) {
    templateVars.urls = urlsForUser(templateVars.user['id'], urlDatabase); // returns urls that match user id
  }
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  if (!templateVars.user) {
    res.redirect('/login');
    return;
  }
  res.render('urls_new', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL]['longURL'],
    user: users[req.session.user_id] };
  // console.log(templateVars.user['id']);
  // console.log(urlsForUser(templateVars.user['id']));
  console.log('urldatabase', urlDatabase);
  console.log('users', users);
  if (!templateVars.user || !(urlsForUser(templateVars.user['id'], urlDatabase)[templateVars.shortURL])) {
    res.redirect('/login');
    return;
  }
  res.render("urls_show", templateVars);
});

//redirects to long url when given shortURl
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURl = urlDatabase[shortURL]['longURL'];
  res.redirect(longURl);
});

app.get('/register', (req, res) => {
  const templateVars = { user: users[req.session.user_id], valid: true}; //assumes user info is valid until it is submitted and checked
  if (templateVars.user) {
    templateVars['user'] = users[req.session.user_id];
  }
  res.render('urls_register', templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render('urls_login', templateVars);
});

//Post routes

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(getRandomChar);
  urlDatabase[shortURL] = { longURL: req.body.longURL, user: req.session.user_id }; //adds shortURL as the property, the property value is an object with the long url and user ID
  res.redirect(`/urls/${shortURL}`);
});

//sets cookie on user_id
app.post('/login', (req, res) => {
  if (req.body.email && validator('email', req.body, users)) { //validator returns true if email doesn't match an email in the user object
    res.sendStatus(403);
    return;
  }
  const id = getUserByEmail(req.body.email, users);
  const password = users[id]['password'];
  if (req.body.password && !bcrypt.compareSync(req.body.password, password)) {
    res.sendStatus(403);
    return;
  }
  req.session.user_id = users[id]['id'];
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// updates users object if email and password aren't empty strings, and email doesn't already exist in users object
app.post('/register', (req, res) => {
  if (!req.body['email'] || !req.body['password'] || !validator('email', req.body, users)) {
    const templateVars = { user: users[req.session.user_id], valid: false };
    res.render('urls_register', templateVars);
    return;
  }
  if (validator('email', req.body, users)) {
    const email = req.body.email;
    const id = generateRandomString(getRandomChar);
    const password = bcrypt.hashSync(req.body.password, 10);
    users[id] = { id, email, password };
    req.session.user_id = id;
    console.log('user id cookie', req.session.user_id);
    res.redirect('/urls');
  }
});

//redirects to page where the long URL can be updated
app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/update', (req, res) => {
  const vars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL]['longURL'],
    user: users[req.session.user_id] };
  if (!vars.user || !(urlsForUser(vars.user['id'], urlDatabase)[vars.shortURL])) {
    res.redirect('/login');
    return;
  }
  urlDatabase[vars.shortURL]['longURL'] = req.body.urlupdate; // make the longURL value of the short URL be the updated long URL.
  res.redirect(`/urls/${vars.shortURL}`);
});

//deletes a shortURl - longURL pair from urlDatabase
app.post('/urls/:shortURL/delete', (req, res) => {
  const vars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL]['longURL'],
    user: users[req.session.user_id] };
  if (!vars.user || !(urlsForUser(vars.user['id'], urlDatabase)[vars.shortURL])) {
    res.redirect('/login');
    return;
  }
  delete urlDatabase[vars.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

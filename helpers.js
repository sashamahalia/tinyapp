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

const validator = (userProperty, reqBody, database) => { //userProperty should be a property of the reqBody object, ie id or email, reqBody is the req.body object returned from form submission.
  for (const user in database) {
    if (reqBody[userProperty] === database[user][userProperty]) {
      return false;
    }
  }
  return true;
};

const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (email === database[user]['email']) {
      return database[user]['id'];
    }
  }
};

const urlsForUser = (id, database) => {
  const match = {};
  for (const url in database) {
    if (database[url].user === id) {
      match[url] = database[url];
    }
  }
  return match;
};

module.exports = { getRandomChar, generateRandomString, validator, getUserByEmail, urlsForUser };
const { users } = require('../model/userModel');
const bcrypt = require('bcryptjs');

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

function registerUser({ username, password }) {
  if (findUserByUsername(username)) {
    throw new Error('User already exists');
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = { id: users.length + 1, username, password: hashedPassword };
  users.push(user);
  return { id: user.id, username: user.username };
}

function authenticateUser({ username, password }) {
  const user = users.find(u => u.username === username);
  if (!user) return null;
  const valid = bcrypt.compareSync(password, user.password);
  return valid ? user : null;
}

function getAllUsers() {
  return users.map(u => ({ id: u.id, username: u.username }));
}

function rateUser({ fromUsername, toUsername, score }) {
  const fromUser = users.find(u => u.username === fromUsername);
  const toUser = users.find(u => u.username === toUsername);
  if (!fromUser || !toUser) {
    throw new Error('Usuário não cadastrado');
  }
  if (!toUser.ratings) {
    toUser.ratings = [];
  }
  toUser.ratings.push({ from: fromUsername, score });
  return { fromUsername, toUsername, score };
}

module.exports = { registerUser, authenticateUser, getAllUsers, rateUser };

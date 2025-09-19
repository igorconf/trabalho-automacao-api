const userService = require('../service/userService');
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecret';

function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  try {
    const user = userService.registerUser({ username, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
}

function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  const user = userService.authenticateUser({ username, password });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
}

function getUsers(req, res) {
  res.json(userService.getAllUsers());
}



function rateUser(req, res) {
  const { fromUsername, toUsername, score } = req.body;
  if (!fromUsername || !toUsername || typeof score !== 'number') {
    return res.status(400).json({ error: 'fromUsername, toUsername e score numérico são obrigatórios' });
  }
  try {
    const result = userService.rateUser({ fromUsername, toUsername, score });
    res.status(201).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = { register, login, getUsers, authMiddleware, rateUser };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('adminpass', 8), role: 'admin', active: false },
  { id: 2, username: 'user1', password: bcrypt.hashSync('user1pass', 8), role: 'user', active: false }
];

const secretKey = 'Secret';

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '1h' });
}

function login(req, res) {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user ||!bcrypt.compareSync(password, user.password)) return res.sendStatus(401);

  user.active = true;
  const token = generateToken(user);
  res.json({ token });
}

function logout(req, res) {
  const user = users.find(u => u.id === req.user.id);
  if (user) user.active = false;
  res.sendStatus(200);
}

module.exports = {
  users,
  authenticateToken,
  login,
  logout,
};
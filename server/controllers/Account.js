const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login');
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const settingsPage = (req, res) => {
  res.render('settings');
};

const page404 = (req, res) => {
  res.status(404).render('404');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!(username && pass)) return res.status(400).json({ error: 'All fields are required!' });

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) return res.status(401).json({ error: 'Wrong username or password!' });
    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!(username && pass && pass2)) { return res.status(400).json({ error: 'All fields are required!' }); }

  if (pass !== pass2) { return res.status(400).json({ error: 'Passwords do not match!' }); }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) { return res.status(404).json({ error: 'Username is already in use! ' }); }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const changePassword = async (req, res) => {
  const oldPass = `${req.body.oldPass}`;
  const newPass = `${req.body.newPass}`;

  if (!(oldPass && newPass)) { return res.status(400).json({ error: 'All fields are required!' }); }
  return Account.changePassword(req.session.account._id, oldPass, newPass, (err, account) => {
    if (err || !account) {
      console.log(err);
      return res.status(401).json({ error: 'An error occurred!' });
    }
    return res.json({ message: 'Password updated!' });
  });
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassword,
  page404,
  settingsPage,
};

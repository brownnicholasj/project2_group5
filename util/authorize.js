const loginCheck = (req, res, next) => {
  //placeholder session/login
  if (!req.session.loggedIn) {
    // placeholder path (login) until we get a correct path/view
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = loginCheck;

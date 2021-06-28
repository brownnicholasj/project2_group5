/*
    Redirects the user to the login page if not logged_in
*/
const loginCheck = (req, res, next) => {
  //placeholder session/login
  if (!req.session.logged_in) {
    // placeholder path (login) until we get a correct path/view
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = loginCheck;

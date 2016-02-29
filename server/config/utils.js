// // I'm not sure this file is being used anymore
//
// exports.createSession = function(req, res, newUser) {
//   console.log('creating session', req.session);
//
//   // @regenerate destroys old session if any
//   return req.session.regenerate(function() {
//     req.session.user = newUser;
//   });
// };
//
// exports.isLoggedIn = function(req, res) {
//   return req.session ? !!req.session.user : false;
// };
//
// exports.checkUser = function(req, res) {
//   if (!exports.isLoggedIn(req)) {
//     req.redirect('/users/login');
//   } else {
//     next();
//   }
// };

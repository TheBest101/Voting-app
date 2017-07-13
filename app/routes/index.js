var path = process.cwd()
var PollHandler = require(path + '/app/controllers/pollHandler.server.js')
module.exports = function (app, passport) {

  function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/stranger');
		}
	}
  var pollHandler = new PollHandler();
  app.route('/')
    .get(isLoggedIn, (req,res) => {
      res.redirect('/polls')
    })

  app.route('/polls')
    .get(isLoggedIn, (req,res) => {
      res.sendFile(`${path}/public/home.html`)
    })
    app.route('/pollStranger/vote')
      .get((req,res) => {
        res.sendFile(`${path}/public/pollStranger.html`)
      })
    app.route('/polls/vote')
      .get(isLoggedIn, (req,res) => {
        res.sendFile(`${path}/public/polls.html`)
      })

  app.route('/mypolls')
    .get(isLoggedIn, (req,res) => {
      res.sendFile(`${path}/public/my.html`)
    })

  app.route('/makepolls')
    .get(isLoggedIn, (req,res) => {
      res.sendFile(`${path}/public/create.html`)
    })

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect : '/polls',
        failureRedirect : '/'
    }));
  app.route('/stranger')
    .get((req, res)=>{
      res.sendFile(`${path}/public/stranger.html`)
    })
  app.route('/api')
    .get(pollHandler.getPolls)
  app.route('/api/create')
    .post(isLoggedIn, pollHandler.addPolls)
  app.route('/api/one')
    .get(pollHandler.getOnePoll)
  app.route('/api/vote')
    .get(pollHandler.vote)
  app.route('/api/yours')
    .get(pollHandler.getYours)
  app.route('/api/owner')
    .get(pollHandler.isOwner)
  app.route('/api/delete')
    .get(pollHandler.deleteCollection)
  app.route('/api/option')
    .get(pollHandler.addOption)
};

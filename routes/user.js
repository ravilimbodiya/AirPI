var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/airpidb";

exports.list = function(req, res){
  res.send("respond with a resource");
};

//Check login - called when '/checklogin' POST call given from AngularJS module in login.ejs
exports.checkLogin = function(req, res) {
	if (req.session.user) {
		console.log('validated user');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("home", { user : req.session.user });
	} else {
		var json_responses;
		var email = req.param("email");
		var pass = req.param("password");
		if (!module.parent)
			console.log('authenticating %s:%s', email, pass);

			mongo.connect(mongoURL, function(dbConn) {
				console.log('Connected to mongo at: ' + mongoURL);
				var coll = dbConn.collection('users');
				coll.findOne({ email : email }, function(err1, user) {
					if (user) {
						// This way subsequent requests will know the user is logged in.
						if(user.password === pass){
							console.log("returned true");
							req.session.user = user;
							json_responses = { "statusCode" : 200, user: user };
							res.send(json_responses);
						} else {
							console.log("returned false");
							json_responses = { "statusCode" : 401, "msg" : "Email/password invalid." };
							res.send(json_responses);
						}
					} else {
						console.log("returned false");
						json_responses = { "statusCode" : 401, "msg" : "User not found." };
						res.send(json_responses);
					}
				});
			});
	}
};

exports.redirectToHome = function(req, res){
	res.render("home", {user: req.session.user});
};

exports.register = function(req, res){
	mongo.connect(mongoURL, function() {
		var json_responses;
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.insert({ first_name : req.param('firstName'), last_name : req.param('lastName'), email : req.param('email'), password: req.param('pass'), city: req.param('city')}, function(err1, user) {
			// insert user into db
			console.log("inserting");
			  if(err1){
				  json_responses = { statusCode: 401, title: 'AirPI', alertClass: 'alert-danger', msg: 'Oops! An error occurred. Please try again.' };
				  res.send(json_responses);
				}
				else 
				{
					json_responses = { statusCode: 200, title: 'AirPI', alertClass: 'alert-success', msg: 'Successfully registered. Please Login..' };
					res.send(json_responses);
				}
		});
  });
};

//Logout the user - invalidate the session
exports.logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};
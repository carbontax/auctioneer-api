var User = require('../models/user');
/*
 * GET users listing.
 */

exports.list = function list(req, res){
    User.find({}, function(err, users) {
        if (err) {
            console.log(err);
            return;
        }
        res.send(users);
    });
};

exports.save = function save(req, res) {
    var user = new User({
        username: req.body.username,
        email: req.body.email
    });
    user.save(function(err) {
        if(err) {
          res.statusCode = 403;
          res.send(err.message);
          return console.log(err);
        }
        res.send(user);
    });
};

exports.show = function show(req, res) {
    User.find({username: req.params.username}, function(err, user) {
        if (err) throw err;
        res.send(user);
    });
};

exports.update = function update(req, res) {
    var username = req.body.username;
    console.log("BODY: " + req.body);
    var data = {email: req.body.email};
    User.update({username: username}, data, {multi: false}, function(err, affected) {
        if (err) {
            res.statusCode = 500;
            res.send(err);
            return console.log(err);
        }
        console.log("Rows affected: " + affected);
        res.send("Email updated for " + username);
    });
};

exports.toggleActive = function toggleActive(req, res) {
    var username = req.params.username;
    console.log("USERNAME: " + username);
    var active = req.body.active;
    var data = {'active': active};
    User.update({username: username}, data, {multi: false}, function(err, affected) {
        if (err) {
            res.statusCode = 500;
            res.send('Cannot toggle activation for ' + username);
            return console.log(err);
        }
        console.log("Rows affected: " + affected);
        if (affected !== 1) {
          res.statusCode = 404;
          res.send('Cannot toggle activation. User not found');
          return console.log('NOT FOUND');
        } else {
          res.send("Active set to " + active + " for " + username);
        }
    });
};

exports.deleteUser = function deleteUser(req, res) {
    var username = req.params.username;
    console.log("USERNAME: " + username);
    User.findOne({username: username}, function(err, user) {
        if (err) {
            throw err;
        }
        console.log("found: " + user);
        user.remove(function(err) {
            if (err)  {
                throw err;
            } 
            res.send("ok");
        });
    });
};

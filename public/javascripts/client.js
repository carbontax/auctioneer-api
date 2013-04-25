var User = function User(data) {
    var self = this;
    self.username = ko.observable();
    self.email = ko.observable();
    self.apikey = ko.observable();
    self.active = ko.observable();
    self.startDate;

    if(data) {
      self.loadData(data);
    }
};

User.prototype.loadData = function loadData(data) {
    var self = this;
    self.username(data.username);
    self.email(data.email);
    self.apikey(data.apikey);
    self.active(data.active);
    if(data.startDate) {
      self.startDate = data.startDate;
    }
};

User.prototype.updateUser = function updateUser() {
    var data = ko.toJSON(this);
    $.ajax({
        url: '/users',
        type: 'put',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: data,
        success: function(responseText) {
            humane.log(responseText);
        },
        error: function(xhr) {
            humane.log(xhr.responseText, humane_err_opts);
        }
    });
}

User.prototype.deleteUser = function deleteUser() {
    var url = '/users/' + this.username();
    $.ajax({
        url: url,
        type: 'post',
        data: { '_method': 'delete' }})
    .done(function(responseText) {
        humane.log(responseText);
    })
    .error(function(xhr) {
        humane.log(xhr.responseText, humane_err_opts);
    });
};

User.prototype.toggleActive = function toggleActive() {
  //humane.log(this.active());
    var url = '/users/' + this.username();
    $.ajax({
        url: url,
        type: 'post',
        data: {'_method': 'put', 'active': this.active()},
        success: function(responseText) {
            humane.log(responseText);
            return true;
        },
        error: function(xhr) {
            humane.log(xhr.responseText, humane_err_opts);
            return false;
        }
    });
};

var humane_err_opts = {addnCls: 'humane-error'};

var UserViewModel = function UserViewModel() {
    var self = this;
    self.header = "Users";
    self.newUsername = ko.observable();
    self.newEmail = ko.observable();

    self.users = ko.observableArray([]);

    self.addUser = function() {
        var newUser = {
            username: self.newUsername(),
            email: self.newEmail()
        };
        $.ajax({
            url: '/users',
            type: 'post',
            data: newUser})
        .done(function(data) {
            var u = new User(data);
            humane.log(u.username() + " was created");
            self.newUsername("");
            self.newEmail("");
            self.users.push(u);
        })
        .error(function(xhr) {
            humane.log(xhr.responseText, humane_err_opts);
        });
    };

    $.ajax('/users', {
      success: function(data) {
        var users = $.map(data, function(u) {
          return new User(u);
        });
        self.users(users);
      },
      error: function(xhr) {
        humane.log(xhr.responseText, humane_err_opts);
      }
    });
};

humane.baseCls = 'humane-libnotify';
ko.applyBindings(new UserViewModel());

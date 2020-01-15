var tokens = [
  {
    id: 1,
    username: "admin",
    password: "cGFzc3dvcmQ=",
    token: "cGFzc3dvcmQ=",
    displayName: "Admin",
    emails: [{ value: "admin@homeinventory.com" }]
  }
];

exports.findByToken = function(token, cb) {
  process.nextTick(function() {
    for (var i = 0, len = tokens.length; i < len; i++) {
      var user = tokens[i];
      if (user.token === token) {
        return cb(null, user);
      }
    }
    return cb(null, null);
  });
};

exports.getUser = function(username, password, cb) {
  process.nextTick(function() {
    for (var i = 0, len = tokens.length; i < len; i++) {
      var user = tokens[i];
      if (user.username === username && user.password === password) {
        return cb(null, user);
      }
    }
    return cb(null, null);
  });
};

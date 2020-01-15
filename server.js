require("dotenv").config({ path: ".env.local" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

var passport = require("passport");
var BearerStrategy = require("passport-http-bearer").Strategy;
var LocalStrategy = require("passport-local").Strategy;
var tokens = require("./tokens");

// Configure the Bearer strategy for use by Passport.
//
// The Bearer strategy requires a `verify` function which receives the
// credentials (`token`) contained in the request.  The function must invoke
// `cb` with a user object, which will be set at `req.user` in route handlers
// after authentication.
passport.use(
  new BearerStrategy(function(token, cb) {
    tokens.users.findByToken(token, function(err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      return cb(null, user, { scope: "all" });
    });
  })
);

passport.use(
  new LocalStrategy(function(username, password, cb) {
    tokens.users.getUser(username, password, function(err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      return cb(null, user, { scope: "all" });
    });
  })
);

// Create a new Express application.
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure Express application.
app.use(require("morgan")("combined"));
app.use(passport.initialize());

var port = process.env.PORT || "5000";

app.get("/", function(req, res) {
  res.send("Welcome");
});

app.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ status: "error", code: "unauthorized" });
    } else {
      return res.json({ status: "success", code: "loggedin" });
    }
  })(req, res, next);
});

app.get(
  "/bearer",
  passport.authenticate("bearer", { session: false }),
  function(req, res) {
    res.json(req.user);
  }
);

app.get("/loginError", function(req, res) {
  res.json({
    errors: [
      {
        status: "400",
        detail: "Authentication Failed"
      }
    ]
  });
});

app.listen(port, function() {
  console.log("Passport Authentication Samples is listening on port 5000!");
});

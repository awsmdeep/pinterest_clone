// Import required modules and packages
var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');
const postModel = require('./post');

// Configure passport to use local strategy for authentication
passport.use(new localStrategy(userModel.authenticate()));

// Add express.urlencoded middleware to parse form fields
router.use(express.urlencoded({ extended: true }));

// Route to render the home page
router.get('/', function (req, res, next) {
  res.render('index', { nav: false });
});

// Route to render the registration page
router.get('/register', function (req, res, next) {
  res.render('register', { nav: false });
});

// Route to render the user's profile page
router.get('/profile', isLoggedIn, async function (req, res, next) {
  // Fetch user data and populate posts for rendering the profile page
  const user =
    await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts")
  res.render('profile', { user, nav: true });
});

// Route to render a page showing user's posts
router.get('/show/posts', isLoggedIn, async function (req, res, next) {
  // Fetch user data and populate posts for rendering the posts page
  const user =
    await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts")
  res.render('show', { user, nav: true });
});

// Route to render the feed page with posts from all users
router.get('/feed', isLoggedIn, async function (req, res, next) {
  // Fetch user data and all posts for rendering the feed page
  const user = await userModel.findOne({ username: req.session.passport.user })
  const posts = await postModel.find()
    .populate("user")
  res.render('feeds', { user, posts, nav: true });
});

// Route to render the add post page
router.get('/add', isLoggedIn, async function (req, res, next) {
  // Fetch user data for rendering the add post page
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('add', { user, nav: true });
});

// Route to handle the creation of a new post
router.post('/createpost', isLoggedIn, upload.single("postimage"), async function (req, res, next) {
  // Fetch user data, create a new post, and associate it with the user
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("profile");
});

// Route to handle profile image upload
router.post('/fileupload', isLoggedIn, upload.single("image"), async function (req, res, next) {
  // Fetch user data and update the profile image
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile');
});

// Route to handle user registration
router.post('/register', function (req, res, next) {
  // Create a new user object and register it using passport-local strategy
  var userdata = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
  });

  userModel.register(userdata, req.body.password, function (err, registeredUser) {
    if (err) {
      console.log(err);
      return res.redirect('/register'); // Redirect to registration page on error
    }

    // Authenticate the user and redirect to the profile page upon successful registration
    passport.authenticate('local')(req, res, function () {
      res.redirect('/profile');
    });
  });
});

// Route to handle user login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));

// Route to handle user logout
router.get('/logout', function (req, res) {
  // Logout the user and redirect to the home page
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Middleware function to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;

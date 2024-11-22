//DEPENDENCIES
// npm init -y
// npm install express
// npm install mongoose
// npm install ejs
// npm install nodemon
// npm install express-session

//------------
//HOW TO START: npx nodemon index.js
//http://localhost:3000

//VARIABLES:
//-----------
const express = require("express");
const app = express();

const User = require("./data/user");
const mongoose = require("mongoose"); //allows you to model and structure data with schemas
const bcrypt = require("bcrypt"); //used for hashing passwords securely
const session = require("express-session"); //Will associate information to a particular cookie
//------------              ------------------------
mongoose //mongo database
  .connect("mongodb://localhost:27017/loginDemo", {
    // "loginDemo" is the database name.
    useNewUrlParser: true, // Enables the new MongoDB connection string parser (recommended by MongoDB).
    useUnifiedTopology: true, // Uses the new connection management engine, which helps improve stability and compatibility with MongoDB servers.
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    // Catches and logs any errors if the connection fails.
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.set("view engine", "ejs"); //ejs access
app.set("views", "views"); // sets the directory where your application’s 'views' templates are located.
app.use(session({ secret: "noSecret" })); //used to help keep the user logged in with cookies.

app.use(express.urlencoded({ extended: true })); //give us access to 'req.body'
//----------------------------------                    ------------------------------------------
//MIDDLEWARE:
//----------------------------------                    ------------------------------------------
const requireLogin = (req, res, next) => {
  if (req.session.user_id) {
    next();
  } else {
    return res.redirect("/login");
  }
};
//----------------------------------                    ------------------------------------------
//ROUTES:
//----------------------------------                    ------------------------------------------
// || GET ||
app.get("/register", (req, res) => {
  // http://localhost:3000/register
  //WILL TAKE YOU TO THE REGISTER FORM
  res.render("register");
});

// || POST ||
app.post("/register", async (req, res) => {
  //DATA THAT COMES FROM THE '/register' ROUTE
  const { password, username } = req.body;
  const hash = await bcrypt.hash(password, 12); //encrpyt the password.
  const user = new User({
    username,
    password: hash,
  });
  await user.save(); //save the data.
  req.session.user_id = user_id;
  res.redirect("/"); //move user to a new page.
});

// || GET ||
app.get("/login", (req, res) => {
  // http://localhost:3000/login
  res.render("login");
});

// || POST ||
app.post("/login", async (req, res) => {
  //DATA THAT COMES FROM THE '/login' ROUTE.
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const validPassword = await bcrypt.compare(password, user.password); //allow bcrypt to compare the passwords and see if correct.
  if (validPassword) {
    req.session.user_id = user_id;
    res.redirect("/secret");
  } else {
    res.redirect("/login");
  }
});

// || POST ||
app.post("/logout", (req, res) => {
  //Will log the user out.
  req.session.user_id = null;
  //req.session.destroy(); // another way to remove data from session.
  res.redirect("/login");
});

// || GET ||
app.get("/", (req, res) => {
  // http://localhost:3000/
  res.send("THIS IS THE HOMEPAGE");
});

// || GET ||
app.get("/secret", requireLogin, (req, res) => {
  res.render("secret");
});

//------
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
//

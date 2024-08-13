const express = require('express');
const dotenv = require('dotenv');
const handlebars = require('express-handlebars');
const databaseActions = require("./utils/database");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use(express.static("./views"));
app.use(express.static("./public"));
app.use(express.static("./utils"));
///handebars setup
app.engine("handlebars", handlebars.engine()); //handlebars is construction languae
app.set("view engine", "handlebars"); //handlebar is templating language

///cookie-setup
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  secret: `I'm always angry.`,
  maxAge: 1000 * 60 * 60 * 24 * 7 * 6,
  // resave: false,
  // saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(express.urlencoded({
  extended: false
}));

app.use(csurf({ cookie: false })); 

app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});  


// app.get("/cookies", (req, res) => {
//   if (req.cookies.authenticated != "true") {
//       console.log("cookie isnt authenticated");
//       res.render("cookies", {
//         layout: "main"
//       });
//   } else {
//     res.redirect("/");
//   }
// });


app.get("/", (req, res) => {

  console.log(req.session.id, req.session.isNew, req.session);
  if (req.session.isNew) {
    // If no session exists, set a session ID and send a welcome message
    res.render("frontpage", {
      layout: "main", 
      shouldLogIn: true
    });


    // req.session.id = 'user123'; // This can be any unique identifier


  } else {
    // If session exists, greet the user
    // res.send('Welcome back! You are already logged in.');
    databaseActions
      .getUser(req.cookies.id)
      .then(result => {
        res.send('has user', req.cookies.id);
        res.render("frontpage", {
          layout: "main", 
          shouldLogIn: false,
          name: result.rows[0].username
        });
      
      })
      .catch(err => {
        res.render("frontpage", {
          layout: "main", 
          shouldLogIn: true
        });
    });
   
  }
  
 
 

});


app.post("/cookies",  (req, res) => {
  if (req.body.yes == "") {
    let username = req.body.username;

    console.log("sending to database", req.body, username);
    databaseActions
          .createUser(username)
          .then(result => {
            console.log("cookie authenticated");
            console.log("created user", result.rows[0].username);
            res.cookie("authenticated", "true");
            res.cookie("id", result.rows[0].id); 
            res.render("frontpage", {
              layout: "main",
              name: result.rows[0].username, 
              shouldLogIn: false,
              loader: true
            });
          })
          .catch(err => {
    
            console.log("did not create anything");
            res.render("frontpage", {
              layout: "main", 
              shouldLogIn: true,
              alert: "i dont know u"

            });
          });
    
    
    
  } else {
    // databaseActions
    // .getEveryone()
    // .then(result => {
  
    //   res.render("nofun", {
    //     layout: "destruction",
    //     users: result.rows
    //   });
    
    // })
    // .catch(err => {
    //   res.render("countdown", {
    //     layout: "main"
    // });
    // });
  }
});

app.use((request, response, next) => {
  if (request.cookies.authenticated != "true") {
      response.redirect("/cookies");
      response.send();
      return (url = request.url);
  } else {
      next();
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
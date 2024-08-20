const express = require('express');
const dotenv = require('dotenv');
const handlebars = require('express-handlebars');
const databaseActions = require("./utils/database");
const cors = require("cors");
// const { cloudinary } = require("./utils/cloudinary");
// const webrtc = require("wrtc");
const bodyParser = require("body-parser");
var path = require("path");
const http = require("http");



dotenv.config();
const app = express();
const port = process.env.PORT || 8123;


app.use(express.json());


app.use(express.static("./views"));
app.use(express.static("./public"));
app.use(express.static("./utils"));
///handebars setup
app.engine("handlebars", handlebars.engine()); //handlebars is construction languae
app.set("view engine", "handlebars"); //handlebar is templating language

const server = http.createServer(app);

const roomName = "feedme";
const stun = require("stun");

stun.request("stun.l.google.com:19302", (err, res) => {
  if (err) {
    console.error("stun doesnt work", err);
  } else {
    const { address } = res.getXorAddress();
    console.log("your ip", address);
  }
});

///cookie-setup
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const cookieParser = require("cookie-parser");

app.use(cors());
// app.use(router);
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
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



const io = require('socket.io')(server, { //8123 is the local port we are binding the demo server to
  pingInterval: 30005,		//An interval how often a ping is sent
  pingTimeout: 5000,		//The time a client has to respont to a ping before it is desired dead
  upgradeTimeout: 3000,		//The time a client has to fullfill the upgrade
  allowUpgrades: true,		//Allows upgrading Long-Polling to websockets. This is strongly recommended for connecting for WebGL builds or other browserbased stuff and true is the default.
  cookie: false,			//We do not need a persistence cookie for the demo - If you are using a load balöance, you might need it.
  serveClient: true,		//This is not required for communication with our asset but we enable it for a web based testing tool. You can leave it enabled for example to connect your webbased service to the same server (this hosts a js file).
  allowEIO3: false,			//This is only for testing purpose. We do make sure, that we do not accidentially work with compat mode.
  cors: {
    origin: "*"				//Allow connection from any referrer (most likely this is what you will want for game clients - for WebGL the domain of your sebsite MIGHT also work)
  }
});


//This funciton is needed to let some time pass by between conversation and closing. This is only for demo purpose.
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  

var GameSocketID;

// App Code starts here
io.on('connection', (socket) => {

  socket.join(roomName);
	console.log('[' + (new Date()).toUTCString() + '] game connecting');
	

	socket.on('connect', (data) => {
		console.log('[' + (new Date()).toUTCString() + '] there is a connection ' + socket.id);
    // io.sockets.connected[socket.id].join(roomName);
	});

  socket.on('game_connection', (data) => {
		console.log('[' + (new Date()).toUTCString() + '] gameconnection ' + socket.id);
    GameSocketID = socket.id;
    // io.sockets.connected[socket.id].join(roomName);
	});

  socket.on("hello", (data) => {
		console.log("someone says hi", socket.id, data);
    io.to(GameSocketID).emit('hello', data);
    socket.emit("hello", data);

	});
	socket.on('Goodbye', async (data) => {
		console.log('[' + (new Date()).toUTCString() + '] Client said "' + data + '" - The server will disconnect the client in five seconds. You can now abort the process (and restart it afterwards) to see an auto reconnect attempt.');
		await sleep(5000); //This is only for demo purpose.
		socket.disconnect(true);
	});

	socket.on('disconnect', (data) => {
		console.log('[' + (new Date()).toUTCString() + '] Bye, client ' + socket.id);
	});



 



	});





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

    console.log("has cookie  looks for user", req.cookies.id);

    databaseActions
      .getUser(req.cookies.id)
      .then(result => {
        console.log("has user", result.rows[0].username, req.cookies.id, result.rows[0].id);

        res.render("frontpage", {
          layout: "main", 
          shouldLogIn: false,
          name:  result.rows[0].username
        });
      
      })
      .catch(err => {
        console.log("doesnt know user");

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
            console.log("created user", result.rows[0].username, result.rows[0].id);
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
      // response.redirect("/cookies");
      response.send();
      return (url = request.url);
  } else {
      next();
  }
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser'); //this is going to allow us to access the data that is posted from the form inside of our controller
const Realm = require('realm-web');
//session works in tandem with a cookie, that stores a user id, so session saves sensitive info server side and the cookie id is used to interact with that server data
//later version of express session has cookie parser built in, so no need to install it
const session = require('express-session');
const MongoStore = require('connect-mongo');

const indexRouter = require('./routes/index');
const accessCloudAPIRouter = require('./routes/accessCloudAPI');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// express layouts the ideia is that every file will be put inside this layout file to avoid repeating the begining and end of the layout file
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

//STYLESHEETS, JAVASCRIPT, IMAGES, ... 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

// Create a session for the authenticated user
app.use(
  session({
    secret: process.env.SESSION_KEY, //used create a hash to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_SESSION_URL })
  })
);
//Once set, the value of app.locals properties persist throughout the life of the application, in contrast with res.locals properties 
// that are valid only for the lifetime of the request.
//You can access local variables in templates rendered within the application. This is useful for providing helper functions to templates, 
// as well as application-level data. Local variables are available in middleware via req.app.locals

app.locals.app = new Realm.App({ id: process.env.MONGO_DB_APP_ID });
app.locals.user;

app.use('/', indexRouter);
app.use('/accessCloudAPI', accessCloudAPIRouter);

//no PORT variable in .env file, then use 3000
app.listen(process.env.PORT || 3000);

/**
 * NOT IN USE
 * Replace the placeholders in the url with the username and password
 * @param {*} url The url to connect to a mongodb database
 * @param {*} replacements the username and passord to replace the <username> and <password> placeholders in the url
 * @returns the url with the placeholders replaced
 */
function replaceStringFields(url, replacements) {
  // Loop through the keys (string placeholders) in the replacements object
  Object.keys(replacements).forEach((key) => {
      // Replace each occurrence of the key with its corresponding value in the URL
      url = url.replace(new RegExp(`<${key}>`, 'g'), replacements[key]);
  });
  return url;
}
//TODO 
// VERIFY THAT THIS IS THE CORRECT WAY TO HANDLE A SESSION, IN REGARDS TO A AUTHENTICATED USER
// THAT IS EVERY REALM USER IS CONNECTED TO ONE ATLAS DATABASE USER, WHERE INNITIALLY I WAS THINKING IT SHOULD BE EVERY REALM USER CONNECTED TO ONE ATLAS DATABASE USER
// PERHAPS WE SHOULDNT BE USING MONGO ATLAS FOR THIS
// 
// I TRIED HAVING THE CODE TO SET UP A NEW SESSION INSIDE THE LOGIN PROCESS BUT WAS UNABLE TO DO SO
// https://www.npmjs.com/package/connect-mongo#express-or-connect-integration
//
// NOTE: FOR PRODUCTION STORE CAN BE COMMENTED - the default server-side session storage, store, is purposely not designed for a production environment, resulting in memory leaks not scalling past a single process.
// For production, the session secret should change perdiodicaly

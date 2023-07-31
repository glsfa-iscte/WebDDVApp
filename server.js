if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
/*
TODO:
    CREATE A NEW ROUTE AND A NEW VIEW FOR THE ACCESS TO THE CLOUDC 
    GET DRONE ACCESS PAGE WORKING
    MOVE THE HTML/EJS SCRIPTS TO PUBLIC/SCRIPTS.JS
    COMMIT TO HEROKU
    CHECK AND UNDERSTAND REALM WEB SDK AUTHENTICATION TO CHECK THE APP.CURRENTUSER.ID AND USER.ID
*/

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser'); //this is going to allow us to access the data that is posted from the form inside of our controller
const Realm = require('realm-web');

const indexRouter = require('./routes/index');
const authenticationRouter = require('./routes/authentication');
const accessCloudAPIRouter = require('./routes/accessCloudAPI');

//TODO CHECK MORE OF THIS
//This is related to sending data client side, ZOD LIBRARY SHOULD BE LOOKED INTO 
//Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
//Helmet is a collection of several smaller middleware functions that set security-related HTTP response headers.
//https://expressjs.com/en/advanced/best-practice-security.html
//const helmet = require('helmet')
//app.use(helmet())

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// express layouts the ideia is that every file will be put inside this layout file to avoid repeating the begining and end of the layout file
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
//STYLESHEETS, JAVASCRIPT, IMAGES, ... 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))


//this is not needed due to:
//-> connection to the database is handled at login
//-> this would only be for a data services 
//   - not the access to the app client (The App client is the interface to the Atlas App Services backend. It provides access to the authentication functionality and functions.) a user added thru realm

//const mongoose = require('mongoose');
//mongoose.connect(process.env.DATABASE_URL)

//const db = mongoose.connection;
//db.on('error', error => console.error(error));
//db.once('open', () => console.log('Connected to Mongoose'));

//MOVED FROM AUTHENTICATION TO SERVER.JS
app.locals.app = new Realm.App({ id: process.env.MONGO_DB_APP_ID });
app.locals.user;

//authentication router could be set to just / 
app.use('/', indexRouter);
app.use('/authentication', authenticationRouter);
app.use('/accessCloudAPI', accessCloudAPIRouter);

app.listen(process.env.PORT || 3000);
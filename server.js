if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const Realm = require('realm-web');
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
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// Create a session middleware with the given options, 
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_SESSION_URL })
  })
);
//app.locals properties persist throughout the life of the application, in contrast with res.locals properties 
app.locals.app = new Realm.App({ id: process.env.MONGO_DB_APP_ID });

app.use('/', indexRouter);
app.use('/accessCloudAPI', accessCloudAPIRouter);

//no PORT variable in .env file, then use 3000
app.listen(process.env.PORT || 3000);
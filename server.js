if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser'); //this is going to allow us to access the data that is posted from the form inside of our controller

const indexRouter = require('./routes/index');
const researchersRouter = require('./routes/researchers');
const authenticationRouter = require('./routes/authentication');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/', indexRouter);
app.use('/authentication', authenticationRouter);
//whats going to happen here is that any route that starts with /researchers is going to be handled by the researchersRouter, 
//which is the researchers.js, where we have all the routes for the researchers.
app.use('/researchers', researchersRouter);

app.listen(process.env.PORT || 3000);
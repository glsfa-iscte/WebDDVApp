const express = require('express');
const router = express.Router();
const Realm = require('realm-web');

router.get('/', (req, res) => {
    //render our index view
    res.render('index');
});

//USER AUTHENTICATION
//All routes in this file start with /authentication
// these are the routes to render the authentication pages
router.get('/login', (req, res) => {
    res.render('authentication/login');
});

router.get('/signUp', (req, res) => {
    res.render('authentication/signUp');
});

router.get('/logout', async (req, res) => {
    const app = req.app.locals.app;

    await app.currentUser.logOut();
    res.redirect('/');

    listUsers(app);
});
    

// these are the routes to handle the authentication
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const app = req.app.locals.app;
    console.log(email, password);
    try {
        req.app.locals.user = await loginEmailPassword(email, password, app);
        res.redirect('/');
        
    } catch (error) {
        console.error('Failed to login', error);
        res.render('login',
         { 
            errorMessage: `Failed to login: ${error.error}`,
            email: email
        });
    }
    listUsers(app);
});

router.post('/signUp', async (req, res) => {
    const { email, password } = req.body;
    const app = req.app.locals.app;
    try {
        const user = await app.emailPasswordAuth.registerUser({ email, password });
        res.redirect('/login');
    } catch (error) {
        console.error('Failed to sign up', error);
        res.render('signUp', 
        { 
            errorMessage: `Failed to sign up: ${error.error}`,
            email: email 
        });
    }
});

async function loginEmailPassword(email, password, app) {
    // Create an email/password credential
    const credentials = Realm.Credentials.emailPassword(email, password);
    // Authenticate the user
    const user = await app.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    console.assert(user.id === app.currentUser.id);
    return user;
  }

// Used for debug purposes
// This list includes all users that have logged in to the client app regardless of whether they are currently authenticated.
function listUsers(app) {
    // Get an object with all Users, where the keys are the User IDs
    console.log("1------")
    for (const userId in app.allUsers) {
        const user = app.allUsers[userId];
        console.log(
            `User with id ${user.id} is ${user.isLoggedIn ? "logged in" : "logged out"
            }`
        );
    }
    console.log("2------")
}

module.exports = router;
const express = require('express');
const router = express.Router();
const Realm = require('realm-web');

router.get('/', (req, res) => {
    let email = req.session.email;
    if(!email){
        console.log("No email in session")
        email = null
    }
    //render our index view
    console.log("EMAIL: " + req.session.email);
    console.log("PASSWORD: " + req.session.password);
    console.log(req.sessionID)
    /*
    if(req.session.user != null && req.app.locals.app.currentUser == null){
        try {
            if(req.app.locals.app.currentUser == null)
                console.log("Current app user is null")
            //req.app.locals.app.switchUser(req.session.user);
            console.log("Setting current user to session user");
            console.log("Current user id: " +  req.app.locals.app.currentUser.id);
        } catch (error) {
            console.log("Failed to set current user to session user: " + error);
        }   
    }
    */
    if(req.app.locals.app.currentUser != null){console.log("Current user id: " +  req.app.locals.app.currentUser.id)}
    if(req.session.user != null){console.log("Session user id: " +  req.session.user.id)}
    res.render('index', { email: email });
});

//USER AUTHENTICATION
// these are the routes to render the authentication pages
router.get('/login', (req, res) => {
    res.render('authentication/login');
});

router.get('/signUp', (req, res) => {
    res.render('authentication/signUp');
});

router.get('/logout', async (req, res) => {
    //TODO this should first set the current user to the user thats logged in in the session and then log out the user, but its not working
    const app = req.app.locals.app;
    
    console.assert(app.currentUser != null && req.session.user.id === app.currentUser.id);
    // set the realm current user to the session user
    //app.switchUser(req.session.user);
    await app.currentUser.logOut();
    //res.redirect('/');

    listUsers(app);
    // Clear the session to remove the email
    req.session.destroy();
    res.redirect('/');
});


// these are the routes to handle the authentication
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const app = req.app.locals.app;
    console.log(email, password);
    try {
        const user = await loginEmailPassword(email, password, app);
        //This was changed to session variable to prevent incorrect app behaviour with multiple users accessing the app
        //req.app.locals.user = await loginEmailPassword(email, password, app);
        req.session.user = user;
        // Store the email and password in the session
        req.session.email = email;
        req.session.password = password;
        //req.session.save();

        res.redirect('/accessCloudAPI');
    } catch (error) {
        console.error('Failed to login', error);
        res.render('authentication/login',
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
        res.render('authentication/signUp',
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
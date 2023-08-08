const express = require('express');
const router = express.Router();
const Realm = require('realm-web');

router.get('/', (req, res) => {
    const app = req.app.locals.app;
    //render our index view
    console.log("EMAIL: " + req.session.email + " PASSWORD: " + req.session.password + " SESSION ID: " + req.sessionID);
    if (req.app.locals.app.currentUser != null) { console.log("Current user id: " + req.app.locals.app.currentUser.id) }
    if (req.session.user != null) {
        console.log("Session user id: " + req.session.user.id + " Session user state: |" + req.session.user.state + "|")
        //IF THE REALM APP USERS DIC IS EMPTY, OR THERE IS A SESSION USER AND THAT SESSION USER IS NOT IN THE REALM APP
        //Safer to destroy the session and ask the user to login again
        //WASNT WORKING, when current user logs out and another is selected as the current user this bugs and crashes the app JSON.stringify(app.allUsers) === "{}" || 
        if (req.session.user && !app.allUsers[req.session.user.id]) {
            console.log("DESTROYING SESSION: Session user not in realm app users dic")
            //CODE TO CLOSE THE SESSION
            req.session.destroy();
            res.redirect('/');
            return;
        } else {
            for(user in app.allUsers){
                console.log("User id: " + user.id + " User state: |" + user.state + "|")
            }
            switchCurrentUser(app, req.session.user.id)
        }
        console.log("--- Realm Users ---")
        listAllUserAccounts(app)
        console.log("--- ---")
    }
    res.render('index', { email: req.session.email });
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
    console.log("Logging out")
    const app = req.app.locals.app;

    switchCurrentUser(app, req.session.user.id)
    // Clear the session to remove the email
    req.session.destroy();
    await app.currentUser.logOut();
    if (app.currentUser != null) {
        console.log("Current user id: " + app.currentUser.id)
    }
    res.redirect('/');
});


// these are the routes to handle the authentication
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const app = req.app.locals.app;
    console.log(email, password);
    try {
        req.session.user = await loginEmailPassword(email, password, app);
        // Store the email and password in the session
        req.session.email = email;
        req.session.password = password;
        
        res.redirect('/accessCloudAPI');
    } catch (error) {
        console.error('Failed to login', error);
        res.render('authentication/login',
            {
                errorMessage: `Failed to login: ${error.error}`,
                email: email
            });
    }
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

/**
 * Get an object with all Users, where the keys are the User IDs
 * @param {*} app the realm app
 */
function listAllUserAccounts(app) {
    for (const userId in app.allUsers) {
        const user = app.allUsers[userId];
        console.log(
            `User with id ${user.id} is ${user.isLoggedIn ? "logged in" : "logged out"
            }`
        );
    }
}

/**
 * Returns the user with the given id from the app.allUsers dictionary
 * @param {*} app the realm app
 * @param {*} sessionUserId the id of the user to get from the app.allUsers dictionary
 * @returns 
 */
function getUserById(app, sessionUserId) {
    return app.allUsers[sessionUserId];
}

/**
 * Switches the realm app current user to the session user
 * @param {*} app the realm app
 * @param {*} sessionUserId the id of the user to get from the app.allUsers dictionary
 */
function switchCurrentUser(app, sessionUserId) {
    const user = getUserById(app, sessionUserId);
    console.log("User id found!!: " + user.id + " Is this user the current user?" + (user.id === app.currentUser.id));
    //If the session user its not the current, switch to the session user
    if (user.id !== app.currentUser.id) {
        try {
            console.log("Switching user to session user");
            app.switchUser(user);
        } catch (error) {
            console.log("Error switching user: " + error);
        }
    }
    console.log()
}
module.exports = router;
const express = require('express');
const router = express.Router();
const Realm = require('realm-web');

router.get('/', (req, res) => {
    const app = req.app.locals.app;
    //render our index view
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

/**
 * Login get route
 */
router.get('/login', (req, res) => {
    res.render('authentication/login');
});

/**
 * Logout get route switch the current user to the session user and destroy the session and log out the realm current user
 */
router.get('/logout', async (req, res) => {
    const app = req.app.locals.app;
    //Switch the current user to the session user
    switchCurrentUser(app, req.session.user.id)
    //Clear the session to remove the email, password and user
    req.session.destroy();
    //Log out the realm current user
    await app.currentUser.logOut();
    res.redirect('/');
});

/**
 * Sign up get route
 */
router.get('/signUp', (req, res) => {
    res.render('authentication/signUp');
});

/**
 * Forgot password route
 */
router.get('/forgotPassword', (req, res) => {
    res.render('authentication/forgotPassword');
});

/**
 * Forgot password confirmation route
 */
router.get('/forgotPasswordConfirmation', (req, res) => {
    res.render('authentication/forgotPasswordConfirmation');
});

/**
 * Reset password route, accessed from the reset password email, requested by the user
 */
router.get('/resetPassword', (req, res) => {
    res.render('authentication/resetPassword');
});

/**
 * Login post route get the email and password from the body and login the user in realm, which makes it the current user and sets the session user variables
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const app = req.app.locals.app;
    
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

/**
 * Sign up post route get the email and password from the body and sign up the user in realm
 */
router.post('/signUp', async (req, res) => {
    const { email, password } = req.body;
    const app = req.app.locals.app;
    try {
        await app.emailPasswordAuth.registerUser({ email, password });
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

/**
 * Forgot password post route gets the email from the body and send a reset password email to the user, using realm sdk method that sends a reset email to a user
 */
router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;
    const app = req.app.locals.app;
    try {
        await app.emailPasswordAuth.sendResetPasswordEmail({ email });
        res.render('/forgotPasswordConfirmation', { email: email });
    } catch (error) {
        console.error('Failed to send reset password email', error);
        res.render('authentication/forgotPassword',
            {
                errorMessage: `Failed send reset password email: ${error.error}`,
                email: email
            });
    }
});

router.post('/resetPassword', async (req, res) => {
    // Get the token and tokenId from the URL
    const password = req.body.password;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const tokenId = params.get("tokenId");
    //if (!token || !tokenId) {
    //    throw new Error(
    //        "You can only call resetPassword() if the user followed a confirmation email link"
    //    );
    //}
    try {
        await app.emailPasswordAuth.resetPassword({
            password: password,
            token,
            tokenId,
        });
        res.redirect('/login');
    } catch (error) {
        console.error('Failed to reset password', error);
        res.render('authentication/forgotPassword',
            {
                errorMessage: `Failed reset password: ${error.error}`,
                email: email
            });
    }
});

/**
 * Login in realm app with email and password
 * @param {*} email the email to login
 * @param {*} password the password to login
 * @param {*} app the realm app
 * @returns the logged in user
 */
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
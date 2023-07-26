const express = require('express');
const router = express.Router();
const Realm = require('realm-web');

// Add your App ID
global.app = new Realm.App({ id:'application-0-vtkwx' });
global.user;

async function loginEmailPassword(email, password) {
    // Create an email/password credential
    const credentials = Realm.Credentials.emailPassword(email, password);
    // Authenticate the user
    const user = await app.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    console.assert(user.id === app.currentUser.id);
    return user;
  }
  
  
//All routes in this file start with /authentication
// these are the routes to render the authentication pages
router.get('/login', (req, res) => {
    res.render('authentication/login');
});

router.get('/signUp', (req, res) => {
    res.render('authentication/signUp');
});

router.get('/logout', async (req, res) => {
    await user.logOut();
    res.redirect('/');
});
    

// these are the routes to handle the authentication
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        user = await loginEmailPassword(email, password);
        res.redirect('/');
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
    try {
        const user = await app.emailPasswordAuth.registerUser({ email, password });
        res.redirect('/authentication/login');
    } catch (error) {
        console.error('Failed to sign up', error);
        res.render('authentication/signUp', 
        { 
            errorMessage: `Failed to sign up: ${error.error}`,
            email: email 
        });
    }
});
module.exports = router;
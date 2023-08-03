const express = require('express');
const router = express.Router();
const Realm = require('realm-web');

router.get('/', (req, res) => {
    const EMAIL = req.session.email;
    const PASSWORD = req.session.password;
    console.log("EMAIL: " + EMAIL);
    console.log("PASSWORD: " + PASSWORD);
    const configData = {
        APP_ID: process.env.APP_ID,
        APP_KEY: process.env.APP_KEY,
        LICENSE: process.env.LICENSE,
        MQTT_ADDRESS: process.env.MQTT_ADDRESS,
        EMAIL: EMAIL,
        PASSWORD: PASSWORD
    }
    res.render('accessCloudAPI', { configData: configData });
});


module.exports = router;
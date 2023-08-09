const express = require('express');
const router = express.Router();

/**
 * the get route for the accessCloudAPI page
 */
router.get('/', (req, res) => {
    const EMAIL = req.session.email;
    const PASSWORD = req.session.password;
    const configData = {
        APP_ID: process.env.APP_ID,
        APP_KEY: process.env.APP_KEY,
        LICENSE: process.env.LICENSE,
        MQTT_ADDRESS: process.env.MQTT_ADDRESS,
        EMAIL: EMAIL,
        PASSWORD: PASSWORD
    }
    res.render('accessCloudAPI', { configData: configData, email: EMAIL });
});

module.exports = router;
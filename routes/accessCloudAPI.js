const { APP_ID, APP_KEY, LICENSE, MQTT_ADDRESS } = require('../config');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const EMAIL = res.locals.emailAddress;
    const PASSWORD = res.locals.password;
    res.render('accessCloudAPI', { APP_ID, APP_KEY, LICENSE, MQTT_ADDRESS, EMAIL, PASSWORD });
});


module.exports = router;
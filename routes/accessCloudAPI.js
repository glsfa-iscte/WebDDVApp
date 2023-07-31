const { APP_ID, APP_KEY, LICENSE, MQTT_ADDRESS, USER, PASSWORD } = require('../config');
const express = require('express');
const router = express.Router();
const Realm = require('realm-web');

router.get('/', (req, res) => {
    res.render('accessCloudAPI', { APP_ID, APP_KEY, LICENSE, MQTT_ADDRESS, USER, PASSWORD });
});


module.exports = router;
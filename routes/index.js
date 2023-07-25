const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //render our index view
    res.render('index');
});

router.get('/login', (req, res) => {  
    res.render('login');
});

module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //render our index view
    res.render('index');
});
module.exports = router;
const express = require('express');
const router = express.Router();
const Researcher = require('../models/researcher');

//all researchers route
router.get('/', async (req, res) => {
    //render our index view
    try {
        const researchers = await Researcher.find({});
        res.render('researchers/index', { researchers: researchers });
    } catch {
        res.redirect('/');
    }
    
});

//new researcher route
router.get('/new', (req, res) => {
    res.render('researchers/new', { researcher: new Researcher() });
});

//create researcher route
router.post('/', async (req, res) => {
    const researcher = new Researcher({
        name: req.body.name
    });
    
    try {
        //things in mondo db are done assyncronously so we need to wait for that assyn c all to be done
        const newResearcher = await researcher.save();
        //res.redirect(`researchers/${newResearcher.id}`);
        res.redirect(`researchers`);
    }catch(err){
        console.log(err);
        res.render('researchers/new', {
            researcher: researcher,
            errorMessage: 'Error creating Researcher'
        })
    }

    /*
    await researcher.save()
        .then(() => {
            //res.redirect(`researchers/${newResearcher.id}`);
            res.redirect(`researchers`);
        })
        .catch(err => {
            //if there is an error it passes the researcher object back to the old view
            console.log(err);
            res.render('researchers/new', {
                researcher: researcher,
                errorMessage: 'Error creating Researcher'
            })
        });
        */
        
});


module.exports = router;
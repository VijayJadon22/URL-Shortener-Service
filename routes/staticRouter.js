const express = require('express');
const URL = require('../models/url');

const router = express.Router();

router.get('/', async (req, res) => {
    const url = await URL.find({});
    return res.status(200).render('home', { url: url });
})

module.exports = router;
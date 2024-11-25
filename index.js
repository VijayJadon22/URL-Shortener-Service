const express = require('express');
const { connectToMongoDB } = require("./config");
const path = require('path');
const URL = require('./models/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');

const app = express();
const PORT = 5700;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set the view engine as ejs
app.set('view engine', "ejs");
app.set('views', path.resolve('./views'));

app.use('/url', urlRoute);
app.use('/', staticRoute);

app.get('/test', async (req, res) => {
    let allURLS = await URL.find({});
    return res.render('home', {
        urls: allURLS
    });
})

app.get('/url/:shortId', async (req, res) => {
    try {
        const shortID = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            { shortId: shortID }, //filter
            {
                // update
                $push: {
                    visitHistory: {
                        timestamp: Date.now()
                    }
                }
            },
            { new: true }// Return the updated document
        );
        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Error: ", error);
    }

})

app.use((req, res) => {
    return res.status(400).send("Api not found");
})

app.listen(PORT, () => {
    console.log(`Server Started At Port: ${PORT}`);
    connectToMongoDB().then(() => console.log("MongoDB connected"));
});
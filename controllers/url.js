const shortid = require('shortid');
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    // Check if the URL is provided
    if (!body.url) {
        return res.status(400).send({ error: "URL is required" });
    }
    // Generate a new short ID
    const shortID = shortid.generate();
    try {
        // Create a new URL document in the database
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
        });

        const url = await URL.find({});

        return res.render('home', { id: shortID, url });
        // Send the generated short ID in the response
        // return res.status(200).send({ id: shortID });
    } catch (error) {
        console.error("Error creating short URL:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}


async function handleGetAnalytics(req, res) {
    try {
        console.log("inside func");
        const shortId = req.params.shortId;

        // Find the URL entry by shortId
        const entry = await URL.findOne({ shortId });

        // If no entry is found, send a 404 response
        if (!entry) {
            return res.status(404).send({ error: "No URL found for the given ID" });
        }

        // Send the analytics data with total clicks
        return res.status(200).send({
            analytics: entry.visitHistory,
            totalClicks: entry.visitHistory.length
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}


module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
};
const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl')
const app = express();
const PORT = process.env.PORT || 3000;

// mongodb://localhost/urlShortener
mongoose.connect('mongodb+srv://admin-aniket:test-123@cluster0.nvsdw.mongodb.net/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', async function (req, res) {
    const shortUrls = await ShortUrl.find()
    res.render("index", { shortUrls: shortUrls });
});

app.post('/shortUrls', async function (req, res) {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
});

app.get('/:shortUrl', async function (req, res) {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
});

app.listen(PORT, function (req, res) {
    console.log(`Server Running at port ${PORT}`);
});
const express = require('express');
const fs = require('fs');
const shortId = require('shortid'); 
const ShortUrl = require('./models/shortUrl');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Function to save a short URL to the CSV file
function saveShortUrl(shortUrl) {
  const csvRow = `${shortUrl.full},${shortUrl.short},${shortUrl.clicks}\n`;

  fs.appendFile('shorturls.csv', csvRow, { flag: 'a+' }, (err) => {
    if (err) {
      console.error('Error saving short URL:', err);
    } else {
      console.log('Short URL saved successfully!');
    }
  });
}

app.get('/', async (req, res) => {
  fs.readFile('shorturls.csv', 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading short URLs:', err);
      return res.sendStatus(500);
    }

    const rows = data.trim().split('\n');
    const shortUrls = rows.map((row) => {
      const [full, short, clicks] = row.split(',');
      return {
        full,
        short,
        clicks: parseInt(clicks),
      };
    });

    res.render('index', { shortUrls });
  });
});

app.post('/shortUrls', async (req, res) => {
  const newShortUrl = {
    full: req.body.fullUrl,
    short: req.body.customShortUrl || shortId.generate(),
    clicks: 0,
  };

  saveShortUrl(newShortUrl);

  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  fs.readFile('shorturls.csv', 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading short URLs:', err);
      return res.sendStatus(500);
    }

    const rows = data.trim().split('\n');
    const shortUrls = rows.map((row) => {
      const [full, short, clicks] = row.split(',');
      return {
        full,
        short,
        clicks: parseInt(clicks),
      };
    });

    const shortUrl = shortUrls.find((url) => url.short === req.params.shortUrl);
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    saveShortUrl(shortUrl);

    res.redirect(shortUrl.full);
  });
});

app.listen(process.env.PORT || 5005);

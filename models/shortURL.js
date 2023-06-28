const fs = require('fs');
const shortId = require('shortid');

// Function to save a short URL to the CSV file
function saveShortUrl(shortUrl) {
  fs.readFile('shorturls.csv', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading short URLs:', err);
      return;
    }

    const rows = data.trim().split('\n');
    const existingUrls = rows.map((row) => {
      const [full] = row.split(',');
      return full;
    });

    if (existingUrls.includes(shortUrl.full)) {
      console.log('Short URL already exists:', shortUrl.full);
      return;
    }

    const csvRow = `${shortUrl.full},${shortUrl.short},${shortUrl.clicks}\n`;

    fs.appendFile('shorturls.csv', csvRow, { flag: 'a+' }, (err) => {
      if (err) {
        console.error('Error saving short URL:', err);
      } else {
        console.log('Short URL saved successfully!');
      }
    });
  });
}

// Create the CSV file if it doesn't exist
function createCSVFile() {
  fs.open('shorturls.csv', 'a+', (err) => {
    if (err) {
      console.error('Error creating CSV file:', err);
    } else {
      console.log('CSV file created successfully!');
    }
  });
}

// Check if the CSV file exists and create it if necessary
function initialize() {
  fs.access('shorturls.csv', fs.constants.F_OK, (err) => {
    if (err) {
      createCSVFile();
    }
  });
}

// Initialize the short URL system
initialize();

module.exports = {
  saveShortUrl,
};

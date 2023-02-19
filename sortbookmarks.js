const fs = require('fs');
const path = require('path');
const { parse } = require('url');
const cheerio = require('cheerio');

// Path to bookmarks file
const BOOKMARKS_FILE = 'bookmarks.html';

// Read bookmarks HTML file
const bookmarksHTML = fs.readFileSync(BOOKMARKS_FILE, 'utf-8');
console.log(`Read bookmarks from ${BOOKMARKS_FILE}`);

// Parse bookmarks HTML using cheerio
const $ = cheerio.load(bookmarksHTML);

// Create an object to keep track of DTs by hostname
const dtByHostname = {};

// Iterate over all the bookmark links
$('a').each((i, el) => {
  const href = $(el).attr('href');
  if (href.startsWith('http')) {
    const { hostname } = parse(href);
    const hostnameParts = hostname.split(".");
    const dtText = hostnameParts.slice(-2)[0];
    const title = $(el).text();
    
    // Get or create the DT for the hostname
    let dt = dtByHostname[hostname];
    if (!dt) {
      // Create a new DT for the hostname
      dt = $('<DT>');
      dtByHostname[hostname] = dt;

      // Create a new H3 for the DT
      const h3 = $('<H3>');
      h3.attr('ADD_DATE', Date.now());
      h3.attr('LAST_MODIFIED', Date.now());
      h3.text(dtText);
      dt.append(h3);

      // Add the new DT to the bookmarks
      $('DL').first().append(dt);
    }

    // Create a new A for the bookmark
    const a = $('<A>');
    a.attr('HREF', href);
    a.attr('ADD_DATE', Date.now());
    a.attr('LAST_MODIFIED', Date.now());
    a.text(title);

    // Add the new A to the DT
    dt.append(a);
  }
});

//Make dist folder if it doesn't exist
const DIST_DIR = './dist';
if (!fs.existsSync(DIST_DIR)){
    fs.mkdirSync(DIST_DIR);
}

// Write the sorted bookmarks to a new file
const SORTED_BOOKMARKS_FILE = './dist/sorted.html';
fs.writeFileSync(SORTED_BOOKMARKS_FILE, $.html(), 'utf-8');
console.log(`Sorted bookmarks saved to ${SORTED_BOOKMARKS_FILE}`);

const fs = require('fs');
const babel = require('babel-core');
const discoverEvents = require('./discoverEvents'); 


// read the filename from the command line arguments
const fileName = process.argv[2];

// read the code from this file
fs.readFile(fileName, (err, data) => {
  if (err) {
    throw err;
  }

  // convert from a buffer to a string
  const src = data.toString();

  discoverEvents(src);
});
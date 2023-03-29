
//import fetch from 'node-fetch';
// import fileURLToPath from 'url';
import express from 'express';
import history from 'connect-history-api-fallback'
//import path from 'path';
import __dirname from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

//const moduleUrl = 'https://localhost/router.js';
//const moduleCode = await fetch(moduleUrl).then(res => res.text());
//eval(moduleCode);
//const express = require('express');
const app = express();

// Define a middleware function to redirect to the root URL
// app.use((req, res, next) => {
//   if (res.statusCode === 404) {
//     res.redirect('/');
//   } else {
//     next();
//   }
// });
app.use(express.static('public'));

// Use connect-history-api-fallback middleware to redirect all requests to the SPA's index.html file
app.use(history({
  verbose: true
}));

// Middleware to handle 404 errors and redirect them to the SPA's index.html file
app.use((req, res, next) => {
  const indexFile = path.resolve(__dirname, 'public', 'index.html');
  res.status(404).sendFile(indexFile);
  res.status(500).sendFile(indexFile);
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});
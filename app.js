
//import fetch from 'node-fetch';
//import fileUrl from 'file-url';
import fileURLToPath from 'url';
import express from 'express';
import history from 'connect-history-api-fallback'
import path from 'path';
//var path = import ('path');
//import __dirname from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//const path = require('path');


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
app.use(express.static(path.join(__dirname + '/public')));



app.get('*', function(req, res){
    //res.redirect('/');
    res.status(404).redirect('/');
    //res.send(res.redirect('/'), 404);
  });
  

// Use connect-history-api-fallback middleware to redirect all requests to the SPA's index.html file
app.use(history({
  verbose: true,
  index: 'index.html',
  // Call this function on errors
  onErrors: (err, req, res, next) => {
    // Check if the error is a 404 error
    res.status(404).send('what???');
    if (err.statusCode === 404) {
      // Redirect to the home page
      req.redirect('/');
    } else {
      // If it's not a 404 error, let the default handler handle it
      next();
    }
  }
}));

// Middleware to handle 404 errors and redirect them to the SPA's index.html file
// app.use((req, res, next) => {
//     if (res.status === 404) {
//         console.log(statusCode);
//         //res.redirect('/');
//         resolve(__dirname, 'public', '/');
//       } 
//       next();
//   const indexFile = path.resolve(__dirname, 'public', '/');
//   res.status(404).sendFile(indexFile);
//   res.status(500).sendFile(indexFile);

// });

// app.use(express.static(path.join(__dirname, 'public')));

// // Middleware to handle 404 errors and redirect them to the SPA's index.html file
// app.use((req, res, next) => {
//   if (res.statusCode === 404) {
//     const indexFile = path.resolve(__dirname, 'public', 'index.html');
//     res.sendFile(indexFile);
//   } else {
//     next();
//   }
// });

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});
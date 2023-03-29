
// //import fetch from 'node-fetch';
// // import fileURLToPath from 'url';
// import express from 'express';
// import history from 'connect-history-api-fallback'
// import path from 'path';
// import __dirname from 'path';

// //const path = require('path');


// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = dirname(__filename);

// //const moduleUrl = 'https://localhost/router.js';
// //const moduleCode = await fetch(moduleUrl).then(res => res.text());
// //eval(moduleCode);
// //const express = require('express');
// const app = express();

// // Define a middleware function to redirect to the root URL
// // app.use((req, res, next) => {
// //   if (res.statusCode === 404) {
// //     res.redirect('/');
// //   } else {
// //     next();
// //   }
// // });
// app.use(express.static('public'));
// //app.use(express.static('public'));



// app.get('*', function(req, res){
//     //res.redirect('/');

//     res.status(404).redirect('/');

//     //res.send(res.redirect('/'), 404);
//   });
  

// // Use connect-history-api-fallback middleware to redirect all requests to the SPA's index.html file
// // app.use(history({
// //   verbose: true,
// //   index: 'index.html',
// //   // Call this function on errors
// //   onErrors: (err, req, res, next) => {
// //     // Check if the error is a 404 error
// //     //res.status(404).send('what???');
// //     if (err.statusCode === 404) {
// //       // Redirect to the home page
// //       res.redirect('/');
// //     } else {
// //       // If it's not a 404 error, let the default handler handle it
// //       next();
// //     }
// //   }
// // }));

// // Middleware to handle 404 errors and redirect them to the SPA's index.html file
// // app.use((req, res, next) => {
// //     if (res.status === 404) {
// //         console.log(statusCode);
// //         //res.redirect('/');
// //         resolve(__dirname, 'public', '/');
// //       } 
// //       next();
// //   const indexFile = path.resolve(__dirname, 'public', '/');
// //   res.status(404).sendFile(indexFile);
// //   res.status(500).sendFile(indexFile);

// // });

// // app.use(express.static(path.join(__dirname, 'public')));

// // // Middleware to handle 404 errors and redirect them to the SPA's index.html file
// // app.use((req, res, next) => {
// //   if (res.statusCode === 404) {
// //     const indexFile = path.resolve(__dirname, 'public', 'index.html');
// //     res.sendFile(indexFile);
// //   } else {
// //     next();
// //   }
// // });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server listening on port 3000!');
// });
import express from 'express';
import path from 'path';

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(new URL('.', import.meta.url).pathname, 'public')));

// Define routes for your pages
app.get('/login', function(req, res) {
  res.sendFile(path.join(new URL('./public/pages/login.html', import.meta.url).pathname));
});

app.get('/add_user', function(req, res) {
  res.sendFile(path.join(new URL('./public/pages/add_user.html', import.meta.url).pathname));
});

app.get('/calculate', function(req, res) {
  res.sendFile(path.join(new URL('./public/pages/calculate.html', import.meta.url).pathname));
});

app.get('/listing', function(req, res) {
  res.sendFile(path.join(new URL('./public/pages/listing.html', import.meta.url).pathname));
});

// Handle 404 errors by redirecting to the home page
 app.get('*', function(req, res) {
    res.redirect('/')
   res.status(404).redirect('/');
 });

// Start the server
app.listen(3000, function() {
  console.log('Server started on port 3000.');
});
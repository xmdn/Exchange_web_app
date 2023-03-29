import express from 'express';
import history from 'connect-history-api-fallback'
import path from 'path';
//import __dirname from 'path';
// const http = require('http');
 const fs = import('fs');
import { URL } from 'url';

const __dirname = new URL('.', import.meta.url).pathname;

const app = express();

app.use(express.static('public'));

app.get('*', function(req, res){
    res.status(404).redirect('/');
  });
// // app.get('/', function(req, res){
// //     res.redirect('/');
// // });
// app.get('/login', function(req, res){
//     res.redirect('/login');
// });
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');

  });
app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/pages/login.html');

});
  
app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});
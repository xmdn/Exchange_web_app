import express from 'express';
import { URL } from 'url';

const __dirname = new URL('.', import.meta.url).pathname;

const app = express();

app.use(express.static('public'));

// app.get('*', function(req, res){
//     res.status(404).redirect('/');
//   });

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  });
 
app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});
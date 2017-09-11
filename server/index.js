require('dotenv').config();
import express from 'express';
import VisionHelper from './generateToken';

const app = express();
const VisionApi = VisionHelper();

app.get('/key', (req, res) => {
  // Make the OAuth call to generate a token
  VisionApi.generateToken()
    .then(body => {
      const response = JSON.parse(body);
      console.log(response.access_token);
    })
    .catch(err => {
      console.log('Error happend', err);
    });
});

app.listen(8080, () => {
  console.log('Server started and listening on 8080');
});

require('dotenv').config();
import express, { static } from 'express';
import { join } from 'path';
import VisionHelper from './generateToken';

const app = express();
const VisionApi = VisionHelper();

app.use('/resources', static(join(__dirname, '../resources')));

app.get('/key', (req, res) => {
  // Make the OAuth call to generate a token
  VisionApi.getAccessToken(({ success, access_token }) => {
    if (success) {
      console.log(access_token);
    }
  });
  res.status(200).send(true);
});

app.listen(8080, () => {
  console.log('Server started and listening on 8080');
});

import { config } from 'dotenv';
import express from 'express';
import { join } from 'path';
import VisionHelper from './VisionHelper';
import { spawn } from 'child_process';
import bodyParser from 'body-parser';

config();
const app = express();
const VisionApi = VisionHelper();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use('/resources', express.static(join(__dirname, '../resources')));

app.get('/key', async (req, res) => {
  // Make the OAuth call to generate a token
  const { success, token } = await VisionApi.getAccessToken();
  if (success) res.status(200).send(token);
});

app.post('/scrape', (req, res) => {
  const { searchTerms, imagesPer } = req.body;

  let process = spawn('python', [
    'google-images-download.py',
    ...searchTerms,
    imagesPer
  ]);
});

app.listen(8080, () => {
  console.log('Server started and listening on 8080');
});

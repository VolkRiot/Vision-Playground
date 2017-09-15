import { config } from 'dotenv';
import express from 'express';
import { join } from 'path';
import VisionHelper from './VisionHelper';

config();
const app = express();
const VisionApi = VisionHelper();

app.use('/resources', express.static(join(__dirname, '../resources')));

app.get('/key', async (req, res) => {
  // Make the OAuth call to generate a token
  const { success, token } = await VisionApi.getAccessToken();
  if (success) res.status(200).send(token);
});

app.listen(8080, () => {
  console.log('Server started and listening on 8080');
});

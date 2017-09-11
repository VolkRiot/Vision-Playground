require('dotenv').config();
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'request';
import fs from 'fs';
import { join } from 'path';

var url = process.env.EINSTEIN_VISION_URL;
var private_key =
  process.env.EINSTEIN_VISION_PRIVATE_KEY ||
  fs.readFileSync(join(__dirname, '../key.pem'));
var account_id = process.env.EINSTEIN_VISION_ACCOUNT_ID;

const app = express();
var reqUrl = `${url}v2/oauth2/token`;

// JWT payload
var rsa_payload = {
  sub: account_id,
  aud: reqUrl
};

var rsa_options = {
  header: {
    alg: 'RS256',
    typ: 'JWT'
  },
  expiresIn: '1h'
};

// Sign the JWT payload
var assertion = jwt.sign(rsa_payload, private_key, rsa_options);

var options = {
  url: reqUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/json'
  },
  body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(
    assertion
  )}`
};

app.get('/key', (req, res) => {
  // Make the OAuth call to generate a token
  request.post(options, function(error, response, body) {
    var data = JSON.parse(body);
    console.log('Access token is ', data['access_token']);
  });
});

app.listen(8080, () => {
  console.log('Server started and listening on 8080');
});

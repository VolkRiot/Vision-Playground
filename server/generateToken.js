import jwt from 'jsonwebtoken';
import request from 'request-promise';
import fs from 'fs';
import { join } from 'path';

function VisionHelper() {
  const url = process.env.EINSTEIN_VISION_URL;
  const private_key =
    process.env.EINSTEIN_VISION_PRIVATE_KEY ||
    fs.readFileSync(join(__dirname, '../key.pem'));

  const account_id = process.env.EINSTEIN_VISION_ACCOUNT_ID;

  const reqUrl = `${url}v2/oauth2/token`;

  // JWT payload
  const rsa_payload = {
    sub: account_id,
    aud: reqUrl
  };

  const rsa_options = {
    header: {
      alg: 'RS256',
      typ: 'JWT'
    },
    expiresIn: '1h'
  };

  // Sign the JWT payload
  const assertion = jwt.sign(rsa_payload, private_key, rsa_options);

  const options = {
    url: reqUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      accept: 'application/json'
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(
      assertion
    )}`
  };
  // Possible rewite to use async defer
  function generateToken() {
    return request(options);
  }

  return {
    generateToken
  };
}

export default VisionHelper;

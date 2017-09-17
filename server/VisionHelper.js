import jwt from 'jsonwebtoken';
import request from 'request-promise';
import fs from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

function VisionHelper() {
  const url = process.env.EINSTEIN_VISION_URL;
  const private_key =
    process.env.EINSTEIN_VISION_PRIVATE_KEY ||
    fs.readFileSync(join(__dirname, '../key.pem'));
  const account_id = process.env.EINSTEIN_VISION_ACCOUNT_ID;
  let access_token = undefined;
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
  function _generateToken() {
    return request(options);
  }

  async function getAccessToken() {
    try {
      const token = await _generateToken().then(body => {
        const response = JSON.parse(body);
        access_token = response.access_token;
        return access_token;
      });
      return { success: true, token };
    } catch (err) {
      return { success: false };
    }
  }

  async function submitTrainingUrl(url) {
    if (!access_token) {
      var { success, token } = await getAccessToken();
      if (!success) return;
    }

    var options = {
      method: 'POST',
      url: 'https://api.einstein.ai/v2/vision/datasets/upload/sync',
      headers: {
        'content-type':
          'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        'cache-control': 'no-cache',
        authorization: `Bearer ${access_token}`
      },
      formData: {
        type: 'image',
        path: url
      }
    };
    return await request(options).then(body => {
      return JSON.parse(body);
    });
  }

  return {
    getAccessToken,
    submitTrainingUrl
  };
}

export default VisionHelper;

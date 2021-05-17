const urlLib = require('url');
const _ = require("lodash");
const oauth = require('oauth-signature');

const isValidRequest = (req) => {
  const originalUrl = req.originalUrl || req.url;
  if (!originalUrl) {
    return false;
  }
  const path = urlLib.parse(originalUrl).pathname;
  const url = 'https://' + req.headers.host + path;
  const body = _.clone(req.body);
  delete body.oauth_signature;
  const generatedSignature = decodeURIComponent(
    oauth.generate(
      req.method,
      url,
      body,
      process.env.LTI_SECRET
    )
  );
  return (generatedSignature === req.body.oauth_signature);
}

module.exports = {
  isValidRequest,
};
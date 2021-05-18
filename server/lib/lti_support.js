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

const contentItems =  (graph) => {
  return {
    '@context': 'http://purl.imsglobal.org/ctx/lti/v1/ContentItem',
    '@graph': graph
  };
}

function ltiLaunchContentItem(title, url) {
  return contentItems([{
    '@type': 'LtiLinkItem',
    mediaType: 'application/vnd.ims.lti.v1.ltilink',
    url,
    title
  }]);
}

module.exports = {
  isValidRequest,
  ltiLaunchContentItem
};
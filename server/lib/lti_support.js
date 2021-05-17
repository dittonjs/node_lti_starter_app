const initLTI = require('caccl-lti');
const jwt = require('jsonwebtoken');
const database = new (require('../database/database'));
const urlLib = require('url');
const _ = require("lodash");
const oauth = require('oauth-signature');

const isValidRequest = (req) => {
  const originalUrl = req.originalUrl || req.url;
  if (!originalUrl) {
    // No url: cannot sign the request
    return false;
  }
  const path = urlLib.parse(originalUrl).pathname;
  const url = 'https://' + req.headers.host + path;
  // > Remove oauth signature from body
  const body = _.clone(req.body);
  delete body.oauth_signature;
  // > Create signature
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


const setupLti = (app) => {
      
  initLTI({ 
    app,
    installationCredentials: {
      consumer_key: process.env.LTI_KEY,
      consumer_secret: process.env.LTI_SECRET,
    },
    launchPath: '/lti_launches'
  });

  app.use('/', async (req, res, next) => {
    const user = await database.findOrCreateUserFromLTI(req.session.launchInfo);
    req.currentUser = user;
    

    req.jwt = jwt.sign({
      userId: user.id,
      lmsUserId: user.lmsUserId,
      roles: user.roles,
      courseId: req.session.launchInfo.courseId,
      name: user.name,
      isInstructor: req.session.launchInfo.isInstructor,
      isTA: req.session.launchInfo.isTA,
    }, 
    process.env.SECRET_KEY,
    {
      expiresIn: "2 days",
    });
    next();
  });
}


module.exports = {
  setupLti,
  isValidRequest,
};
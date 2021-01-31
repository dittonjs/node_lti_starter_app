const initLTI = require('caccl-lti');

const setupLti = (app) => {
  // setup a fake session variable for the lti library to use
  // we will use JWT for authentication
  
  app.use("/lti_launches", (req, res, next) => {
    req.session = req.session || {};
    next();
  });
      
  initLTI({ 
    app,
    installationCredentials: {
      consumer_key: process.env.LTI_KEY,
      consumer_secret: process.env.LTI_SECRET,
    },
    launchPath: '/lti_launches'
  });
}


module.exports = {
  setupLti
};
const initLTI = require('caccl-lti');
const database = new (require('../database/database'));

const setupLti = (app) => {
  // setup a fake session variable for the lti library to use
  // we will use JWT for authentication
  
  // app.use("/lti_launches", (req, res, next) => {
  //   req.session = req.session || { save() {} };
  //   next();
  // });
      
  initLTI({ 
    app,
    installationCredentials: {
      consumer_key: process.env.LTI_KEY,
      consumer_secret: process.env.LTI_SECRET,
    },
    launchPath: '/lti_launches'
  });

  app.use('/lti_launches', (req, res, next) => {
    database.findOrCreateUserFromLTI(req.session.launchInfo, (err, doc) => {
      // console.log("=========================");
      // console.log(err, doc);
      next();
    });
  });
}


module.exports = {
  setupLti
};
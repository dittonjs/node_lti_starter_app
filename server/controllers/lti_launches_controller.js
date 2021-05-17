const Controller = require("./controller");
const { isValidRequest } = require("../lib/lti_support");
const { User, Nonce } = require("../models"); 

module.exports = class LtiLaunchesController extends Controller {
  init(router) {
    router.use('/', async (req, res, next) => {
      // Validates nonce
      try {
        await Nonce.validateNonce(req.body.oauth_nonce); 
      } catch (err) {
        console.log(err);
        res.status(401).send("Invalid nonce")
        return;
      }
      
      // validates oauth signature
      const isValid = isValidRequest(req);
      console.log("isValid", isValid);
      if (!isValid) {
        res.status(401).send("LTI Signature Invalid");
      } else {
        console.log(req.body);
        next();
      }
    });
  }

  index(req, res) {
    console.log(req.jwt);
    console.log(req.session.launchInfo);
    res.render("index", {
      data: {
        launchInfo: req.session.launchInfo,
        user: req.currentUser.toJSON(),
        jwt: req.jwt,
      }
    });
  }

  show(req, res) {

  }
}

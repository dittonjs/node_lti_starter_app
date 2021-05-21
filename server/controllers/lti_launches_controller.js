const jwt = require('jsonwebtoken');
const Controller = require("./controller");
const { isValidRequest } = require("../lib/lti_support");
const { verifyJWT } = require('../lib/jwt_support');
const { User, Nonce, LtiLaunch } = require("../models"); 
const { response } = require('express');

module.exports = class LtiLaunchesController extends Controller {
  init(router) {
    const handleLti = async (req, res, next) => {
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
        // create user
        console.log(req.body);
        const user = await User.fromLTI(req.body)
        req.currentUser = user;

        req.jwt = jwt.sign({
          user_id: user.id,
          lms_user_id: user.lmsUserId,
          roles: req.body.ext_roles,
          course_id: req.body.custom_canvas_course_id,
          content_item_return_url: req.body.content_item_return_url,
          name: user.name,
          context_id: req.body.context_id,
          is_instructor: await user.isInstructor(req.body.context_id),
          is_ta: await user.isTA(req.body.context_id),
        }, 
        process.env.SECRET_KEY,
        {
          expiresIn: "2 days",
        });
        next();
      }

    }
    router.post('/', handleLti);
    router.post('/:id', handleLti);
    // router.post('/', verifyJWT);
  }

  index(req, res) {
    console.log(req.jwt);
    res.render("index", {
      data: {
        launchParams: req.body,
        user: req.currentUser.toJSON(),
        jwt: req.jwt,
      }
    });
  }

  async show(req, res) {
    console.log(req.currentUser);
    const ltiLaunch = await LtiLaunch.findOne({ where: { token: req.params.id }});
    debugger
    res.render("index", {
      data: {
        launchParams: req.body,
        launchConfig: ltiLaunch.config,
        user: req.currentUser.toJSON(),
        jwt: req.jwt,
        testLaunchValue: ltiLaunch.config.testValue,
      }
    });
    // res.send("I am show")
  }

  create(req, res) {
    this.index(req, res);
  }
}

const Controller = require("../controller");
const { verifyJWT } = require('../../lib/jwt_support');
const { User, Nonce } = require("../../models"); 

module.exports = class LtiLaunchesController extends Controller {
  init(router) {
    router.post('/', verifyJWT);
  }

  create(req, res) {
    console.log("DO I GET HERE?")
    res.status(200).send("Success!!!");
  }
}

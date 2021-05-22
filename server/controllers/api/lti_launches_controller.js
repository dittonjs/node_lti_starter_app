const Controller = require("../controller");
const crypto = require('crypto');
const oauth = require('oauth-signature');
const { ltiLaunchContentItem } = require('../../lib/lti_support');
const { verifyJWT } = require('../../lib/jwt_support');
const { requireInstructorOrTA } = require('../../lib/role_support');
const { LtiLaunch } = require("../../models"); 

module.exports = class LtiLaunchesController extends Controller {
  init(router) {
    router.post('/', verifyJWT);
    router.post('/', requireInstructorOrTA);
  }

  async create(req, res) {
    const nonce = crypto.randomBytes(16).toString('base64');
    const ltiLaunch = await LtiLaunch.fromConfig(req.body.config);

    // payload is signed with all params
    const response = {
      content_items: JSON.stringify(ltiLaunchContentItem('LTI Assignment', ltiLaunch.launchUrl)),
      lti_message_type: 'ContentItemSelection',
      lti_version: 'LTI-1p0',
      oauth_consumer_key: process.env.LTI_KEY,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: `${Math.floor(Date.now() / 1000)}`,
      oauth_version: '1.0'
    };

    response.oauth_signature = decodeURIComponent(
      oauth.generate(
        'POST',
        req.jwtBody.content_item_return_url,
        response,
        process.env.LTI_SECRET
      )
    );

    res.status(200).json(response);
  }
}

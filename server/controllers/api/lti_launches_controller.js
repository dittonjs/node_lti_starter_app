const Controller = require("../controller");
const crypto = require('crypto');
const oauth = require('oauth-signature');
const { ltiLaunchContentItem } = require('../../lib/lti_support');
const { verifyJWT } = require('../../lib/jwt_support');
const { LtiLaunch } = require("../../models"); 

module.exports = class LtiLaunchesController extends Controller {
  init(router) {
    router.post('/', verifyJWT);
  }

  async create(req, res) {
    const nonce = crypto.randomBytes(16).toString('base64');
    const timestamp = Date.now();
    console.log("req body", req.body);
    const ltiLaunch = await LtiLaunch.fromConfig(req.body.config);
    console.log('my url', ltiLaunch.launchUrl)
    const response = {
      lti_message_type: 'ContentItemSelection',
      lti_version: 'LTI-1p0',
      content_items: JSON.stringify(ltiLaunchContentItem('LTI Assignment', ltiLaunch.launchUrl)),
      oauth_version: '1.0',
      oauth_nonce: nonce,
      oauth_timestamp: `${timestamp}`,
      oauth_consumer_key: process.env.LTI_KEY,
      oauth_callback: 'about:blank',
      oauth_signature_method: 'HMAC-SHA1',
    };

    response.oauth_signature = decodeURIComponent(
      oauth.generate(
        'POST',
        req.jwtBody.content_item_return_url,
        response,
        process.env.LTI_SECRET
      )
    );

    console.log("DO I GET HERE?", response)
    res.status(200).json(response);
  }
}

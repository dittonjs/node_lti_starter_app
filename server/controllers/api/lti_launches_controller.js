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
    // const timestamp = Date.now();
    console.log("req body", req.body);
    const ltiLaunch = await LtiLaunch.fromConfig(req.body.config);
    console.log('my url', ltiLaunch.launchUrl)
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
    debugger
    // content_items: "{"@graph":[{"title":"Phanon","url":"https://phanon.atomicjolt.xyz/lti_launches/3UwUppjtHPATsiXm8c8v8ySw","mediaType":"application/vnd.ims.lti.v1.ltilink","@type":"LtiLinkItem"}],"@context":"http://purl.imsglobal.org/ctx/lti/v1/ContentItem"}"
    // lti_message_type: "ContentItemSelection"
    // lti_version: "LTI-1p0"
    // oauth_consumer_key: "usu-phanon"
    // oauth_nonce: "fc0016bc04281205f54751f73fb5d2c1"
    // oauth_signature: "MF6+aD83vMW8xyXNohHoZtwNt+g="
    // oauth_signature_method: "HMAC-SHA1"
    // oauth_timestamp: "1621606848"
    // oauth_version: "1.0"

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

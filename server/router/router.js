const route = require('./route');
const LtiLaunchesController = require('../controllers/lti_launches_controller');

module.exports = (app) => {
  app.use('/lti_launches', route(LtiLaunchesController));
}
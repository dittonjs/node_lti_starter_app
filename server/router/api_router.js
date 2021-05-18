const route = require('./route');
const LtiLaunchesController = require('../controllers/api/lti_launches_controller');
module.exports = (app) => {
  app.use('/lti_launches', route(LtiLaunchesController, [{
    method: 'post',
    path: '/:id',
    handler: 'show'
  }]));

  app.use('/api', (req, res) => {
    
  })
}
const express = require('express');
const route = require('./route');
const LtiLaunchesController = require('../controllers/lti_launches_controller');
const apiRouter = require('./api_router');

module.exports = (app) => {
  app.use('/lti_launches', route(LtiLaunchesController, [{
    method: 'post',
    path: '/:id',
    handler: 'show'
  }]));

  const router = express.Router();
  apiRouter(router);
  app.use('/api', router);

}
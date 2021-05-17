var express = require('express')

module.exports = (ControllerClass, customPaths = []) => {
  const router = express.Router()
  const controller = new ControllerClass();
  controller.init(router);
  router.get("/", (req, res) => controller.index(req, res));
  router.get('/:id', (req, res) => controller.show(req, res));
  router.post('/', (req, res) => controller.index(req, res));
  router.put('/:id', (req, res) => controller.index(req, res));
  router.delete('/:id', (req, res) => controller.index(req, res));

  customPaths.forEach(customPath => {
    router[customPath.method](customPath.path, (req, res) => controller[customPath.handler](req, res));
  });
  return router;
}
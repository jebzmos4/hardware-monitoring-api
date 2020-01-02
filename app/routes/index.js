/**
 * Created by Morifeoluwa on 18/11/2019.
 * objective: building to scale
 */
const swaggerUi = require('swagger-ui-restify');
const swaggerDocument = require('../swagger.json');
const { verifyToken } = require('../lib/jwtHelper');

const routes = function routes(server, serviceLocator) {
  const hardwareHandler = serviceLocator.get('hardwareController');

  const options = {
    explorer: true,
    baseURL: 'api-docs',
  };

  server.get(/\/api-docs\/+.*/, ...swaggerUi.serve);
  server.get('/api-docs', swaggerUi.setup(swaggerDocument, options));

  server.get({
    path: '/',
    name: 'base',
    version: '1.0.0'
  }, (req, res) => res.send('Welcome to the Hardware Monitoring API'));


  /**
   * LOGIN
   */
  server.post({
    path: '/login',
    name: 'recieves request from an hardware device',
  }, (req, res, next) => hardwareHandler.login(req, res, next));
};

module.exports = routes;

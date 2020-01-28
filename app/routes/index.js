/**
 * Created by Morifeoluwa on 02/01/2020.
 * objective: building to scale
 */
const swaggerUi = require('swagger-ui-restify');
const swaggerDocument = require('../swagger.json');

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
   * RECIEVE REQUEST
   */
  server.post({
    path: '/notify',
    name: 'recieves request from an hardware device',
  }, (req, res, next) => hardwareHandler.notify(req, res, next));

  /**
   * RECIEVE REQUEST
   */
  server.get({
    path: '/fetch',
    name: 'fetches request data for hardware device(s)',
  }, (req, res, next) => hardwareHandler.fetch(req, res, next));

  /**
   * RECIEVE REQUEST
   */
  server.post({
    path: '/schedule',
    name: 'creates schedule request for an hardware device',
  }, (req, res, next) => hardwareHandler.createSchedule(req, res, next));

  /**
   * RECIEVE REQUEST
   */
  server.get({
    path: '/schedule',
    name: 'fetches schedule request for an hardware device',
  }, (req, res, next) => hardwareHandler.fetchSchedule(req, res, next));

  /**
   * ADD A USER
   */
  server.post({
    path: '/signup',
    name: 'allows admin to create a new user',
  }, (req, res, next) => hardwareHandler.signUp(req, res, next));
};

module.exports = routes;

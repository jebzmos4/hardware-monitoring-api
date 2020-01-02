/**
 * Created by Morifeoluwa Jebutu on 18/11/2019.
 * objective: building to scale
 */
const morgan = require('morgan');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('../config/settings');
const serviceLocator = require('../lib/service_locator');
const HardwareService = require('../services/hardware');
const HardwareController = require('../controllers/hardware');

const winston = require('winston');
require('winston-daily-rotate-file');

mongoose.Promise = bluebird;

/**
 * Returns an instance of logger for the App
 */
serviceLocator.register('logger', () => {
  const consoleTransport = new (winston.transports.Console)({
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    json: false,
    colorize: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info',
  });
  return new (winston.Logger)({
    transports: [
      consoleTransport,
    ],
  });
});


/**
 * Returns an instance of HTTP requests logger
 */
serviceLocator.register('requestlogger', () => morgan('common'));


/**
 * Returns a Mongo connection instance.
 */

serviceLocator.register('mongo', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const connectionString =
    (!config.mongo.connection.username || !config.mongo.connection.password) ?
      `mongodb://${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}` :
      `mongodb://${config.mongo.connection.username}:${config.mongo.connection.password}` +
      `@${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}`;
  const mongo = mongoose.connect(
    connectionString,
    { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }
  );
  mongo.then(() => {
    logger.info('Mongo Connection Established', connectionString);
  }).catch(() => {
    logger.error('Mongo Connection disconnected');
    process.exit(1);
  });

  return mongo;
});


/**
 * Creates an instance of the Hardware Service
 */
serviceLocator.register('hardwareService', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const mongoClient = servicelocator.get('mongo');
  return new HardwareService(logger, mongoClient);
});

/**
 * Creates an instance of the Harware controller
 */
serviceLocator.register('hardwareController', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const hardwareService = servicelocator.get('hardwareService');
  return new HardwareController(logger, hardwareService);
});


module.exports = serviceLocator;

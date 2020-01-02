/**
 * Created by Morifeoluwa on 02/01/2020.
 * objective: building to scale
 */

/**
 * Module Dependencies
 */
const _ = require('lodash');
const Response = require('../lib/response_manager');
const httpStatus = require('../constants/http_status');
const utils = require('../lib/utilities');

class Hardware {
/**
     * Constructor
     *
     * @param logger
     * @param service
     */
  constructor(logger, service) {
    this.logger = logger;
    this.service = service;
  }

  notify(req, res) {
    this.logger.info('validating hardware request data');
    if (req.body === null || req.body === undefined || _.isEmpty(req.body)) {
      return Response.failure(res, {
        message: 'This endpoint requires a JSON body parameter'
      }, httpStatus.BAD_REQUEST);
    }
    const errors = utils.checkRequestBody(req.body, ['id', 'name', 'loc', 'time', 'stat']);
    if (errors) {
      return Response.failure(res, {
        message: 'Missing/Empty parameters in the request body',
        response: errors,
      }, httpStatus.BAD_REQUEST);
    }
    return this.service.createRecord(req.body)
      .then((response) => {
        this.logger.info(response);
        this.service.sendNotification(req.body);
        Response.success(res, {
        }, httpStatus.OK);
      }).catch((error) => {
        this.logger.error(error);
        Response.failure(res, {
        }, httpStatus.NOT_IMPLEMENTED);
      });
  }
}

module.exports = Hardware;

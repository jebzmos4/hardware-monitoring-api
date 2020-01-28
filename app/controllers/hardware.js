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
    const payload = req.body;
    const errors = utils.checkRequestBody(payload, ['device_id', 'stat']);
    if (errors) {
      return Response.failure(res, {
        message: 'Missing/Empty parameters in the request body',
        response: errors,
      }, httpStatus.BAD_REQUEST);
    }
    const contentErrors = utils.checkJsonRequestContent(payload.stat, ['opm', 'chc', 'bat', 'opv', 'opp', 'opc']);
    if (contentErrors) {
      return Response.failure(res, {
        message: 'Missing/Empty parameters in the stat request body',
        response: contentErrors,
      }, httpStatus.BAD_REQUEST);
    }
    if (parseInt(payload.stat.bat, 10) <= 50) {
      const message = `Device with id ${payload.device_id} has a low battery level of ${payload.stat.bat}`;
      this.service.sendEmail('jebzmos4@gmail.com', message)
        .then(response => this.logger.info('Email notifcation sent for low battery', response))
        .catch(error => this.logger.error(error));
    }
    return this.service.createRecord(req.body)
      .then((response) => {
        this.logger.info(response);
        this.service.sendNotification(req.body);
        Response.success(res, {
          message: 'Request has successfully been saved',
          response: 'Request notification sent to the dashboard'
        }, httpStatus.OK);
      }).catch((error) => {
        this.logger.error(error);
        Response.failure(res, {
          message: 'unable to process request'
        }, httpStatus.NOT_IMPLEMENTED);
      });
  }

  fetch(req, res, next) {
    try {
      this.logger.info('fetching data for hardware device(s)');
      return this.service.getRecord(req.query).then(response => Response.success(res, {
        message: '',
        response
      }, httpStatus.OK)).catch(error => Response.failure(res, {
        message: '',
        response: error
      }, httpStatus.BAD_REQUEST));
    } catch (err) {
      return next(err);
    }
  }

  createSchedule(req, res, next) {
    this.logger.info('creating schedule');
    try {
      if (req.body === null || req.body === undefined || _.isEmpty(req.body)) {
        return Response.failure(res, {
          message: 'This endpoint requires a JSON body parameter'
        }, httpStatus.BAD_REQUEST);
      }
      const payload = req.body;
      const errors = utils.checkRequestBody(payload, ['device_id', 'start_time', 'stop_time']);
      if (errors) {
        return Response.failure(res, {
          message: 'Missing/Empty parameters in the request body',
          response: errors,
        }, httpStatus.BAD_REQUEST);
      }
    } catch (e) {
      return next(e);
    }
  }

  signUp(req, res, next) {
    try {
      if (req.body === null || req.body === undefined || _.isEmpty(req.body)) {
        return Response.failure(res, {
          message: 'This endpoint requires a JSON body parameter'
        }, httpStatus.BAD_REQUEST);
      }
      const errors = utils.checkRequestBody(req.body, ['email']);
      if (errors) {
        return Response.failure(res, {
          message: 'missing parameter in request body',
          response: errors
        }, httpStatus.NOT_ACCEPTABLE);
      }
      if (req.body.email.length < 0) {
        return Response.failure(res, {
          message: 'Invalid Email Passed',
          response: null
        }, httpStatus.BAD_REQUEST);
      }
      const message = 'You have been added to the Power Cube dashboard! Your user name is Admin and password is 12346';
      return this.service.sendEmail(req.body.email, message)
        .then((signUpResponse) => {
          this.logger.info('OTP has been sent to a user');
          return Response.success(res, {
            message: 'Successfully sent OTP to user',
            response: signUpResponse
          }, httpStatus.CREATED);
        })
        .catch((signUpError) => {
          this.logger.error('error sending Credentials to user');
          return Response.failure(res, {
            message: 'error completing user sign up process',
            response: signUpError
          }, httpStatus.BAD_REQUEST);
        });
    } catch (error) {
      return next(error);
    }
  }

  switch(req, res, next) {
    this.logger.info('ˇVerifying user login credentials');
    try {
      if (req.body === null || req.body === undefined || _.isEmpty(req.body)) {
        return Response.failure(res, {
          message: 'This endpoint requires a JSON body parameter'
        }, httpStatus.BAD_REQUEST);
      }
      const errors = utils.checkRequestBody(req.body, ['email']);
      if (errors) {
        return Response.failure(res, {
          message: 'missing parameter in request body',
          response: errors
        }, httpStatus.NOT_ACCEPTABLE);
      }
      const payload = req.body;
      const contentErrors = utils.checkJsonRequestContent(payload.stat, ['opm', 'chc', 'bat', 'opv', 'opp', 'opc']);
      if (contentErrors) {
        return Response.failure(res, {
          message: 'Missing/Empty parameters in the stat request body',
          response: contentErrors,
        }, httpStatus.BAD_REQUEST);
      }

    } catch (error) {
      return next(error);
    }
  }
}

module.exports = Hardware;

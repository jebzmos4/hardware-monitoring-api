/**
 * Created by Morifeoluwa on 02/01/2020.
 * objective: building to scale
 */

/**
 * Module Dependencies
 */

const jwt = require('../lib/jwtHelper');
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

  login(req, res) {
    this.logger.info('validating user login credentials');
    if (req.body === null || req.body === undefined || _.isEmpty(req.body)) {
      return Response.failure(res, {
        message: 'This endpoint requires a JSON body parameter'
      }, httpStatus.BAD_REQUEST);
    }
    const errors = utils.checkRequestBody(req.body, ['email', 'password']);
    if (errors) {
      return Response.failure(res, {
        message: 'Missing/Empty parameters in the request body',
        response: errors,
      }, httpStatus.BAD_REQUEST);
    }
    return this.service.getUser(req.body)
      .then((getResponse) => {
        if (_.isEmpty(getResponse)) {
          return Response.failure(res, {
            message: 'Login Failed',
            response: 'User does not exist',
          }, httpStatus.FORBIDDEN);
        }
        if (getResponse.password === req.body.password) {
          this.logger.info('login successful');
          const token = jwt.generateToken(req.body);
          return Response.success(res, {
            message: 'Login Successful',
            response: token
          }, httpStatus.ACCEPTED);
        } return Response.failure(res, {
          message: 'Login Failed',
          response: 'Invalid Credentials',
        }, httpStatus.FORBIDDEN);
      }).catch(err => Response.failure(res, {
        message: 'Login Failed',
        response: `invalid email or password ${err}`
      }, httpStatus.FORBIDDEN));
  }


  signUp(req, res) {
    this.logger.info('creating user data in DB');
    if (req.body === null || req.body === undefined || _.isEmpty(req.body)) {
      return Response.failure(res, {
        message: 'This endpoint requires a JSON body parameter'
      }, httpStatus.BAD_REQUEST);
    }
    const errors = utils.checkRequestBody(req.body, ['firstname', 'lastname', 'email', 'password']);
    if (errors) {
      this.logger.error('required body parameter not passed');
      return Response.failure(res, {
        message: 'required param not found',
        response: errors
      }, httpStatus.BAD_REQUEST);
    }
    const param = req.body;
    param.loggedIn = true;
    return this.service.createUser(req.body)
      .then((response) => {
        if (response.createdAt) {
          response.password = undefined;
          return Response.success(res, {
            message: 'User Data successfully created in DB',
            response
          }, httpStatus.OK);
        }
        return Response.failure(res, {
          message: 'Error creating user data',
          response
        }, httpStatus.BAD_REQUEST);
      })
      .catch(err => Response.failure(res, {
        message: 'Unable to create User data',
        response: err.msg
      }, httpStatus.BAD_REQUEST));
  }
}

module.exports = Hardware;

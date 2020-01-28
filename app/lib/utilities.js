const _ = require('lodash');

const Utility = {
  isValidQuery(query) {
    if (query.length < 1) return false;
    return query.replace(/[^\w\s]/gi, '');
  },
  checkRequestBody(params, requiredFields) {
    const errors = {};
    for (let i = 0; i < requiredFields.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(params, requiredFields[i])) {
        errors[requiredFields[i]] = 'is required';
      }
    }
    if (_.isEmpty(errors)) {
      return null;
    }
    return errors;
  },

  checkJsonRequestContent(json, requiredFields) {
    const errors = {};
    for (let i = 0; i < requiredFields.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(json, requiredFields[i])) {
        errors[requiredFields[i]] = 'is required';
      }
    }
    Object.keys(json).forEach((item) => {
      if (typeof json[item] === 'object') {
        Object.keys(json[item]).forEach((v) => {
          if (_.isEmpty(json[item][v])) {
            errors[`${item}.${v}`] = 'cannot not be an empty';
          }
        });
      }
      if (_.isEmpty(json[item])) {
        errors[item] = 'cannot not be an empty';
      }
    });
    if (_.isEmpty(errors)) {
      return null;
    }
    return errors;
  },


};

module.exports = Utility;

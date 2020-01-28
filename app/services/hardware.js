/**
 * Created by Morifeoluwa on 02/01/2020.
 * objective: building to scale
 */
const MongoDBHelper = require('../lib/mongoDBHelper');
const HardwareModel = require('../models/hardware.model');
const config = require('../config/settings');
const Pusher = require('pusher');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.sendGrid.apiKey);

const pusher = new Pusher({
  appId: config.pusher.appId,
  key: config.pusher.key,
  secret: config.pusher.secret,
  cluster: config.pusher.cluster,
  encrypted: config.pusher.encrypted
});

class Hardware {
  /**
     *
     * @param {*} logger Logger Object
     */
  constructor(logger, mongoClient) {
    this.logger = logger;
    this.mongo = new MongoDBHelper(mongoClient, HardwareModel);
  }

  getRecord(data) {
    if (data.device_id) {
      return this.mongo.getOne(data);
    } return this.mongo.getBulk();
  }

  createRecord(data) {
    this.logger.info('inserting record into DB');
    return this.mongo.save(data);
  }

  sendNotification(data) {
    this.logger.info('sending notification to dashboard');
    pusher.trigger(config.pusher.channel, config.pusher.event, {
      message: data
    });
  }

  sendEmail(email, message) {
    this.logger.info('Sending email verification to user');
    try {
      const msg = {
        to: email,
        from: 'test@example.com',
        subject: 'Low Battery Notification',
        text: message,
        html: `Device needs attention: <strong>${message}</strong>`,
      };
      return sgMail.send(msg)
        .then(resp => resp[0].statusCode).catch(err => err.response.body.errors);
    } catch (error) {
      return error;
    }
  }
}

module.exports = Hardware;

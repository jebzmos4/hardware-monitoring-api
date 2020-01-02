/**
 * Created by Morifeoluwa on 02/01/2020.
 * objective: building to scale
 */
const sgMail = require('@sendgrid/mail');
const MongoDBHelper = require('../lib/mongoDBHelper');
const HardwareModel = require('../models/user.model');
const config = require('../config/settings');


sgMail.setApiKey(config.sendGrid.apikey);

class Hardware {
  /**
     *
     * @param {*} logger Logger Object
     */
  constructor(logger, mongoClient) {
    this.logger = logger;
    this.mongo = new MongoDBHelper(mongoClient, HardwareModel);
  }

  getUser(data) {
    return this.mongo.getOneUser(data);
  }

  createUser(data) {
    this.logger.info('inserting record into DB');
    return this.mongo.save(data);
  }

  search(query) {
    return this.mongo.search(query);
  }

  sendNotification(email, data) {
    this.logger.info('sending notification to user');
    const msg = {
      to: email,
      from: 'test@example.com',
      subject: 'Your Question Has Received an Answer',
      text: `Someone posted the answer: ${data}`,
      html: `Someone posted the answer: <strong>${data}</strong>`,
    };
    sgMail.send(msg);
  }
}

module.exports = Hardware;

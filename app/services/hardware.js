/**
 * Created by Morifeoluwa on 02/01/2020.
 * objective: building to scale
 */
const MongoDBHelper = require('../lib/mongoDBHelper');
const HardwareModel = require('../models/hardware.model');
const config = require('../config/settings');
const Pusher = require('pusher');


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
    return this.mongo.getOneUser(data);
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
}

module.exports = Hardware;

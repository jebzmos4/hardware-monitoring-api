/* eslint-disable radix */
/* eslint-disable no-shadow */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/**
 * Created by Morifeoluwa Jebutu
 * objective: building to scale
 */

const config = require('../config/settings');

class MongoDBHelper {
  /**
   * The constructor
   *
   * @param mongodbClient - MongoDB client
   * @param mongodbModel - the model you wish to operate on
   */
  constructor(mongodbClient, mongodbModel) {
    this.mongoDBClient = mongodbClient;
    this.MongoDBModel = mongodbModel;
  }


  /**
   * Saves data into the MongoDB instance
   *
   * @param data
   * @returns {Promise}
   */
  save(data) {
    return new Promise((resolve, reject) =>
      // const mongodbSaveSchema = this.MongoDBModel(data, { upsert: true });
      this.MongoDBModel.replaceOne({ device_id: data.device_id }, data, { upsert: true }, (error, result) => {
        if (error != null) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(result);
      }));
  }

  /**
   * Updates a SINGLE RECORD in the MongoDB instance's DB based on some conditional criteria
   *
   * @param params - the conditional parameters
   * @param data - the data to update
   * @returns {Promise}
   */
  update(params, data) {
    return new Promise((resolve, reject) => this.MongoDBModel.findOneAndUpdate(
      params.conditions,
      { $set: data },
      { new: true },
      (error, response) => {
        if (error) {
          if (config.logging.console) {
            return new Error(`Update Error: ${JSON.stringify(error)}`);
          }
          return reject(MongoDBHelper.handleError(error));
        }
        if (error == null && response == null) {
          return reject(new Error("Record Not Found In DB'"));
        }
        return resolve(response);
      }
    ));
  }

  getOne(params) {
    return new Promise((resolve, reject) => {
      const query = this.MongoDBModel.findOne(params);
      if (params.fields) {
        query.select(params.fields);
      }

      return query.exec((err, modelData) => {
        if (err) {
          return reject(MongoDBHelper.handleError(err));
        }
        return resolve(modelData);
      });
    });
  }

  /**
   * Fetches bulk records from the connected MongoDB instance.
   *
   * @param params
   * @returns {Promise}
   */
  getBulk() {
    return new Promise((resolve, reject) => {
      const query = this.MongoDBModel.find();
      return query.exec((error, modelData) => {
        if (error) {
          return reject(this.handleError(error));
        }
        return resolve(modelData);
      });
    });
  }

  search(query) {
    const models = [this.QuestionModel, this.MongoDBModel];
    return Promise.all(models.map(model => model.find({ $text: { $search: query.text } })));
  }
  /**
   * Used to format the error messages returned from the MongoDB server during CRUD operations
   *
   * @param report
   * @returns {{error: boolean, message: *}}
   */
  static handleError(report) {
    return { error: true, msg: report };
  }
}

module.exports = MongoDBHelper;

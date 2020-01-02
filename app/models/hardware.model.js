/**
 * Created by Morifeoluwa Jebutu
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const config = require('../config/settings');

const { Schema } = mongoose;

const HardwareSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    loc: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    time: {
      type: String,
      required: true,
    },
    stat: {
      type: JSON,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

HardwareSchema.plugin(mongoosePaginate);

HardwareSchema.index({ '$**': 'text' });
const hardwareModel = mongoose.model(config.mongo.collections.hardware, HardwareSchema);
module.exports = hardwareModel;

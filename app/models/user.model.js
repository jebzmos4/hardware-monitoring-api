/**
 * Created by Morifeoluwa Jebutu
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const config = require('../config/settings');

const { Schema } = mongoose;

const HardwareSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    loggedIn: {
      type: Boolean,
      default: false
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

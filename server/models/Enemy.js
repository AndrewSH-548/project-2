const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const EnemySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  accessories: {
    type: Array
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

EnemySchema.statics.toApi = (doc) => ({
  name: doc.name,
  type: doc.type,
  color: doc.color,
  accessories: doc.accessories
});

const EnemyModel = mongoose.model('Enemy', EnemySchema);
module.exports = EnemyModel;

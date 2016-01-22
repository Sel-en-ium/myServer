/*jslint node: true, nomen: true*/

(function () {
  'use strict';

  var
    path = require('path'),
    Persistor = require('sel-en-ium-persistor'),
    persitor,
    databaseApi = {};

  persitor = new Persistor({
    type: 'LocalFile',
    config: {
      filePath: path.join(__dirname, '../../../../data/lovelive.json')
    }
  });

  /**
   * Adds an entry to the database.
   */
  databaseApi.add = function (entry, callback) {
    persitor.create(entry, callback);
  };

  /**
   * Gets all entries.
   */
  databaseApi.getAll = function (callback) {
    persitor.getAll(callback);
  };

  module.exports = databaseApi;
}());

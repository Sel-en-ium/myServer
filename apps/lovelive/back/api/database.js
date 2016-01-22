/*jslint node: true, nomen: true*/

(function () {
  'use strict';

  var
    Persistor = require('sel-en-ium-persistor'),
    persitor,
    databaseApi = {};

  persitor = new Persistor({
    type: 'LocalFile',
    config: {
      dir: '../../data'
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
    persitor.create(callback);
  };

  module.exports = databaseApi;
}());

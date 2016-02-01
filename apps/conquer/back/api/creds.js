/*jslint node: true*/
(function () {
  'use strict';

  var
    path = require('path'),
    utils = require('sel-en-ium-utility'),
    fse = require('fs-extra'),
    Persistor = require('sel-en-ium-persistor'),
    persitor,
    credsApi = {};

  persitor = new Persistor({
    type: 'LocalFile',
    config: {
      filePath: path.join(__dirname, '../../resource/creds.json')
    }
  });


  /**
   * Gets all entries.
   */
  credsApi.getAll = function (callback) {
    persitor.getAll(callback);
  };

  /**
   * Gets an entry.
   */
  credsApi.get = function (id, callback) {
    persitor.get(id, callback);
  };

  //credsApi.get(1, function (err, account) {
  //  console.log(err||account);
  //});

  module.exports = credsApi;
}());

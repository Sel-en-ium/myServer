/*jslint node: true, nomen: true*/

(function () {
  'use strict';

  var
    path = require('path'),
    fse = require('fs-extra'),
    injectionApi = {};

  /**
   * Creates a script for injection to a page.
   */
  injectionApi.getInject = function (callback) {
    fse.readFile(path.join(__dirname, '../../front/js/inject.js'), callback);
  };

  module.exports = injectionApi;
}());

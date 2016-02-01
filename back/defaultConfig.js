/*jslint node: true*/
(function () {
  'use strict';
  var
    path = require('path'),
    appMap = require(path.join(__dirname, '../apps/appMap'));

  module.exports = {

    // The apps to include.  If they have a router, the route will be the index value here.
    apps: {
      //'lovelive': require(appMap['lovelive']),
      'conquer': require(appMap['conquer'])
    }
  }
}());
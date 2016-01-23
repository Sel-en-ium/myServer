/*jslint node: true*/
(function () {
  'use strict';

  var
    path = require('path'),
    databaseApi = require('./back/api/database');

  databaseApi.createCsv(path.join(__dirname, '../../data/lovelive.csv'), function (err) {
    console.log(err || 'done');
  });

}());

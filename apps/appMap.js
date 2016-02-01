/*jslint node: true*/
(function () {
  'use strict';

  var
    path = require('path');

  module.exports = {
    lovelive: path.join(__dirname, 'lovelive/manifest'),
    conquer: path.join(__dirname, 'conquer/manifest')
  }
}());
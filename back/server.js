/*jslint node: true*/
(function () {
  'use strict';
  var
    utils = require('sel-en-ium-utility'),
    path = require('path'),
    http = require('http'),
    //httpolyglot = require('httpolyglot'),
    middleware = require(path.join(__dirname, 'middleware')),
    express = require('express'),
    //session = require('express-session'),
    defaultConfig = require(path.join(__dirname, 'defaultConfig')),
    Server;

  Server = function (config) {
    var
      self = this;

    self.app = express();

    /* CONFIG */

    self.config = utils.merge(defaultConfig, config);

    /* MIDDLEWARE */

    self.app.use(middleware.setBody());
    self.app.use(middleware.allowCrossDomain());

  };

  /**
   * Start the web server.
   *
   * @param {number} port - Port to listen on.
   * @param {function} callback - Called once server begins listening.
   */
  Server.prototype.listen = function (port, callback) {
    var
      self = this;


    utils.forEach(self.config.apps, function (name, app) {
      /*jslint unparam:true*/
      self.app.use('/' + name, app.router);
    });


    self.server = http.createServer(self.app);

    self.server.listen(parseInt(port, 10), '0.0.0.0', null, function () {
      console.log('Listening on: http://localhost:' + port);
      if (callback) {
        callback();
      }
    });
  };

  /**
   * Call to stop the web server.
   */
  Server.prototype.close = function (callback) {
    var
      self = this;
    self.server.close(callback);
  };

  module.exports = Server;
}());
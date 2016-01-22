/*jslint node: true, stupid: true, nomen: true*/
(function () {
  'use strict';

  var
    path = require('path'),
    config,
    Server = require(path.join(__dirname, 'back/server')),
    server;

  config = {

  };

  server = new Server(config);

  server.listen(8347);
}());

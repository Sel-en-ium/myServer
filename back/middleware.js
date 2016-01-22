/*jslint node: true, unparam: true*/
(function () {
  'use strict';

  var
    utils = require('sel-en-ium-utility'),
    path = require('path'),
    middleware = {};

  /**
   * Used to retrieve the contents of the body of http request.
   * The contents will be passed to the callback.
   *
   * @param {Object} req - An Express req (Request) object.
   * @param {Object} res - An Express res (Response) object.
   * @param {Function} next - Function to be called upon completion.
   */
  middleware.setBody = function () {
    return function (req, res, next) {
      var
        body = '';
      if (req.method === 'POST' || req.method === 'PUT') {
        req.on('data', function (data) {
          body += data;

          if (body.length > 1e6) {
            // Flood attack or faulty client, nuke request
            req.connection.destroy();
            utils.printError("request body exceeded max length");
          }
        });
        req.on('end', function () {
          try {
            req.body = JSON.parse(body);
          } catch (e) {
            req.body = body;
          }
          next();
        });
      } else {
        next();
      }
    };
  };


  middleware.allowCrossDomain = function () {
    return function (req, res, next) {
      res.header('Expires', -1);
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    };
  };

  module.exports = middleware;
}());





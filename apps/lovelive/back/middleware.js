/*jslint node: true, unparam: true*/
(function () {
  'use strict';

  var
    self,
    utils = require('glazr-utils'),
    path = require('path'),
    passport = require('passport'),
    apiHelper = require('./apiHelper'),
    requestIp = require('request-ip'),
    middleware = {};

  /**
   * Initializes passport. If the deserialize function isn't present, all requests,
   * made by a user with a session key, trigger an 'unable to deserialize' error.
   * @param req
   * @param res
   * @param next
   */
  middleware.initPassport = function (req, res, next) {
    if (req.session[req.organization] && req.session[req.organization].settings) {
      var adapter = apiHelper.initApi('account', req.session[req.organization].settings);
      passport.use(adapter.getStrategy());
      passport.serializeUser(adapter.serializeUser);
      passport.deserializeUser(adapter.deserializeUser);
    }

    next();
  };
  /**
   * Used to retrieve the contents of the body of http request.
   * The contents will be passed to the callback.
   *
   * @param {Object} req - An Express req (Request) object.
   * @param {Object} res - An Express res (Response) object.
   * @param {Function} next - Function to be called upon completion.
   *
   * @returns {undefined}
   */
  middleware.setBody = function (req, res, next) {
    var
      body = '';
    if (req.method === 'POST' || req.method === 'PUT') {
      req.on('data', function (data) {
        body += data;

        if (body.length > 1e6) {
          // Flood attack or faulty client, nuke request
          req.connection.destroy();
          utils.log("request body exceeded max length");
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

  /**
   * Checks if the current request is authorized.
   * If it is not, a status of 401 (Unauthorized) is returned.
   *
   * @param {Request Object} req
   * @param {Response Object} res
   * @param {Function} next Should be called when authorized
   */
  middleware.checkAuthorization = function (req, res, next) {
    if (self.routeActivities.length === 0) {
      // no routes that need activities, so nothing to check
      return next();
    }

    var
      i,
      j,
      requiredAct,
      userActivities,
      route = req.url;
    // removes any query param
    route = route.match(/^\/.*(?=\?)|^\/.*(?=$)/i)[0];


    // Find the matching route in routeActivities
    for (i = 0; i < self.routeActivities.length; i += 1) {
      if (route.match(self.routeActivities[i].route)
          && req.method.toUpperCase() === self.routeActivities[i].reqMethod.toUpperCase()) {

        // Now see if the user has the required activity
        requiredAct = self.routeActivities[i].activity;
        if (req.session
            && req.session[req.organization]
            && req.session[req.organization].activities) {
          userActivities = req.session[req.organization].activities;
          for (j = 0; j < userActivities.length; j += 1) {
            if (userActivities[j].name === requiredAct) {
              return next();
            }
          }
        }
        // If we didn't hit the return next, we're not authorized
        return res.status(401).send('user does not have required permission');
      }
    }

    // There were no matching route definitions so
    next();
  };

  middleware.httpToHttps = function (req, res, next) {
    // If the protocol is not https (when we are running https)
    if (self.serverConfig.serverProtocol === 'https' && !req.secure) {
      res.redirect(301, self.serverConfig.serverProtocol + '://' + req.headers.host + req.url);
    } else {
      next();
    }
  };

  middleware.allowCrossDomain = function (req, res, next) {
    res.header('Expires', -1);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  };

  middleware.initSession = function (req, res, next) {
    // Ensures every session exists
    req.session = req.session || {};
    next();
  };

  /**
   * Helper function
   * @param {object} req - The request object
   * @param {object} context - The current context
   * @param {function (err, context)} callback
   */
  orgHelpers.addRequiredSessionContext = function (req, context, callback) {
    // Ensures every context has ipAddress
    context.ipAddress = requestIp.getClientIp(req);

    // Add all the groups and activities as well!
    apiHelper.initApi('account', context.settings)
      .updateUserGroupsActivities(context, function (err, user) {
        if (err) {
          return callback(err);
        }
        context = utils.merge(context, user);
        callback(null, context);
      });
  };

  module.exports = middleware;
}());





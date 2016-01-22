/*jslint node: true*/
(function () {
  'use strict';

  var
    utils = require('sel-en-ium-utility'),
    injectionApi = require('./api/injection'),
    databaseApi = require('./api/database'),
    router;


    router = (require('express')).Router([{
      caseSensitive: false,
      mergeParams: true,
      strict: false
    }]);

    /* ROUTES */
    router.get('/inject', function (req, res) {
      injectionApi.getInject(function (err, script) {
        if (err) {
          utils.printError(err);
          return res.status(err.status || 500).send();
        }
        res.send(script);
      });
    });

  router.route('/data')
    .post(function (req, res) {
      databaseApi.add(req.body, function (err, id) {
        if (err) {
          utils.printError(err);
          return res.status(err.status || 500).send();
        }
        res.send(String(id));
      });
    });

  router.route('/data/all').get(function (req, res) {
      databaseApi.getAll(function (err, all) {
        if (err) {
          utils.printError(err);
          return res.status(err.status || 500).send();
        }
        res.send(all);
      });
    });


  module.exports = router;
}());
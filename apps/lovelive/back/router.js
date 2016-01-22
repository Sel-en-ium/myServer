/*jslint node: true*/
(function () {
  'use strict';

  var
    utils = require('sel-en-ium-utility'),
    injectionApi = require('./api/injection'),
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

  module.exports = router;
}());
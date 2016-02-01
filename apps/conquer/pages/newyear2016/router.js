/*jslint node: true*/
(function () {
  'use strict';

  var
    utils = require('sel-en-ium-utility'),
    path = require('path'),
    fse = require('fs-extra'),
    router;


    router = (require('express')).Router([{
      caseSensitive: false,
      mergeParams: true,
      strict: false
    }]);

    /* ROUTES */
    router.get('/inject', function (req, res) {
      fse.readFile(path.join(__dirname, 'inject.js'), function (err, script) {
        if (err) {
          utils.printError(err);
          return res.status(err.status || 500).send();
        }
        res.send(script);
      });
    });

  module.exports = router;
}());
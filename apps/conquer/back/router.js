/*jslint node: true*/
(function () {
  'use strict';

  var
    path = require('path'),
    utils = require('sel-en-ium-utility'),
    credsApi = require(path.join(__dirname, 'api/creds')),
    router;


    router = (require('express')).Router([{
      caseSensitive: false,
      mergeParams: true,
      strict: false
    }]);

    /* ROUTES */

    router.use('/newyear2016', require(path.join(__dirname, '../pages/newyear2016/router')));

  router.route('/cred/:id').get(function (req, res) {
    credsApi.get(req.params.id, function (err, all) {
      if (err) {
        utils.printError(err);
        return res.status(err.status || 500).send();
      }
      res.send(all);
    });
  });

  module.exports = router;
}());
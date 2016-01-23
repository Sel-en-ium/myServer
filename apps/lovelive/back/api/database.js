/*jslint node: true*/
(function () {
  'use strict';

  var
    path = require('path'),
    utils = require('sel-en-ium-utility'),
    fse = require('fs-extra'),
    Persistor = require('sel-en-ium-persistor'),
    persitor,
    databaseApi = {};

  persitor = new Persistor({
    type: 'LocalFile',
    config: {
      filePath: path.join(__dirname, '../../../../data/lovelive.json')
    }
  });

  /**
   * Adds an entry to the database.
   */
  databaseApi.add = function (entry, callback) {
    persitor.create(entry, callback);
  };

  /**
   * Gets all entries.
   */
  databaseApi.getAll = function (callback) {
    persitor.getAll(callback);
  };

  databaseApi.createCsv = function (location, callback) {
    this.getAll(function (err, all) {
      if (err) {
        return callback(err);
      }

      var
        result = 'ID,Link,Member,Rarity,Attribute,Center Skill,Card Type,Collection,'
          + 'Type,Frequency,Activation Type,chance (%),Amount,text,'
          + 'Smile Initial,Pure Initial,Cool Initial,'
          + 'Smile Un-Idolized,Pure Un-Idolized,Cool Un-Idolized,'
          + 'Smile Idolized,Pure Idolized,Cool Idolized';
      utils.forEach(all, function (index, card) {
        /*jslint unparam:true*/
        result += '\n'
          + card.cardId + ','
          + card.link + ','
          + card.member + ','
          + card.rarity + ','
          + card.attribute + ','
          + card.centerSkill + ','
          + card.cardType + ','
          + (card.collection||'').trim() + ','
          + card.skill.type + ','
          + card.skill.frequency + ','
          + card.skill.activation + ','
          + card.skill.chance + ','
          + card.skill.amount + ','
          + '"' + card.skill.text + '",'
          + card.stats.initial.smile + ','
          + card.stats.initial.pure + ','
          + card.stats.initial.cool + ','
          + card.stats.unIdolizedMax.smile + ','
          + card.stats.unIdolizedMax.pure + ','
          + card.stats.unIdolizedMax.cool + ','
          + card.stats.idolizedMax.smile + ','
          + card.stats.idolizedMax.pure + ','
          + card.stats.idolizedMax.cool + ',';
      });

      fse.writeFile(location, result, callback);
    });
  };

  module.exports = databaseApi;
}());

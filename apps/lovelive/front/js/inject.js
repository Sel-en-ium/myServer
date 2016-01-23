/*jslint browser:true*/
(function () {
  'use strict';

  var
    MAX_CARD = 15;

  function sendReq(type, url, body, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(type, url, true);
    xmlhttp.setRequestHeader("Content-type","application/json");
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        callback(xmlhttp)
      }
    };
    xmlhttp.send(JSON.stringify(body));
  }

  function addEntry(data, callback) {
    sendReq('POST', 'http://localhost:8347/lovelive/data', data, callback);
  }

  function getAll(data, callback) {
    sendReq('GET', 'http://localhost:8347/lovelive/data/all', undefined, callback);
  }


  function getData() {
    var
      data = {},
      i,
      temp,
      el;

    /* ID */
    temp = document.location.pathname.replace(new RegExp(/[//]$/g), '').split('/');
    data.cardId = temp[temp.length - 1];

    /* LINK */
    data.link = document.location.href;

    /* MEMBER */
    data.member = $($('table tr')[1]).find('strong')[0].innerText.trim();

    /* RARITY ATTRIBUTE */
    el = $($('table tr th:contains("Card #ID")').parent()[0]).find('small')[1].innerText.trim().split('\n');

    // rarity
    temp = el[0].trim();
    switch (temp) {
      case 'Normal':
        temp = 'N';
        break;
      case 'Rare':
        temp = 'R';
        break;
      case 'Super Rare':
        temp = 'SR';
        break;
      case 'Ultra Rare':
        temp = 'UR';
        break;
    }
    data.rarity = temp;

    // Atrribute
    temp = el[1];
    temp = temp.replace(new RegExp(/[^a-zA-Z]/g), ''); // Get rid of japanese
    data.attribute = temp;

    /* CENTER SKILL */
    data.centerSkill = '-';
    el = $('table tr th:contains("Center Skill")');
    if (el.length) {
      el = $(el.parent()[0]).find('strong')[0].innerText;
      data.centerSkill = el;
    }

    /* CARD TYPE */
    data.cardType = 'normal';
    if ($('.card .flaticon-event').length) {
      data.cardType = 'event';
    } else if ($('.card .flaticon-promo').length) {
      data.cardType = 'promo';
    } else if ($('.card .flaticon-skill').length) {
      data.cardType = 'skill';
    }

    /* COLLECTION */
    data.collection = '-';
    el = $('table tr th:contains("Collection")');
    if (el.length) {
      temp = el.parent().find('td')[0].innerText.split('\n');
      var
        temp2,
        longestLength = 0;
      for (i = 0; i < temp.length; i += 1) {
        temp2 = temp[i].replace(new RegExp(/[^a-z0-9\s]/gi), '').trim();
        if (temp2.length >= longestLength) {
          longestLength = temp2.length;
          data.collection = temp2;
        }
      }
    }

    /* SKILL */

    data.skill = {
      text: '-',
      frequency: '-',
      activation: '-',
      chance: '-',
      amount: '-',
      type: '-'
    };

    el = $('table tr th:contains("Skill"):not(:contains("Center"))');
    if (el.length) {
      el = el.parent()[0].innerText.split('\n');
      var
        normalSkill = false;
      for (i = 0; i < el.length; i += 1) {
        if (el[i].match(/every/i)) {
          el = el[i];
          normalSkill = true;
          break;
        }
      }

      if (!normalSkill) {
        for (i = 0; i < el.length; i += 1) {
          if (el[i].match(/used/i)) {
            data.skill.text = el[i];
            break;
          }
        }
      } else {

        // Text
        data.skill.text = el;

        // Frequency
        temp = el.match(new RegExp(/[0123456789]+\s[a-z]*/i))[0].split(' ');
        data.skill.frequency = temp[0];

        // Activation
        if (temp[1] === 'hit') {
          temp[1] = 'combo';
        }
        data.skill.activation = temp[1];

        // Chance
        data.skill.chance = el.match(new RegExp(/[0123456789]+(?=%)/i))[0];

        // Amount
        temp = el.substring(el.search('%') + 1);
        temp = temp.match(new RegExp(/[0123456789]+(?=\.)|[0123456789]+\s[a-z]*/i))[0].split(' ');
        data.skill.amount = temp[0];

        // Type
        if (temp.length === 1) {
          data.skill.type = 'heal';
        } else if (temp[1].toLowerCase() === 'seconds') {
          data.skill.type = 'lock';
        } else if (temp[1].toLowerCase() === 'points') {
          data.skill.type = 'score';
        } else {
          data.skill.type = temp[1];
        }

      }

    }

    /* STATS */

    data.stats = {};

    function getStats(parentEl) {
      var
        result = {
          smile: '-',
          pure: '-',
          cool: '-'
        };
      if (parentEl.length > 0) {
        parentEl = parentEl[0];
        try {
          result.smile = $(parentEl).find('.text-Smile')[0].innerText.trim();
          result.pure = $(parentEl).find('.text-Pure')[0].innerText.trim();
          result.cool = $(parentEl).find('.text-Cool')[0].innerText.trim();
        } catch (e) {
          console.log('missing set of attributes under:');
          console.log(parentEl);
        }
      }
      return result;
    }

    // Initial
    data.stats.initial = getStats($('.statistics_minimum'));

    // Un-Idolized Max
    data.stats.unIdolizedMax = getStats($('.statistics_non_idolized_maximum'));

    // Idolized Max
    data.stats.idolizedMax = getStats($('.statistics_idolized_maximum'));

    return data;
  }

  // If we are on a single card page
  if (document.location.href.match(/http:\/\/schoolido\.lu\/cards\/[0-9]+\/$/i)) {
    addEntry(getData(), function () {
      var
        cardNum = JSON.parse(document.location.href.match(/\/[0-9]+\/$/i)[0].replace(new RegExp(/\//g), ''));
      if (cardNum < MAX_CARD) {
        document.location.href = 'http://schoolido.lu/cards/' + (cardNum + 1);
      }

    });
  }
}());
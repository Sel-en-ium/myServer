/*jslint browser:true*/
(function () {
  'use strict';

  var
    CRED_ID_NAME = 'credsId';

  function sendReq(type, url, body, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(type, url, true);
    xmlhttp.setRequestHeader("Content-type","application/json");
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (String(xmlhttp.status).match(/^2/)) {
          var
            result = xmlhttp.responseText;
          try {
            result = JSON.parse(result);
          } catch (e) {

          }
          return callback(null, result);
        }
        return callback({code: xmlhttp.status, msg: xmlhttp.responseText});
      }
    };
    xmlhttp.send(JSON.stringify(body));
  }

  function getCred (id, callback) {
    sendReq('GET', 'http://localhost:8347/conquer/cred/' + id, null, function (err, creds) {
      if (err) {
        console.log(err);
      }
      callback(err, creds);
    });
  }

  function fillLogin (creds) {
    $('#account').val(creds.account);
    $('#pwd').val(creds.password);
    $('#area_id').val(1);
    $('#server_id').val(2)
    $('#check')[0].checked = false;
  }

  function fillForm (id, callback) {
    getCred(id, function (err, creds) {
      if (err) {
        console.log(err);
        return setTimeout(function () {
          fillForm(id, callback);
        }, 3000);
      }
      fillLogin(creds);
      callback();
    });
  }

  function clickEverywhereInElement ($element, offset, terminateCheck) {
    var
      x, y,
      dist,
      i = 0,
      xStart = $element.offset().left,
      yStart = $element.offset().top,
      width = $element.width(),
      height = $element.height();

    while (!terminateCheck()) {
      dist = i * offset;
      x = xStart + (dist % width);
      y = yStart + Math.floor(dist/width);
      if (x < xStart || x > xStart + width || y < yStart || y > yStart + height) {
        return; // We've clicked everywhere
      }
      $(document.elementFromPoint(x, y)).click();
    }
  }

  function doWhen(func, callback) {
    if (func()) {
      callback();
    } else {
      setTimeout(function () {
        doWhen(func, callback);
      });
    }
  }

  function main () {
    doWhen(function () {
      return $('#login_show').is(':visible');
    }, function () {
      $('#login_show').click();
      var
        credId = JSON.parse(localStorage.getItem(CRED_ID_NAME) || 0);
      fillForm(credId, function () {
      });
      $('#vcode').val('').focus().click();
    });
  }

  $(document).keypress(function(e) {
    if(e.which == 13) { //enter
      $('#login_btn').click();
      doWhen(
        function () {
          return !$('#login_btn').is(':visible') && $('#commonbtn').is(':visible');
        },
        function () {
          $('#commonbtn').click();
          sendReq('GET', 'http://event.co.99.com/return/?r=/check/checkValue', null, function (stuff) {

            //$('.checkbtn').click();
            $('.box.b1').click();
            $('#commonbtn').click();
          });
        }
      );
    } else if(e.which == 32) { //space
      var
        credId = JSON.parse(localStorage.getItem(CRED_ID_NAME) || 0);
      credId += 1;
      localStorage.setItem(CRED_ID_NAME, credId);
      $('#commonbtn').click();
      $('#signout_btn').click();
      main();
    }
  });

  main();

}());
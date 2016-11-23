/**
 * if(!confirm('Are you sure?')) return;
 * BlessRxrSetter
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com
 * @package
 * @subpackage
 * @encoding UTF-8
 */

// http://glat.info/jscheck/
/*global $, jQuery, $adm, $E, confirm, console, alert, JSON, HTMLInputElement define */

// 명료한 Javascript 문법을 사용 한다.
"use strict";

(function ($, window, document) {

  /**
   * AMD(Asynchronous Module Definition)
   */
  define('Bless/BlessEvent/getWin', [], function () {
    return function (menu, title, width, height, top, left) {
      return $E('div').win({
        title: title,
        parent: menu,
        top: top || 0,
        left: left || 128,
        width: width || 'auto',
        height: height || 'auto',
        buttonpane: true,
        screen_toggle: true,
        minimum: true,
        status: true,
        resizable: true,
        draggable: true,
        'extends': true
      });
    };
  });

  define(['Bless/BlessEvent/getWin', 'beans/Bless/BlessDesc'], function (getWin, Desc) {

    return function BlessRxrSetter(arg1, arg2) {

      var menu = this;

      var ta_server, serverList;
      var today = $adm.getDate('Y-m-d H:i:s', new Date()) + '.0';


      menu.ajaxAsync('getServerInfo').then(function (server) {
        ta_server = $E('select', {name: 'server_id'}).selectOptions(server, {text: 'name', value: 'server_id', sort: false});
        serverList = server;
        setMenu();
        //setSetter();        setLive();        setHistory();        //getLog();
      });

      var leftmenu = $E('div').win({
        parent: menu,
        title: 'Menu',
        width: 125,
        height: 700,
        top: 0,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      function setMenu() {
        leftmenu.append($E('button').text('Sierge of castra').button().width('98%').click(specialWar));
        leftmenu.append($E('button').text('Domination contract').button().width('98%').click(coAuction));
        leftmenu.append($E('button').text('Capital war').button().width('98%').click(roWar));
        leftmenu.append($E('button').text('Raid').button().width('98%').click(fieldRaid));
        leftmenu.append($E('button').text('ServerEffect\n(Buff)').button().width('98%').click(serverBuff));
      }

      function specialWar() {
        var setter = getWin(menu, 'setSpecialWar', 400, 700);
        var icon = $E('text').validate({required: true, maxLength: 4}).css({'text-align': 'right', width: 190}).val('0000'),
              wait = $E('text').validate({required: true, maxLength: 2}).css({'text-align': 'right', width: 190}).val('00'),
              play = $E('text').validate({required: true, maxLength: 2}).css({'text-align': 'right', width: 190}).val('00'),
              session = $E('text').validate({required: true, maxLength: 2}).css({'text-align': 'right', width: 190}).val('00');
        var b_setSpecialWar = $E('button').text('Set').button().css({'width': '99%'}).click(function () {
          var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('setSpecialWar', targetServer, serverCount, icon.val(), wait.val(), play.val(), session.val(), function (r) {
            var resultWin = getWin(menu, 'Rest', 1200, 500, 0, 540);
            resultWin.ajaxAsync('getJorbiResult', r.AdmTID, function (result) {
              resultWin.clientTable(result, {width: '100%'});
            });
          });
        });

        var b_endSpecialWar = $E('button').text('close(each session)').button().css({'width': '99%'}).click(function () {
          var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('endSpecialWar', targetServer, serverCount, session.val(), function (r) {
            var resultWin = getWin(menu, 'Result', 1200, 500, 0, 540);
            resultWin.ajaxAsync('getJorbiResult', r.AdmTID, function (result) {
              resultWin.clientTable(result, {width: '100%'});
            });
          });
        });

        var b_endSpecialWarAll = $E('button').text('close every sessions').button().css({'width': '99%'}).click(function () {
          var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('endSpecialWar', targetServer, serverCount, '-1', function (r) {
            var resultWin = getWin(menu, 'Result', 1200, 500, 0, 540);
            resultWin.ajaxAsync('getJorbiResult', r.AdmTID, function (result) {
              resultWin.clientTable(result, {width: '100%'});
            });
          });
        });


          var serverCheckboxDiv = $E('div'),
                  serverCheckbox = [],
                  serverCart = [];

          serverList.forEach(function (row) {
            var serverRow = [];
            serverCheckbox[row.server_id] = $E('check').attr("checked", false);
            serverRow.push(row.name);
            serverRow.push(serverCheckbox[row.server_id]);
            serverCart.push(serverRow);
          });

          serverCheckboxDiv.clientTable(serverCart, {
            field: [0, 1],
            head: ['Server', 'Checkbox'],width:'95%',
            pagesize: 5,
            footer: false
          });


          setter.verticalTable([{
              'Target server': serverCheckboxDiv,
              'Beginning time': icon,
              'Waiting time': wait,
              'Playing time': play,
              'TargetSessionCount': session
            }], {width: '100%'}).append('<br/>', b_setSpecialWar).append('<br/>', b_endSpecialWar);//.append('<br/>', b_endSpecialWarAll);

        }

      function coAuction(){

        var setter = getWin(menu, 'setCoAuction', 400, 700);
        var starthh = $E('text').validate({required: true, maxLength: 2}).css({'text-align': 'right', width: 190}).val('00'),
              startmm = $E('text').validate({required: true, maxLength: 2}).css({'text-align': 'right', width: 190}).val('00'),
              playmm = $E('text').validate({required: true, maxLength: 2}).css({'text-align': 'right', width: 190}).val('00');
        var b_setCoAuction = $E('button').text('Set').button().css({'width': '99%'}).click(function () {
          var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('setCoAuction', targetServer, serverCount, starthh.val(), startmm.val(), playmm.val(), function (r) {
            var resultWin = getWin(menu, 'Result', 1200, 500, 0, 540);
            resultWin.ajaxAsync('getJorbiResult', r.AdmTID, function (result) {
              resultWin.clientTable(result, {width: '100%'});
            });
          });
        });

        var b_endCoAuction = $E('button').text('Close').button().css({'width': '99%'}).click(function () {
          var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('endCoAuction', targetServer, serverCount, function (r) {
            var resultWin = getWin(menu, 'Result', 1200, 500, 0, 540);
            resultWin.ajaxAsync('getJorbiResult', r.AdmTID, function (result) {
              resultWin.clientTable(result, {width: '100%'});
            });
          });
        });


          var serverCheckboxDiv = $E('div'),
                  serverCheckbox = [],
                  serverCart = [];

          serverList.forEach(function (row) {
            var serverRow = [];
            serverCheckbox[row.server_id] = $E('check').attr("checked", false);
            serverRow.push(row.name);
            serverRow.push(serverCheckbox[row.server_id]);
            serverCart.push(serverRow);
          });

          serverCheckboxDiv.clientTable(serverCart, {
            field: [0, 1],
            head: ['Server', 'Checkbox'],width:'95%',
            pagesize: 5,
            footer: false
          });


          setter.verticalTable([{
              'Target server': serverCheckboxDiv,
              'Start hour': starthh,
              'Start minute': startmm,
              'runtime': playmm
            }], {width: '100%'}).append('<br/>', b_setCoAuction).append('<br/>', b_endCoAuction);

      }

      function roWar() {
        var setter = getWin(menu, 'setRoWar', 400, 700);
        var applystart = $E('text').validate({required: true, maxLength: 4}).css({'text-align': 'right', width: 190}).val('0000'),
              applyend = $E('text').validate({required: true, maxLength: 4}).css({'text-align': 'right', width: 190}).val('0000'),
              rostart = $E('text').validate({required: true, maxLength: 4}).css({'text-align': 'right', width: 190}).val('0000');
        var realm = $E('select').selectOptions({0:'Heiran', 1:'Union'});
        var b_setRoWar = $E('button').text('Set').button().css({'width': '99%'}).click(function () {
          var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('setRoWar', targetServer, serverCount, realm.val(), applystart.val(), applyend.val(), rostart.val(), function (r) {
            var resultWin = getWin(menu, 'Result', 1200, 500, 0, 540);
            resultWin.ajaxAsync('getJorbiResult', r.AdmTID, function (result) {
              resultWin.clientTable(result, {width: '100%'});
            });
          });
        });

        var b_endRoWar = $E('button').text('close').button().css({'width': '99%'}).click(function () {
          var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('endRoWar', targetServer, serverCount, realm.val(), function (r) {
            var resultWin = getWin(menu, 'Result', 1200, 500, 0, 540);
            resultWin.ajaxAsync('getJorbiResult', r.AdmTID, function (result) {
              resultWin.clientTable(result, {width: '100%'});
            });
          });
        });


          var serverCheckboxDiv = $E('div'),
                  serverCheckbox = [],
                  serverCart = [];

          serverList.forEach(function (row) {
            var serverRow = [];
            serverCheckbox[row.server_id] = $E('check').attr("checked", false);
            serverRow.push(row.name);
            serverRow.push(serverCheckbox[row.server_id]);
            serverCart.push(serverRow);
          });

          serverCheckboxDiv.clientTable(serverCart, {
            field: [0, 1],
            head: ['Server', 'Checkbox'],width:'95%',
            pagesize: 5,
            footer: false
          });


          setter.verticalTable([{
              'Targetserver': serverCheckboxDiv,
              'Realm': realm,
              'Starttime': applystart,
              'Endtime': applyend,
              'Ro Starttime': rostart
            }], {width: '100%'}).append('<br/>', b_setRoWar).append('<br/>', b_endRoWar);
      }

      function fieldRaid() {
        //Quantran / Brocadia / Melagium
        var setter = getWin(menu, 'setFieldRaid', 400, 700);
        var id = $E('select').selectOptions({
          1:'Quantran/Conflict area',
          2:'Quantran/Union',
          3:'Quantran/heiran',
          4:'Brocadia/Conflict area',
          5:'Brocadia/Union',
          6:'Brocadia/heiran',
          7:'Melagium/Conflict area',
          8:'Melagium/Union',
          9:'Melagium/heiran'
        });
        var b_setFieldRaid = $E('button').text('Set').button().css({'width': '99%'}).click(function () {
          var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('setFieldRaid', targetServer, serverCount, id.val(), function (r) {
            var resultWin = getWin(menu, 'Result', 1200, 500, 0, 540);
            resultWin.ajaxAsync('getJorbiResult', r.AdmTID, function (result) {
              resultWin.clientTable(result, {width: '100%'});
            });
          });
        });

        var b_endFieldRaid = $E('button').text('close').button().css({'width': '99%'}).click(function () {
          var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('endFieldRaid', targetServer, serverCount, id.val(), function (r) {
            var resultWin = getWin(menu, 'Result', 1200, 500, 0, 540);
            resultWin.ajaxAsync('getJorbiResult', r.AdmTID, function (result) {
              resultWin.clientTable(result, {width: '100%'});
            });
          });
        });


          var serverCheckboxDiv = $E('div'),
                  serverCheckbox = [],
                  serverCart = [];

          serverList.forEach(function (row) {
            var serverRow = [];
            serverCheckbox[row.server_id] = $E('check').attr("checked", false);
            serverRow.push(row.name);
            serverRow.push(serverCheckbox[row.server_id]);
            serverCart.push(serverRow);
          });

          serverCheckboxDiv.clientTable(serverCart, {
            field: [0, 1],
            head: ['Server', 'Checkbox'],width:'95%',
            pagesize: 5,
            footer: false
          });


          setter.verticalTable([{
              '대상서버': serverCheckboxDiv,
              'Boss/생성지역': id
            }], {width: '100%'}).append('<br/>', b_setFieldRaid).append('<br/>', b_endFieldRaid);
      }

      function serverBuff() {
        var setter = getWin(menu, 'setServerBuff', 400, 700);
        var buff = $E('select');

        var b_setBuff = $E('button').text('Set').button().css({'width': '99%'}).click(function () {
        var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('setServerBuff', targetServer, serverCount, buff.val(), function (r) {
            var resultWin = getWin(menu, 'Result', 1200, 500, 0, 540);
            r.forEach(function(row){
              resultWin.ajaxAsync('getJorbiResult', row.AdmTID, function (result) {
                resultWin.clientTable(result, {width: '100%'});
              });
            });
          });
        });

        var b_endBuff = $E('button').text('close').button().css({'width': '99%'}).click(function () {
          var targetServer = '', commaParam = true, serverCount = 0;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
                serverCount++;
              } else {
                targetServer += ',' + row.server_id;
                serverCount++;
              }
            }
          });
          if(!confirm('Are you sure?')) return;
          setter.ajaxAsync('endServerBuff', targetServer, serverCount, function (r) {
            var resultWin = getWin(menu, 'Result', 1200, 500, 0, 540);
            r.forEach(function(row){
              resultWin.ajaxAsync('getJorbiResult', row.AdmTID, function (result) {
                resultWin.clientTable(result, {width: '100%'});
              });
            });
          });
        });


          var serverCheckboxDiv = $E('div'),
                  serverCheckbox = [],
                  serverCart = [];

          serverList.forEach(function (row) {
            var serverRow = [];
            serverCheckbox[row.server_id] = $E('check').attr("checked", false);
            serverRow.push(row.name);
            serverRow.push(serverCheckbox[row.server_id]);
            serverCart.push(serverRow);
          });

          serverCheckboxDiv.clientTable(serverCart, {
            field: [0, 1],
            head: ['Server', 'Checkbox'],width:'95%',
            pagesize: 5,
            footer: false
          });


          menu.ajaxAsync('getBuffList').then(function(r){
            debug(buff);
            var buffCart = {};
            r.forEach(function (row) {
              var buffrow = {};
              buffrow[row.cid] = row.field_name;
              $.extend(buffCart, buffrow);
            });
            debug(buffCart);
            buff.selectOptions(buffCart);
            setter.verticalTable([{
              'TagetServer': serverCheckboxDiv,
              'Effect(Buff)': buff
            }], {width: '100%'}).append('<br/>', b_setBuff).append('<br/>', b_endBuff);
          });

      }

    };

  });

})(jQuery, this, this.document);

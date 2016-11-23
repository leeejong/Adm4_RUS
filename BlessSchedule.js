/**
 * BlessSchedule
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2016.11.17
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
  define('Bless/BlessEventManager/getResultWindow', [], function () {
    return function (menu, title, width, height, top, left) {
      return $E('div').win({
        title: 'Result :: ' + title,
        parent: menu,
        top: top || 130,
        left: left || 410,
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

  define(['Bless/BlessEventManager/getResultWindow', 'adm/adm.sendProcess', 'beans/Bless/BlessDesc'], function (getResultWindow, sendProcess, Desc) {

    return function BlessSchedule(arg1, arg2) {

      var menu = this;
      var ta_server, serverList, ta_function, functionList;
      var today = $adm.getDate('Y-m-d H:i:s', new Date()) + '.0';
      var isDev = $adm.getConfig('Server').EnvLocation === 'dev';

      var winSetter, winDelete, winSchedule, stateList;
      setWindows();

      menu.ajax({
        methodcall: ['getServerInfo', 'getFunctionInfo'],
        success: function (server, functions) {
          ta_server = $E('select', {name: 'server_id'}).selectOptions(server, {text: 'name', value: 'server_id', sort: false});
          ta_function = $E('select', {name: 'function_id'}).selectOptions(functions, {text: 'name', value: 'function_id', sort: false}).css({'text-align': 'center', width: 250});
          serverList = server;
          functionList = [];
          functions.forEach(function(row){
            functionList[row.function_id] = row.name;
          });
          stateList = {
            1 : 'inSchedule',
            2 : 'Complete',
            3 : 'disordered'
          }
          setSetter();
          setDeleteWin();
          setScheduleWin();
        }
      });

      function setSetter() {
        winSetter.empty();
        var start_span = $E('span').text("Startdate").css({'background-color': 'black', 'color': 'white', 'padding': 5}),
                start_day = $E('text').validate({required: true, date: 'Y-m-d'}).css({'text-align': 'center', width: 100}),
                start_time = $E('text').text('000000').validate({required: true, time: 'H:i:s'}).css({'text-align': 'center', width: 80}).val('000000'),
                end_span = $E('span').text("End date").css({'background-color': 'black', 'color': 'white', 'padding': 5}),
                end_day = $E('text').validate({required: true, date: 'Y-m-d'}).css({'text-align': 'center', width: 100}),
                end_time = $E('text').text('000000').validate({required: true, time: 'H:i:s'}).css({'text-align': 'center', width: 80}).val('235959');

        var parameter1 = $E('text').validate({required: true}).css({'text-align': 'center', width: '99%'}),
                parameter2 = $E('text').validate({required: false}).css({'text-align': 'center', width: '99%'}),
                parameter3 = $E('text').validate({required: false}).css({'text-align': 'center', width: '99%'}),
                parameter4 = $E('text').validate({required: false}).css({'text-align': 'center', width: '99%'}),
                parameter5 = $E('text').validate({required: false}).css({'text-align': 'center', width: '99%'}),
                parameter6 = $E('text').validate({required: false}).css({'text-align': 'center', width: '99%'}),
                memo = $E('textarea').validate({required: true, maxByte: 80, innerMsg: true}).css({'box-sizing': 'border-box', width: '99%', height: 20}).variablesave('BlessSchedule.memo');

        var b_insertEvent = $E('button').text('Set').button().css({'width': '99%'}).click(function () {
          if (!winSetter.validate())
            return;
          if (start_day.val() > end_day.val()) {
            alert('Error');
            return;
          } else if (start_day.val() === end_day.val() && start_time.val() > end_time.val()) {
            alert('Error.');
            return;
          }
          if (!confirm('Are you sure?'))
            return;

          var startday = start_day.val().substring(0, 4) + '' + start_day.val().substring(4, 6) + '' + start_day.val().substring(6, 8) + '' + start_time.val().substring(0, 2) + '' + start_time.val().substring(2, 4) + '' + start_time.val().substring(4, 6);
          var endday = end_day.val().substring(0, 4) + '-' + end_day.val().substring(4, 6) + '-' + end_day.val().substring(6, 8) + ' ' + end_time.val().substring(0, 2) + ':' + end_time.val().substring(2, 4) + ':' + end_time.val().substring(4, 6);

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

          if(!(serverCount>0)){ alert('no target server'); return; }
          if (ta_function.val()==='5' &&  serverCount>1){
            alert('Please insert one server for "serverBuff" function.'); return;
          }

          menu.ajaxAsync('insertSchedule', ta_function.val(), startday, targetServer, serverCount,
                  parameter1.val(), parameter2.val(), parameter3.val(), parameter4.val(), parameter5.val(), parameter6.val(), memo.val()).then(function () {
            alert('Complete.');
            setScheduleWin();
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
          head: ['Server', 'Checkbox'],
          pagesize: 3,
          width : '96%',
          column_width : ['150','?'],
          footer : false
        });

        winSetter.verticalTable([{
            'Function_id': ta_function,
            'Duration': $E('div').append(start_span).append(start_day).append(start_time),
            'TargetServer': serverCheckboxDiv,
            'Parameter1': parameter1,
            'Parameter2': parameter2,
            'Parameter3': parameter3,
            'Parameter4': parameter4,
            'Parameter5': parameter5,
            'Parameter6': parameter6,
            'Memo' : memo
          }], {width: '100%'}).append('<br/>', b_insertEvent);

      }

      function setDeleteWin() {
        winDelete.empty();
        var id = $E('text').css({'width':'99%','text-align':'center'}).validate({requried:true,onlynumber:true});
        winDelete.append(id);
        winDelete.append($E('button').button().text('Remove Schedule').css({'width': '99%', 'height': '60px'}).click(function () {
          if(!winDelete.validate()) return;
          if(confirm('Are you sure?'))
            menu.ajaxAsync('deleteSchedule', id.val()).then(function(){
              alert('Complete.');
              setScheduleWin();
            });
        }));
      }


      function setScheduleWin() {
        winSchedule.empty();

        menu.ajaxAsync('getSchedule').then(function (r) {

          var where = [{type: 'operator', operator: '>=', column: 'end_date', value: today}];
          var scheduleField = ['id', 'state', 'time','finish_date', 'function_id', 'server', 'server_count', 'param1', 'param2', 'param3', 'param4', 'memo','admtid', 'author','check'];
          var scheduleEditField = ['event_name', 'ref_proc', 'ref_table', 'str_date', 'end_date'];

          winSchedule.clientTable(r, {
            field: scheduleField,
            head: Desc.EventManagerHeader,
            pagesize: 12,
            width: '100%',
            translate: {
              function_id : functionList,
              state : stateList,
              str_date: 'Y-m-d H:i:s',
              end_date: 'Y-m-d H:i:s'
            },
            translate_realtime : {
              check : function(v, cname, row){
                return $E('button').text('Check').button().click(function(){
                  var resultWin = getResultWindow(menu, 'Result', 1200, 300, 0, 540);
                    resultWin.ajaxAsync('getJorbiResult', row.admtid, function (result) {
                    resultWin.clientTable(result, {width: '100%'});
                  });
                })
              }
            }
          });

        })

      }

      function setWindows() {
        winSetter = $E('div').win({
          parent: menu,
          title: 'Setter',
          width: 390,
          height: 500,
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

        winDelete = $E('div').win({
          parent: menu,
          title: 'deleteEvent',
          width: 390,
          height: 125,
          top: 502,
          buttonpane: false,
          close: false,
          screen_toggle: false,
          minimum: false,
          status: false,
          resizable: false,
          draggable: false,
          'extends': false
        });


        winSchedule = $E('div').win({
          parent: menu,
          title: 'BOOKING SCHEDULE',
          left: 400,
          width: 1180,
          height: 630,
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

      }
    };
  });
})(jQuery, this, this.document);

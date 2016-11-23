/**
 * BlessEventManager
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2016.1.19
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

    return function BlessEventManager(arg1, arg2) {

      var menu = this;
      var ta_server, serverList, latestEvent, nextEvent;
      var today = $adm.getDate('Y-m-d H:i:s', new Date()) + '.0';
      var isDev = $adm.getConfig('Server').EnvLocation === 'dev';


      //There are some differences between Dev windows and Real windows.
      var winSetter, winDelete, winSync, winLogEvent, winLogType, winMiddleEvent, winMiddleSchedule;
      isDev ? setDevWindows() : setRealWindows();

      menu.ajax({
        methodcall: ['getServerInfo','getLatestEvent'],
        success: function(server, event_id){
          ta_server = $E('select', {name: 'server_id'}).selectOptions(server, {text: 'name', value: 'server_id', sort: false});
          serverList = server;
          latestEvent = parseInt( event_id );
          nextEvent   = latestEvent+1;

          if (isDev) {
            setSetter();
            setDeleteWin();
            //setSyncer();
            setLogEvent(isDev);
            setLogType(isDev);
            setMiddleEvent(isDev);
            setMiddleSchedule(isDev);
          } else {
            setSetter();
            setDeleteWin();
            setLogEvent(isDev);
            setLogType(isDev);
            setMiddleEvent(isDev);
            setMiddleSchedule(isDev);
          }
        }
      })

      function setSetter() {
        winSetter.empty();
        var start_span = $E('span').text("Startdate").css({'background-color': 'black', 'color': 'white', 'padding': 5}),
              start_day = $E('text').validate({required: true, date: 'Y-m-d'}).css({'text-align': 'center', width: 100}),
              start_time = $E('text').text('000000').validate({required: true, time: 'H:i:s'}).css({'text-align': 'center', width: 80}).val('000000'),
              end_span = $E('span').text("Enddate").css({'background-color': 'black', 'color': 'white', 'padding': 5}),
              end_day = $E('text').validate({required: true, date: 'Y-m-d'}).css({'text-align': 'center', width: 100}),
              end_time = $E('text').text('000000').validate({required: true, time: 'H:i:s'}).css({'text-align': 'center', width: 80}).val('235959');
        var eventName = $E('text').validate({required: true}).css({'text-align': 'center', width: '99%'});
        var title = $E('text').validate({required: true}).css({'text-align': 'center', width: '99%'});
        var type = $E('text').validate({required: true, onlynumber:true}).css({'text-align': 'center', width: '99%'}).val(2);
        var eventNumber = $E('text').validate({required: true, onlynumber:true}).css({'text-align': 'center', width: '99%'}).val(nextEvent);
        var reward_cid = $E('text').validate({required: true, onlynumber: true}).css({'text-align': 'center', width: '99%'});
        var procedure_log = $E('text').validate({required: true}).css({'text-align': 'center', width: '99%'});
        var procedure_middle = $E('text').validate({required: true}).css({'text-align': 'center', width: '99%'});
        var condition1 = $E('text').validate({}).css({'text-align': 'center', width: 100}),
              condition2 = $E('text').validate({}).css({'text-align': 'center', width: 100});

        var table = $E('text').validate({required: true}).css({'text-align': 'center', width: '99%'});

        var b_insertEvent = $E('button').text('Set').button().css({'width': '99%'}).click(function () {

          if (!winSetter.validate())
            return;
          if (start_day.val() > end_day.val()) {
            alert('Error');
            return;
          }
          else if (start_day.val() === end_day.val() && start_time.val() > end_time.val()) {
            alert('Error.');
            return;
          }
          if (!confirm('Are you sure?'))
            return;

          var startday = start_day.val().substring(0, 4) + '-' + start_day.val().substring(4, 6) + '-' + start_day.val().substring(6, 8) + ' ' + start_time.val().substring(0, 2) + ':' + start_time.val().substring(2, 4) + ':' + start_time.val().substring(4, 6);
          var endday = end_day.val().substring(0, 4) + '-' + end_day.val().substring(4, 6) + '-' + end_day.val().substring(6, 8) + ' ' + end_time.val().substring(0, 2) + ':' + end_time.val().substring(2, 4) + ':' + end_time.val().substring(4, 6);
          var targetServer = '', commaParam = true;
          serverList.forEach(function (row) {
            if (serverCheckbox[row.server_id][0].checked) {
              if (commaParam) {
                targetServer += row.server_id;
                commaParam = false;
              } else {
                targetServer += ',' + row.server_id;
              }
            }
          });

          menu.ajaxAsync('insertEvent', eventName.val(), title.val(), eventNumber.val(), type.val(), startday, endday,
            procedure_log.val(), procedure_middle.val(), table.val(),
            condition1.val(), condition2.val(), targetServer, reward_cid.val()).then(function(){
              alert('Complete.');
              nextEvent++;
              latestEvent++;
              setLogEvent(isDev);
              setLogType(isDev);
              setMiddleEvent(isDev);
              setMiddleSchedule(isDev);
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
          serverCart.push(serverRow)
        });

        serverCheckboxDiv.clientTable( serverCart, {
          field : [0,1],
          head : ['Server','Checkbox'],
          pagesize : 3
        });

        winSetter.verticalTable([{
            'Event_Name' : eventName,
            'TITLE': title,
            'Event_ID': eventNumber,
            'Duration': $E('div').append(start_span).append(start_day).append(start_time).append('<br>').append(end_span).append(end_day).append(end_time),
            'PROC_LOG' : procedure_log,
            'PROC_Middle' : procedure_middle,
            'Table' : table,
            'Condition' : $E('div').append('1: ',condition1,' 2: ', condition2),
            'TargetServer': serverCheckboxDiv,
            'ITEM_ID': reward_cid
          }], {width: '100%'}).append('<br/>', b_insertEvent);

      }

      function setDeleteWin() {
        winDelete.empty();
        var event = $E('text').val(latestEvent).css({'width':'99%','text-align':'center'}).validate({requried:true,onlynumber:true});
        winDelete.append(event);
        winDelete.append($E('button').button().text('Delete specifications about Event').css({'width': '99%', 'height': '60px'}).click(function () {
          if(!winDelete.validate()) return;
          if(confirm('Are you sure?'))
            menu.ajaxAsync('deleteEvent',event.val()).then(function(){
              alert('Complete.');
              setLogEvent(isDev);
              setLogType(isDev);
              setMiddleEvent(isDev);
              setMiddleSchedule(isDev);
            });
        }));
      }

      function setSyncer() {
        if(!winSync.validate()) return;
        winSync.empty();
        var event = $E('text').val(nextEvent).css({'width':'99%','text-align':'center'}).validate({requried:true,onlynumber:true});
        winSync.append(event);
        winSync.append($E('button').button().text('Dev->Live Sync').css({'width': '99%', 'height': '60px'}).click(function () {
          if(confirm('Are you sure?'))
            menu.ajaxAsync('syncEvent',event.val()).then(function(){alert('Complete');});
        }));
      }

      function setLogEvent(isDev) {
        winLogEvent.empty();
        var where = [{type: 'operator', operator: '>=', column: 'end_date', value: today}];
        var logEventField = ['event_id','event_name','ref_proc','ref_table','str_date','end_date'];
        var logEditField  = ['event_name','ref_proc','ref_table','str_date','end_date'];

        if (isDev) {
          winLogEvent.clientTable(null, {
            field : logEventField,
            head : Desc.EventManagerHeader,
            connect: {
              menu: menu,
              db: 'bless_logw_01',
              table: 'bl_bt_log_event',
              edit: logEditField,
              insert: false,
              limit: 1000,
            },
            pagesize: 8,
            width: '100%',
            translate: {
              str_date: 'Y-m-d H:i:s',
              end_date: 'Y-m-d H:i:s'
            }
          });
        }
        else {
          winLogEvent.buttonTab([
            {
              name: 'LOG_1',
              contents: $adm.clientTable(null, {
                field : logEventField,
                head : Desc.EventManagerHeader,
                connect: {
                  menu: menu,
                  db: 'bless_logw_01',
                  table: 'bl_bt_log_event',
                  edit: logEditField,
                  insert: false,
                  limit: 1000
                },
                pagesize: 4,
                width: '100%',
                translate: {
                  str_date: 'Y-m-d H:i:s',
                  end_date: 'Y-m-d H:i:s'
                }
              })
            }
          ]);
        }
      }

      function setLogType(isDev) {
        winLogType.empty();
        var logTypeField = ['event_id','log_type'];
        if (isDev) {
          winLogType.clientTable(null, {
            field : logTypeField,
            head : Desc.EventManagerHeader,
            connect: {
              menu: menu,
              db: 'bless_logw_01',
              table: 'bl_bt_log_event_type',
              edit: ['*'],
              insert: true,
              limit: 1000,
            },
            pagesize: 6,
            width: '100%'
          });
        }
        else {
          winLogType.buttonTab([
            {
              name: 'LOG_1',
              contents: $adm.clientTable(null, {
                field : logTypeField,
                head : Desc.EventManagerHeader,
                connect: {
                  menu: menu,
                  db: 'bless_logw_01',
                  table: 'bl_bt_log_event_type',
                  edit: ['*'],
                  insert: true,
                  limit: 1000
                },
                pagesize: 3,
                width: '100%'
              })
            }
          ]);
        }
      }

      function setMiddleEvent() {
        var pageSize = 9;
        if(!isDev) pageSize = 4;
        winMiddleEvent.empty();
        winMiddleEvent.clientTable(null, {
          field : ['event_id','ref_proc','reg_name'],
          head : Desc.EventManagerHeader,
          connect: {
            menu: menu,
            db: 'bless_middle',
            table: 'dbo.BL_BT_LOG_EVENT',
            edit: ['ref_proc','reg_name'],
            insert: false,
            limit: 1000
          },
          pagesize: pageSize,
          width: '100%',
          translate : {
            reg_date : 'Y-m-d H:i:s'
          }
        });

      }
      function setMiddleSchedule() {
        var pageSize = 9;
        if(!isDev) pageSize = 10;
        winMiddleSchedule.empty();
        winMiddleSchedule.clientTable(null, {
          field : ['event_id','title','world_list','condition_1','condition_2','cash_item_id','str_date','end_date','adm_name'],
          head : Desc.EventManagerHeader,
          connect: {
            menu: menu,
            db: 'bless_middle',
            table: 'dbo.BL_PT_ADM_LOG_SCHEDULE',
            edit: ['title','world_list','condition_1','condition_2','cash_item_id','str_date','end_date'],
            insert: false,
            limit: 1000
          },
          pagesize: pageSize,
          width: '100%',
          translate: {
            str_date: 'Y-m-d H:i:s',
            end_date: 'Y-m-d H:i:s'
          }
        })
      }


      function setDevWindows() {
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

        winSync = $E('div').win({
          parent: menu,
          title: 'LiveSync',
          width: 390,
          height: 125,
          top: 630,
          buttonpane: false,
          close: false,
          screen_toggle: false,
          minimum: false,
          status: false,
          resizable: false,
          draggable: false,
          'extends': false
        });

        winLogEvent = $E('div').win({
          parent: menu,
          title: 'LOG.BL_BT_LOG_EVENT',
          left: 400,
          width: 1180,
          height: 350,
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

        winLogType = $E('div').win({
          parent: menu,
          title: 'LOG.BL_LOG_EVENT_TYPE',
          left: 1580,
          width: 270,
          height: 350,
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

        winMiddleEvent = $E('div').win({
          parent: menu,
          title: 'Middle.BL_BT_LOG_EVENT',
          left: 400,
          top: 355,
          width: 350,
          height: 400,
          buttonpane: false,
          close: false,
          screen_toggle: false,
          minimum: false,
          status: false,
          resizable: false,
          draggable: false,
          'extends': false
        });

        winMiddleSchedule = $E('div').win({
          parent: menu,
          title: 'Middle.BL_PT_ADM_LOG_SCHEDULE',
          left: 750,
          top: 355,
          width: 1100,
          height: 400,
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

      function setRealWindows() {
        setDevWindows();
        return;

        winDelete = $E('div').win({
          parent: menu,
          title: 'deleteEvent',
          width: 350,
          height: 150,
          top: 605,
          buttonpane: false,
          close: false,
          screen_toggle: false,
          minimum: false,
          status: false,
          resizable: false,
          draggable: false,
          'extends': false
        });

        winLogEvent = $E('div').win({
          parent: menu,
          title: 'LOG.BL_BT_LOG_EVENT',
          left: 0,
          width: 1080,
          height: 350,
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

        winLogType = $E('div').win({
          parent: menu,
          title: 'LOG.BL_LOG_EVENT_TYPE',
          left: 1080,
          width: 370,
          height: 350,
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

        winMiddleEvent = $E('div').win({
          parent: menu,
          title: 'Middle.BL_BT_LOG_EVENT',
          left: 0,
          top: 355,
          width: 350,
          height: 250,
          buttonpane: false,
          close: false,
          screen_toggle: false,
          minimum: false,
          status: false,
          resizable: false,
          draggable: false,
          'extends': false
        });

        winMiddleSchedule = $E('div').win({
          parent: menu,
          title: 'Middle.BL_PT_ADM_LOG_SCHEDULE',
          left: 350,
          top: 355,
          width: 1100,
          height: 400,
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

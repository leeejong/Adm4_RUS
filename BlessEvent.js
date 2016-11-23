/**
 * BlessEvent
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2015.12.10
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
  define('Bless/BlessEvent/getResultWindow', [], function () {
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

  define(['Bless/BlessEvent/getResultWindow', 'adm/adm.sendProcess','beans/Bless/BlessDesc'], function (getResultWindow, sendProcess, Desc) {

    return function BlessEvent(arg1, arg2) {

      var menu = this;

      var ta_server, serverList;
      var today = $adm.getDate('Y-m-d H:i:s', new Date())+'.0';


      menu.ajaxAsync('getServerInfo').then(function (server) {
        ta_server = $E('select', {name: 'server_id'}).selectOptions(server, {text: 'name', value: 'server_id', sort: false});
        serverList = server;
        setSetter();        setLive();        setHistory();        //getLog();
      });

      var winSetter = $E('div').win({
        parent: menu,
        title: 'Setter',
        width: 390,
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

      var winLive = $E('div').win({
        parent: menu,
        title: 'Event List',
        left: 400,
        width: 950,
        height: 390,
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

      var winHistory = $E('div').win({
        parent: menu,
        title: 'Ended Event List',
        left: 400,
        top: 400,
        width: 950,
        height: 300,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

//      var winLog = $E('div').win({
//        parent: menu,
//        title: '지급로그',
//        left: 0,
//        top: 705,
//        width: 1350,
//        height: 180,
//        buttonpane: false,
//        close: false,
//        screen_toggle: false,
//        minimum: false,
//        status: false,
//        resizable: false,
//        draggable: false,
//        'extends': false
//      });

      function setSetter(){
        var start_span = $E('span').text("Startdate").css({'background-color':'black','color':'white','padding':5}),
            start_day = $E('text').validate({required: true, date:'Y-m-d'}).css({'text-align':'right',width:100}),
            start_time = $E('text').text('000000').validate({required: true, time:'H:i:s'}).css({'text-align':'right',width:100}).val('000000'),
            end_span = $E('span').text("Enddate").css({'background-color':'black','color':'white','padding':5}),
            end_day = $E('text').validate({required: true, date:'Y-m-d'}).css({'text-align':'right',width:100}),
            end_time = $E('text').text('000000').validate({required: true, time:'H:i:s'}).css({'text-align':'right',width:100}).val('235959');
        var title_span = $E('span').text("TITLE").css({'background-color':'black','color':'white','padding':5}),
            title      = $E('text').validate({required:true}).css({'text-align':'center',width:210});

        var reward_span = $E('span').text("REWARD CID").css({'background-color':'black','color':'white','padding':5}),
            reward_cid  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:182});

        var b_insertEvent = $E('button').text('SET').button().css({'width': '99%'}).click(function () {

          if (!winSetter.validate()) return;
          if(start_day.val()>end_day.val()){ alert('Error.'); return; }
          else if(start_day.val()===end_day.val() && start_time.val()>end_time.val()){
            alert('Error.'); return;
          }
          if(!confirm('Are you sure?')) return;

          var startday = start_day.val().substring(0,4)+'-'+start_day.val().substring(4,6)+'-'+start_day.val().substring(6,8)+' '+start_time.val().substring(0,2)+':'+start_time.val().substring(2,4)+':'+start_time.val().substring(4,6);
          var endday = end_day.val().substring(0,4)+'-'+end_day.val().substring(4,6)+'-'+end_day.val().substring(6,8)+' '+end_time.val().substring(0,2)+':'+end_time.val().substring(2,4)+':'+end_time.val().substring(4,6);
          var targetServer = '', commaParam=true;
          serverList.forEach(function(row){
            if(serverCheckbox[row.server_id][0].checked){
              if(commaParam){
                targetServer += row.server_id;
                commaParam = false;
              }else{
                targetServer += ','+row.server_id;
              }
            }
          });

          menu.ajaxAsync('insertEvent', targetServer, startday, endday, title.val(), reward_cid.val() );
          setLive(); setHistory();
        });

        var serverCheckboxDiv = $E('div'),
            serverCheckbox    = [],
            serverCart        = {};

        serverList.forEach(function( row ){
          var serverrow = {};
          serverCheckbox[row.server_id] = $E('check').attr("checked", false);
          serverrow[row.name] = serverCheckbox[row.server_id];
          $.extend( serverCart, serverrow );
        });
        serverCheckboxDiv.verticalTable([serverCart]);

        winSetter.verticalTable([{
            'Period' : $E('div').append(start_span).append(start_day).append(start_time).append('<br>').append(end_span).append(end_day).append(end_time),
            'Target' : serverCheckboxDiv,
            'Present Title' : $E('div').append(title_span).append(' ').append(title),
            'Reward' : $E('div').append(reward_span).append(' ').append(reward_cid),
          }], {width: '100%'}).append('<br/>', b_insertEvent);

      }
      function setLive(){
        winLive.empty();
        var where = [{type:'operator', operator:'>=', column:'end_date', value:today}];
        winLive.clientTable(null,{
          connect: {
            menu: menu,
            db: 'bless_middle',
            table: 'dbo.BL_PT_ADM_001_01',
            //edit:['*'],
            delete:true,
            insert:false,
            limit: 1000,
            where : where
          },
          field : ['event_no', 'title','world_list','cash_item_id','str_date','end_date','adm_name','reg_date'],
          head  : Desc.DBEvent,
          pagesize : 9,
          width: '100%',
        });

      }
      function setHistory(){
        winHistory.empty();
        var where = [ {type:'operator', operator:'<', column:'end_date', value:today} ];
        winHistory.clientTable(null,{
          connect: {
            menu: menu,
            db: 'bless_middle',
            table: 'dbo.BL_PT_ADM_001_01',
            edit:['*'],
            delete:false,
            insert:false,
            limit: 1000,
            where : where
          },
          field : ['event_no', 'title','world_list','cash_item_id','str_date','end_date','adm_name','reg_date'],
          head  : Desc.DBEvent,
          pagesize : 6,
          width: '100%',
        });

      }
      function getLog(){
        //var where = [ {type:'operator', operator:'<=', column:'end_date', value:new Date()} ];
        winLog.clientTable(null,{
          connect: {
            menu: menu,
            db: 'bless_middle',
            table: 'dbo.BL_PT_ADM_001_02',
            edit:['*'],
            delete:true,
            insert:false,
            limit: 1000,
            //where : where
          },
          field : ['event_no','usn','giftbox_id','reg_date'],
          pagesize : 2,
          width: '100%',
        })
      }
    };

  });

})(jQuery, this, this.document);

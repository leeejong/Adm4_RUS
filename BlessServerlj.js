/**
 * BlessServer
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2015.09.01
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
    define( ['beans/Pm/PmCRM.CFG.js', 'beans/Jorbi/highcharts.js'], function( CFG, HC ){

    /**
     * BlessServer Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessServer(arg1, arg2) {

      var menu = this;
      var desc = {
        open_login : {0:'서버 닫힘', 1:'서버 열림'},
        stop_all_trade : {0:'정지 아님',1:'정지'},
        stop_auction : {0:'정지 아님',1:'정지'},
        stop_mail : {0:'정지 아님',1:'정지'},
        stop_personal_trade : {0:'정지 아님',1:'정지'},
        stop_warehouse : {0:'정지 아님',1:'정지'},
        restrict_realm_hieron : {0:'제한없음',1:'LimitRealm',2:'System'},
        restrict_realm_union : {0:'제한없음',1:'LimitRealm',2:'System'}
      }
      var btn = $E('button').button().text('Refresh Cu state').css({width:850, height:25}).click(get);
      var wholeMinSetting, wholeMaxSetting, wholeDeltaSetting, eachMinSetting, eachMaxSetting, eachDeltaSetting;
      var wholeMin    = $E('text',{size:8}).variablesave('BlessServer.alertSettingWholeMin'),
          wholeMax    = $E('text',{size:8}).variablesave('BlessServer.alertSettingWholeMax'),
          wholeDelta  = $E('text',{size:8}).variablesave('BlessServer.alertSettingWholeDelta'),
          eachMin   = $E('text',{size:8}).variablesave('BlessServer.alertSettingEachMin'),
          eachMax   = $E('text',{size:8}).variablesave('BlessServer.alertSettingEachMax'),
          eachDelta = $E('text',{size:8}).variablesave('BlessServer.alertSettingEachDelta');

      var graphWin = $E('div').win({
        title         : 'Graph Window',
        parent        : menu,
        top           : 320,
        left          : 0,
        width         : 1350,
        height        : 430,
        buttonpane    : false,
        close         : true,
        screen_toggle : false,
        minimum       : false,
        resizable     : true,
        draggable     : false,
        'extends'     : false
      });
      var cuWin = $E('div').win({
        title         : 'Table Window',
        parent        : menu,
        top           : 0,
        left          : 0,
        width         : 1350,
        height        : 'auto',
        buttonpane    : false,
        close         : false,
        screen_toggle : false,
        minimum       : false,
        resizable     : true,
        draggable     : false,
        'extends'     : false
      });

      var alertWin = $E('div').win({
        title         : 'Alert Setting',
        parent        : menu,
        top           : 0,
        left          : 1350,
        width         : 110,
        height        : 750,
        buttonpane    : false,
        close         : false,
        screen_toggle : false,
        minimum       : false,
        resizable     : true,
        draggable     : false,
        'extends'     : false
      });
      //var alertDiv = $E('div').css({width:'100%', height:'770px', padding:'0 0 0 0', margin:'0 0 0 0'}).css("background-color","lightgray");
      var alertDiv = $E('div').css({width:'100%', height:'770px', padding:'0 0 0 0', margin:'0 0 0 0'});

      function setAlert(){
        menu.append(alertDiv);
        alertVariableSave();



        alertWin.append($E('span').text('blue-증가 ').css("background-color","skyblue")).append('<br>')
                .append($E('span').text('red-감소 ').css("background-color","pink")).append('<br>')
                .append($E('span').text('-1 : Off ').css("background-color","lightgray")).append('<br>');
        alertWin.clientTable([
                  ['Delta'],[wholeDelta],['Maximum'],[wholeMax],['Minimum'],[wholeMin],
                ], {
                  head: ['전체서버'],
                  footer: false,
                  width: '95%',
                });

        alertWin.clientTable([
                  ['Delta'],[eachDelta],['Maximum'],[eachMax],['Minimum'],[eachMin],
                ], {
                  head: ['개별서버'],
                  footer: false,
                  width: '95%',
                });

        alertWin.append('<br>')
                .append($E('button').button().text('저장').css({width:'95%', height:30}).click( alertVariableSave ));
      }

      function alertVariableSave(){

        wholeMinSetting = wholeMin.val();
        wholeMaxSetting = wholeMax.val();
        wholeDeltaSetting = wholeDelta.val();
        eachMinSetting = eachMin.val();
        eachMaxSetting = eachMax.val();
        eachDeltaSetting = eachDelta.val();

        if(wholeMinSetting=='') wholeMinSetting=-1;
        if(wholeMaxSetting=='') wholeMaxSetting=-1;
        if(wholeDeltaSetting=='') wholeDeltaSetting=-1;
        if(eachMinSetting=='') eachMinSetting=-1;
        if(eachMaxSetting=='') eachMaxSetting=-1;
        if(eachDeltaSetting=='') eachDeltaSetting=-1;
      }

      function get(){
        cuWin.empty();
        cuWin.append($E('button').button().text('Refresh Cu state').css({width:1330, height:25}).click(function(){cuWin.ajaxAsync('deleteCache');get();}));
        cuWin.ajax({
          methodcall: ['getCU'],
          success: function (jorbiCU) {
            cuWin.clientTable(jorbiCU[0],{
              title:'전서버 실시간 정보',
              width:'100%',
              field: ['totalcu','change','waiting','lobby','ingame','hiran','union','hcount','ucount','usncount','regdate'],
              head : ['전체CU','증감량','Waiting','Lobby','Ingame','하이란CU','우니온CU','하이란USN','우니온USN','총USN','업데이트시간'],
              translate_realtime : {
                change : function(v, cname, row){

                  //전체서버 변동량에 따른 Alert
                  if(Math.abs(row.change) > wholeDeltaSetting && wholeDeltaSetting!=-1){
                    //menu.ajaxAsync('alertMail','전서버', row.change);
                    alert('전서버 - 접속자 변화를 감지했습니다.');
                    if(row.change>=0) alertDiv.css("background-color","skyblue");
                    else alertDiv.css("background-color","pink");
                  }else{
                    alertDiv.css("background-color","white");
                  }
                  if(row.totalcu >= wholeMaxSetting  && wholeMaxSetting!=-1){
                    alert('전서버 - 최대접속자 기준에 도달했습니다');
                  }else if(row.totalcu < wholeMinSetting  && wholeMinSetting!=-1){
                    alert('전서버 - 최소접속자 기준을 넘었습니다');
                  }

                  return v;
                }
              },
              footer : false,
            });
            cuWin.clientTable(jorbiCU[1],{
              title:'개별서버 실시간 정보',
              width:'100%',
              field: ['server_id','name','state','cu','change','cu3','cu4','ingame','cu1','cu2','restrict_realm_hieron','restrict_realm_union','max_cu','open_login','hcount','ucount','regdate'],
              head : ['ID','Name','상태','전체CU','증감량','Waiting','Lobby','진영CU','하이란CU','우니온CU','생성제한-하이란','생성제한-우니온','접속자 수 제한','오픈제한','하이란USN','우니온USN','업데이트시간'],
              column_width : [],
              pagesize : 16,
              translate_realtime : {
                state : function(v, cname, row){
                  var state = '알수없음';
                  var stateValue = (row.cu/row.max_cu) * 100;
                  if(stateValue >= 100) state = '포화';
                  else if(stateValue >=50) state = '혼잡';
                  else if(stateValue >=20) state = '보통';
                  else state = '쾌적';
                  return state;
                },
                ingame : function(v, cname, row){
                  return parseInt(row.cu1) + parseInt(row.cu2);
                },
                change : function(v, cname, row){

                  //개별서버 변동량에 따른 Alert
                  if(Math.abs(row.change) > eachDeltaSetting  && eachDeltaSetting!=-1){
                    //menu.ajaxAsync('alertMail', row.server_id+'서버', row.change);
                    alert( row.server_id+'서버 - 접속자 변화를 감지했습니다.');
                  }
                  if(row.cu >= eachMaxSetting  && eachMaxSetting!=-1){
                    alert(row.server_id+'서버 - 최대접속자 기준에 도달했습니다.');
                  }else if(row.cu < eachMinSetting  && eachMinSetting!=-1){
                    alert(row.server_id+'서버 - 최소접속자 기준 밑으로 내려갔습니다.');
                  }

                  return v;
                }
              },
              translate : desc,
              footer : false,
            });
          }
        });
        cuWin.ajaxAsync('refreshCU');
      }

      function drawGraph(){
        graphWin.empty();
        var categories = [],
            series = [];

        var config = {
          chart: {
            height : 350,
          },
          title: {
            text: 'Bless Current User Graph',
            x: -20 //center
          },
          subtitle: {
            text: 'Source: Jorbi CU Table (Last 1hour) 문의: 서비스개발팀 이종현',
            x: -20
          },
          xAxis: {
            categories: categories,
            tickInterval : 100,
          },
          yAxis: {
            title: {
              text: 'Users(USN)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
              }]
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'bottom',
            borderWidth: 0
          },
          series: series
        };

        menu.ajax({
          methodcall : ['getGameCU', 'getServerInfo'],
          success : function(r, server){
            if(r===null) return;
            var pos = -1;
            var firstData = [];
            var graphIndex = [];
            var graphIndexCounter = 0;

            server.forEach(function(element, index, array){
              graphIndex[ element.chid ] =  graphIndexCounter;
              graphIndexCounter++;
            });

            if(r.length>0){
              for( var j=0; j<server.length; j++ ){
                series.push({ name:'서버'.concat(j+1), type: 'spline', yAxis: 0, data: [], marker: { enabled: false } } );
                firstData.push( false );
              }
              categories.push( r[0]['regdate'] );
            }
            pos++;

            debug(graphIndex);
            debug(series);

            for( var i=1; i<r.length; i++ ){
              if(firstData[ graphIndex[ r[i]['chid'] ] ] === false){
                series[  graphIndex[ r[i]['chid'] ] ].data.push( parseInt( r[i]['cu'] ) );
                firstData[ graphIndex[ r[i]['chid'] ] ] = true;
              }
              else{
                categories.push( r[i]['regdate'] );
                series[ graphIndex[ r[i]['chid'] ] ].data[ pos ] = parseInt( r[i]['cu'] );
                pos++;
              }
            }
            config.xAxis.categories = categories;
            config.series = series;
            graphWin.highcharts( config );
          }
        });
      }

      get(); drawGraph(); setAlert();
      var intv = setInterval( function(){ get();  } , 1000*60*1 );
      menu.on('remove', function(){ clearInterval(intv); });


    }

  });

})(jQuery, this, this.document);
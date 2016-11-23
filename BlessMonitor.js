/**
 * BlessMonitor
 * ADM 4.0 JavaScript Menu
 * @author bitofsky@neowiz.com 2015.12.03
 * @package
 * @subpackage
 * @encoding UTF-8
 */

// http://glat.info/jscheck/
/*global $, jQuery, $adm, $E, confirm, console, alert, JSON, HTMLInputElement define */

// 명료한 Javascript 문법을 사용 한다.
"use strict";

(function($, window, document){

/**
 * AMD(Asynchronous Module Definition)
 */
define(['beans/Bless/BlessGameData', 'beans/Bless/BlessDesc', 'common/javascript/d3', 'common/javascript/c3'], function( GameData, DESC, d3, c3 ){

  $adm.loadCss('common/css/c3.min.css');

  /**
   * BlessMonitor Menu
   * @param {mixed} arg1
   * @param {mixed} arg2
   */
  return function BlessMonitor( arg1, arg2 ){

    var menu = this;

    var $side = $E('div').win({
      title : 'Side menu',
      parent : menu,
      top : 0,
      left : 0,
      width : 150,
      height : 'auto',
      buttonpane : false,
      close : false,
      screen_toggle : false,
      minimum : false,
      resizable : false,
      draggable : false,
      'extends' : false
    });

    var HOUR = 60*60*1000,
        DAY  = HOUR * 24,
        WEEK = DAY * 7;

    var $monitor1 = $E('button').text('재화 획득량').button().click( fnMonitor1 ),
        $monitor2 = $E('button').text('재화 획득랭킹').button().click( fnMonitor2 ),
        $monitor3 = $E('button').text('경험치 획득랭킹').button().click( fnMonitor4 ),
        $monitor4 = $E('button').text('아이템 복사').button().click( fnMonitor5 ).width(105),
        $monitor5 = $E('button').text('재화 복사').button().click( fnMonitor3 ),
        $monitor6 = $E('button').text('거래 평균가').button().click( fnMonitor6 ),
        $detecting = $E('button').text('어뷰저 디텍팅').button().click( fnDetecting );

    var $alert = $E('button').text('얼럿 설정').button().click( fnAlert ),
        $except = $E('button').text('아이템 제외').button({text:false, icons:{primary:'ui-icon-gear'}}).click( fnExcept );

    var serverInfo, serverName = {}, itemList, itemMap;

    $side.append( $monitor1, $monitor2, $monitor3, $E('div').append( $monitor4, $except ).buttonset(), $monitor5, $monitor6,'<hr/>', $detecting, '<hr/>', $alert  );

    $side.find('BUTTON').css({
      height: 40,
      'text-align': 'center'
    }).end().children('BUTTON').css('width', 130);

    menu.ajaxAsync('getServerInfo').then(function( r ){
      serverInfo = r;
      serverInfo.forEach(function(server){ serverName[server.server_id] = server.name; });
    });

    function ItemInitialize(){

      if( itemMap ){

        var promise = $.Deferred();

        promise.resolve( itemMap );

        return promise;

      }

      menu.win('loading', true);

      return GameData.getGameDataNameMap('Item').then(function( r ){

        itemMap = {};

        itemList = itemList || $.map(r, function(name, cid){

          itemMap[cid] = cid+' - '+name;

          return {label: cid+' - '+name, value: cid};

        });

        menu.win('loading', false);

        return itemMap;

      });

    }

    /**
     * 얼럿 설정
     */
    function fnAlert(){

      var $this = $(this);

      $.when(
        $side.ajaxAsync('getLogServerList'),
        $side.ajaxAsync('getLogServerMapping')
      ).then(function( list, serverMapping ){

        var $win = $E('div').win({
            title : $this.text(),
            parent : menu,
            top : 0,
            left : 155,
            width : 1200,
            height : 'auto',
            buttonpane : false
          });

        list.forEach(function( log_server_idx ){

          var map = serverMapping[log_server_idx] || [],
              mapList = [];

          map.forEach(function( world_id ){ mapList.push( serverName[world_id] || world_id ); });

          $win.clientTable(null, {
            title: $adm.sprintf('Log DB IDX : %02d, Mapping World : (%s)', log_server_idx, mapList.join(', ')),
            connect: {
              menu: $win,
              db: $adm.sprintf('bless_logw_%02d', log_server_idx),
              table: 'bl_monitor_stand_01',
              edit: ['alarm_money_rate']
            },
            width: '100%'
          });

        });

      });

    }

    /**
     * 제외 설정
     */
    function fnExcept(){

      var $this = $(this);

      $.when(
        $side.ajaxAsync('getLogServerList'),
        $side.ajaxAsync('getLogServerMapping'),
        ItemInitialize()
      ).then(function( list, serverMapping, itemMap ){

        var $win = $E('div').win({
            title : $this.text(),
            parent : menu,
            top : 0,
            left : 155,
            width : 1200,
            height : 'auto',
            buttonpane : false
          });

        list.forEach(function( log_server_idx ){

          var map = serverMapping[log_server_idx] || [],
              mapList = [];

          map.forEach(function( world_id ){ mapList.push( serverName[world_id] || world_id ); });

          $win.clientTable(null, {
            title: $adm.sprintf('아이템 제외 설정 DB IDX : %02d, Mapping World : (%s)', log_server_idx, mapList.join(', ')),
            connect: {
              menu: $win,
              db: $adm.sprintf('bless_logw_%02d', log_server_idx),
              table: 'bl_monitor_05_01',
              edit: ['except_item_cid'],
              insert: true,
              'delete': true,
              limit: 500,
            },
            width: '100%',
            translate: {
              except_item_cid: itemMap
            },
            cell_modify_form: {
              except_item_cid: $adm.clientTable.Preset.AutoComplete( itemList )
            }
          });

        });

      });

    }

    /**
     * 어뷰져 디텍팅
     * @returns {undefined}
     */
    function fnDetecting(){

      var now = new Date() - (HOUR/2), // 30분 전을 기준시로 한다..
          date = $adm.getDate('Ymd', now),
          hour = $adm.getDate('H', now),
          min = +$adm.getDate('i', now) >= 30 ? 30 : 0;

      openMonitor( $(this).text(), makeTable, {
        server: true,
        sdate: date,
        shour: hour,
        //smin: min,
        edate: date,
        ehour: hour,
        //emin: min,
        item: false,
        typeName: '리소스',
        types: {
          36000 : 'Gold',
          36030 : 'Bp',
          36050 : 'Dp',
          36100 : 'Cp',
          36300 : 'Lumena',
          34000 : 'Tier'
        }
      });

      function makeTable( $win, ret ){

        var sdate = ret.sdate+ret.shour+'0000',
            edate = ret.edate+ret.ehour+'0000';

        if( $adm.getDate('GET DATE OBJECT', edate) - $adm.getDate('GET DATE OBJECT', sdate) > DAY )
          return alert('설정 가능 시간이 초과되었습니다.');

        var TypeDesc = {
          36000 : DESC.DBLog_log_type_TYPES[36000].data_2,
          36030 : DESC.DBLog_log_type_TYPES[36030].data_2,
          36050 : DESC.DBLog_log_type_TYPES[36050].data_2,
          36100 : DESC.DBLog_log_type_TYPES[36100].data_2,
          36300 : DESC.DBLog_log_type_TYPES[36300].data_4
        }[ret.type];

        var field = ['rank', 'usn', 'csn', 'lof', 'resource_type', 'amount', 'get_cnt', 'min_term', 'last_get_date', 'detect_cnt', 'admin_check_yn', 'logview'];

        // 데이터 조회
        $win.ajaxAsync('getAbuseDetecting', ret.type, sdate, edate).then(function( result ){

          var $wList = $E('div').win({
            title : $adm.sprintf('%s / %s ~ %s', ret.typeDesc, $adm.getDate('Y-m-d H:i', sdate), $adm.getDate('Y-m-d H:i', edate)),
            parent : $win,
            top : 0,
            left : 155,
            width : 1200,
            height : 'auto',
            buttonpane : false
          });

          var csnCount = {};

          result.forEach(function( row ){ csnCount[row.csn] = (csnCount[row.csn] || 0) + 1; });
          result.forEach(function( row ){ row.detect_cnt = csnCount[row.csn] || 1; });

          // 빈 객체 셋팅
          var oData = {};
          ret.server.forEach(function( server_id ){
            oData[server_id] = [];
          });

          result.forEach(function( row ){
            (oData[row.world_id]||[]).push( row );
          });

          // 테이블 생성
          ret.server.forEach(function( server_id ){

            $wList.clientTable( oData[ server_id ], {
              title: $adm.sprintf('%s / %s / %s ~ %s', serverName[server_id], ret.typeDesc, $adm.getDate('Y-m-d H:i', sdate), $adm.getDate('Y-m-d H:i', edate) ),
              field: field,
              head: {
                resource_type: '리소스',
                amount: $E('span').html('획득량 /<br/>(100분위수치)').css({'text-align':'center', 'display':'inline-block'}),
                get_cnt: $E('span').html('획득횟수 /<br/>(100분위수치)').css({'text-align':'center', 'display':'inline-block'}),
                min_term: $E('span').html('획득주기 /<br/>(100분위수치)').css({'text-align':'center', 'display':'inline-block'}),
                last_get_date: '최종감지시간',
                detect_cnt: '중복수',
                admin_check_yn: 'abuser',
                logview: '상세보기'
              },
              width: '100%',
              sort_field: 'rank',
              column_width: [],
              translate: {
                log_type: TypeDesc,
                admin_check_yn: function(v, cname, row){
                  return $adm.onoff({
                    checked: v == 'Y'
                  }).change(function(){
                    setAbuseDetecting(row.ref_log_start_time, row.csn, row.ref_log_type, row.log_type, !!$adm(this).onoff('checked'));
                  });
                },
                logview: function(v, cname, row){
                  return $E('button').text('상세보기').button().click(row, openLogView);
                },
                amount: function(v, cname, row){
                  return v+' / ('+(+row.amount_percentile||0)+')';
                },
                get_cnt: function(v, cname, row){
                  return v+' / ('+(+row.get_cnt_percentile||0)+')';
                },
                min_term: function(v, cname, row){
                  return v+' / ('+(+row.min_term_percentile||0)+')';
                }
              }
            });

          });

        });

        function setAbuseDetecting( ref_log_start_time, csn, ref_log_type, log_type, value ){

          $win.ajaxAsync('setAbuseDetecting', ref_log_start_time, csn, ref_log_type, log_type, value);

        }

        function openLogView( event ){

          var menusrl = $adm.getConfig('Server').BlessLogViewMenuSrl,
              row = event.data,
              arg1 = {
                world_id: row.world_id,
                character_uid: row.csn,
                action: [row.ref_log_type],
                sdate: $adm.getDate('Ymd', row.ref_log_start_time),
                stime: $adm.getDate('His', row.ref_log_start_time),
                edate: $adm.getDate('Ymd', row.ref_log_end_time),
                etime: $adm.getDate('His', row.ref_log_end_time)
              };

          $adm.menu.execute(menusrl, JSON.stringify(arg1), undefined, true);

        }

      }

    }

    /**
     * 재화 획득량 그래프
     */
    function fnMonitor1(){

      openMonitor( $(this).text(), makeGraph, {
        server: true,
        edate: '+0d',
        ehour: true,
        item: false,
        typeName: '재화',
        types: {
          36000 : 'Gold',
          36030 : 'Bp',
          36050 : 'Dp',
          36100 : 'Cp',
          36300 : 'Lumena'
        }
      });

      function makeGraph( $win, ret ){

        var TICK = 7; // 선택 시간부터 8시간 범위 시간(hour)

        var e = $adm.getDate('GET DATE OBJECT', ret.edate+ret.ehour+'0000'),
            s = e - TICK * HOUR,
            range  = [
              [s, e, '당일'],
              [s - DAY, e - DAY, '전일'],
              [s - WEEK, e - WEEK, '전주']
            ],
            timeTable = [],
            dateRange = [];

        range.forEach(function( a ){
          dateRange.push([
            $adm.getDate('YmdH', new Date(a[0])), // 검색 시작 시간
            $adm.getDate('YmdH', new Date(a[1])), // 검색 종료 시간
            a[2] // 검색 날짜 라벨
          ]);
        });

        for( var i = +s; i<=e; i+=HOUR )
          timeTable.push( $adm.getDate('H:00', new Date(i)) );

        // 데이터 조회
        $win.ajaxAsync('getLogMonitor', 1, ret.server, ret.type, dateRange).then(function( result ){

          var $wGraph = $E('div').win({
            title : $adm.sprintf('%s / %s ~ %s', ret.typeDesc, $adm.getDate('Y-m-d H시', s), $adm.getDate('Y-m-d H시', e)),
            parent : $win,
            top : 0,
            left : 155,
            width : 1200,
            height : 'auto',
            buttonpane : false
          });

          // 서버별 그래프 데이터 생성
          ret.server.forEach(function( server_id, server_idx ){

            var $title = $E('h1').text( $adm.sprintf('%s / %s', ret.typeDesc, serverName[server_id]) ).appendTo( $wGraph ).css({'text-align':'center'}),
                $graph = $E('div').appendTo( $wGraph );

            var reference = {},
                serverData = makeData( result, server_id, reference );

              console.log( reference );

            var oChart = c3.generate({
              data: {
                x: 'x',
                xFormat: '%H:%M',
                columns: serverData
              },
              axis : {
                x : {
                type : 'timeseries',
                  tick: {
                    format: '%H:%M'
                  }
                }
              },
              tooltip: {
                  format: {
                      title: function (d) { return $adm.getDate('H시 00~59분', d); },
                      value: function (value, ratio, id, idx) {
                        var row = reference[id][idx];
                        return $adm.sprintf('%s (%s/%s)', value, row.total_value, row.total_csn);
                      }
                  }
              },
              bindto: $graph[0],
              size : {
                width : 1100,
                height : 200
              }
            });

          });

        });

        function makeData( result, server_id, reference ){

          var serverData = result.filter(function(row){ return row.world_id == server_id; }),
              byTime = {},
              x = ['x'],
              graphData = [];

          reference = reference || {};

          // Time 시간대 별 데이터 초기화. DB에 데이터가 아예 없는 구간인 경우라도 그래프 값을 0으로 셋팅하기 위함..
          dateRange.forEach(function( range, idx ){

            graphData[idx] = [range[2]];

            timeTable.forEach(function( time ){

              if( idx === 0 ) x.push( time );
              byTime[time] = byTime[time] || [];
              byTime[time][idx] = {total_value: 0, total_csn: 0};

            });
          }); // 기본값 0

          serverData.forEach(function( row ){

            var time = $adm.getDate('H:00', row.log_time+'0000');

            dateRange.forEach(function( range, idx ){

              if( range[0] <= row.log_time && range[1] >= row.log_time ){
                //byTime[time][idx] = Math.round( +row.total_value / +row.total_csn );
                byTime[time][idx] = row;
                //reference[range[2]] = reference[range[2]] || {};
                //reference[range[2]][idx] = {total_value:row.total_value, total_csn:row.total_csn};
              }

            });

          });

          $.each(byTime, function( time, data ){

            dateRange.forEach(function( range, idx ){

              var row = byTime[time][idx];

              reference[range[2]] = reference[range[2]] || [];
              reference[range[2]].push( row );

              graphData[idx].push( Math.round( +row.total_value / +row.total_csn ) || 0 );

            });

          });

          graphData.push( x );

          return graphData;

        }

      }

    }

    /**
     * 재화 획득랭킹
     */
    function fnMonitor2(){

      openMonitor( $(this).text(), makeTable, {
        server: true,
        edate: '+0d',
        ehour: true,
        item: false,
        typeName: '재화',
        types: {
          36000 : 'Gold',
          36030 : 'Bp',
          36050 : 'Dp',
          36100 : 'Cp',
          36300 : 'Lumena'
        }
      });

      function makeTable( $win, ret ){

        var TypeDesc = {
          36000 : DESC.DBLog_log_type_TYPES[36000].data_2,
          36030 : DESC.DBLog_log_type_TYPES[36030].data_2,
          36050 : DESC.DBLog_log_type_TYPES[36050].data_2,
          36100 : DESC.DBLog_log_type_TYPES[36100].data_2,
          36300 : DESC.DBLog_log_type_TYPES[36300].data_4
        }[ret.type];

        var TICK = 0,  // 선택 시간
            RANK = 50; // 노출 랭킹 1위 ~ RANK위

        var e = $adm.getDate('GET DATE OBJECT', ret.edate+ret.ehour+'0000'),
            s = e - TICK * HOUR,
            range  = [
              [s, e],
              [s - HOUR, e - HOUR],               // 1시간 전
              [s - HOUR - HOUR, e - HOUR - HOUR], // 2시간 전
              [s - DAY, e - DAY]                  // 1일 전
            ],
            dateRange = [],
            field     = ['rank', 'usn', 'csn', 'total_value', 'add_type_1', 'add_value_1', 'add_type_2', 'add_value_2'];

        range.forEach(function( a, i ){
          dateRange.push([
            $adm.getDate('YmdH', new Date(a[0])), // 검색 시작 시간
            $adm.getDate('YmdH', new Date(a[1])), // 검색 종료 시간
            $adm.getDate('d일 H:00 ~ H:59', new Date(a[1]))
          ]);

          if( i > 0 )
            field.push( dateRange[i][2] );

        });

        // 데이터 조회
        $win.ajaxAsync('getLogMonitor', 2, ret.server, ret.type, dateRange).then(function( result ){

          var $wList = $E('div').win({
            title : $adm.sprintf('%s / %s', ret.typeDesc, $adm.getDate('Y-m-d H시', e)),
            parent : $win,
            top : 0,
            left : 155,
            width : 1200,
            height : 'auto',
            buttonpane : false
          });

          // 빈 객체 셋팅
          var oData = {};
          ret.server.forEach(function( server_id ){
            oData[server_id] = [];

            for(var i=0, row; i<RANK; i++){
              row = {};
              field.forEach(function( cname ){ row[cname] = null; });
              row.rank = i+1;
              oData[server_id].push( row );
            }

          });

          result.forEach(function( row ){

            dateRange.forEach(function( range, idx ){

              if( range[0] <= row.log_time && range[1] >= row.log_time && row.rank <= RANK ){

                if( idx === 0 )
                  $.extend(oData[row.world_id][+row.rank-1], row);
                else
                  oData[row.world_id][+row.rank-1][ range[2] ] = row.total_value;

              }

            });

          });

          // 테이블 생성
          ret.server.forEach(function( server_id ){

            $wList.clientTable( oData[ server_id ], {
              title: $adm.sprintf('%s / %s / %s', serverName[server_id], ret.typeDesc, $adm.getDate('Y-m-d H:00 ~ H:59', e) ),
              field: field,
              head: {
                total_value: '총획득량',
                add_type_1: '1순위',
                add_type_2: '2순위',
                add_value_1: '획득량',
                add_value_2: '획득량'
              },
              width: '100%',
              sort_field: 'rank',
              column_width: [50, 100, 120],
              translate: {
                add_type_1: TypeDesc,
                add_type_2: TypeDesc
              }
            });

          });

        });

      }

    }

    /**
     * 재화 복사
     */
    function fnMonitor3(){

      openMonitor( $(this).text(), makeTable, {
        server: true,
        edate: '+0d',
        ehour: true,
        item: false,
        typeName: '재화',
        types: {
          36000 : 'Gold',
          36030 : 'Bp',
          36050 : 'Dp',
          36100 : 'Cp',
          36300 : 'Lumena'
        }
      });

      function makeTable( $win, ret ){

        var TypeDesc = {
          36000 : DESC.DBLog_log_type_TYPES[36000].data_2,
          36030 : DESC.DBLog_log_type_TYPES[36030].data_2,
          36050 : DESC.DBLog_log_type_TYPES[36050].data_2,
          36100 : DESC.DBLog_log_type_TYPES[36100].data_2,
          36300 : DESC.DBLog_log_type_TYPES[36300].data_4
        }[ret.type];

        var TICK = 1,  // 선택 시간부터 2시간 범위 시간(hour)
            RANK = 50; // 노출 랭킹 1위 ~ RANK위

        var e = $adm.getDate('GET DATE OBJECT', ret.edate+ret.ehour+'0000'),
            s = e - TICK * HOUR,
            range  = [
              [s, e],
              [s - HOUR, e - HOUR],               // 1시간 전
              [s - HOUR - HOUR, e - HOUR - HOUR], // 2시간 전
              [s - DAY, e - DAY]                  // 1일 전
            ],
            dateRange = [],
            field     = ['rank', 'usn', 'csn', 'resource_get_cnt', 'value_per_cnt', 'add_value', 'add_type'];

        range.forEach(function( a, i ){
          dateRange.push([
            $adm.getDate('YmdH', new Date(a[0])), // 검색 시작 시간
            $adm.getDate('YmdH', new Date(a[1])), // 검색 종료 시간
            $adm.getDate('d일 H:00 ~ H:59', new Date(a[1]))
          ]);

          if( i > 0 )
            field.push( dateRange[i][2] );

        });

        // 데이터 조회
        $win.ajaxAsync('getLogMonitor', 3, ret.server, ret.type, dateRange).then(function( result ){

          var $wList = $E('div').win({
            title : $adm.sprintf('%s / %s', ret.typeDesc, $adm.getDate('Y-m-d H시', e)),
            parent : $win,
            top : 0,
            left : 155,
            width : 1200,
            height : 'auto',
            buttonpane : false
          });

          // 빈 객체 셋팅
          var oData = {};
          ret.server.forEach(function( server_id ){
            oData[server_id] = [];

            for(var i=0, row; i<RANK; i++){
              row = {};
              field.forEach(function( cname ){ row[cname] = null; });
              row.rank = i+1;
              oData[server_id].push( row );
            }

          });

          result.forEach(function( row ){

            dateRange.forEach(function( range, idx ){

              if( range[0] <= row.log_time && range[1] >= row.log_time && row.rank <= RANK ){

                if( idx === 0 )
                  $.extend(oData[row.world_id][+row.rank-1], row);
                else
                  oData[row.world_id][+row.rank-1][ range[2] ] = row.resource_get_cnt;

              }

            });

          });

          // 테이블 생성
          ret.server.forEach(function( server_id ){

            $wList.clientTable( oData[ server_id ], {
              title: $adm.sprintf('%s / %s / %s', serverName[server_id], ret.typeDesc, $adm.getDate('Y-m-d H:00 ~ H:59', e) ),
              field: field,
              head: {
                value_per_cnt: '1회 획득량',
                resource_get_cnt: '중복획득횟수',
                add_type: '획득경로',
                add_value: '획득량'
              },
              width: '100%',
              sort_field: 'rank',
              column_width: [50, 100, 120, 100, 50, 100],
              translate: {
                add_type: TypeDesc,
                value_per_cnt: function(v, cname, row){
                  return Math.round( +row.add_value / +row.resource_get_cnt ) || 0;
                }
              }
            });

          });

        });

      }

    }

    /**
     * 경험치 획득랭킹
     */
    function fnMonitor4(){

      openMonitor( $(this).text(), makeTable, {
        server: true,
        edate: '+0d',
        ehour: true,
        item: false,
        typeName: '경험치',
        types: {
          20011 : '케릭터',
          20041 : '채집',
          20051 : '제작',
          42101 : '길드'
        }
      });

      function makeTable( $win, ret ){

        var TICK = 0,  // 선택 시간
            RANK = 50; // 노출 랭킹 1위 ~ RANK위

        var TypeDesc = {
          20011 : DESC.DBLog_log_type_TYPES[20011].data_2,
          20041 : undefined,
          20051 : DESC.DBLog_log_type_TYPES[20051].data_3,
          42101 : DESC.DBLog_log_type_TYPES[42101].data_2
        }[ret.type];

        var e = $adm.getDate('GET DATE OBJECT', ret.edate+ret.ehour+'0000'),
            s = e - TICK * HOUR,
            range  = [
              [s, e],
              [s - HOUR, e - HOUR],               // 1시간 전
              [s - HOUR - HOUR, e - HOUR - HOUR], // 2시간 전
              [s - DAY, e - DAY]                  // 1일 전
            ],
            dateRange = [],
            field     = ['rank', 'usn', 'csn', 'total_value', 'add_type_1', 'add_value_1', 'add_type_2', 'add_value_2'];

        range.forEach(function( a, i ){
          dateRange.push([
            $adm.getDate('YmdH', new Date(a[0])), // 검색 시작 시간
            $adm.getDate('YmdH', new Date(a[1])), // 검색 종료 시간
            $adm.getDate('d일 H:00 ~ H:59', new Date(a[1]))
          ]);

          if( i > 0 )
            field.push( dateRange[i][2] );

        });

        // 데이터 조회
        $win.ajaxAsync('getLogMonitor', 4, ret.server, ret.type, dateRange).then(function( result ){

          var $wList = $E('div').win({
            title : $adm.sprintf('%s / %s', ret.typeDesc, $adm.getDate('Y-m-d H시', e)),
            parent : $win,
            top : 0,
            left : 155,
            width : 1200,
            height : 'auto',
            buttonpane : false
          });

          // 빈 객체 셋팅
          var oData = {};
          ret.server.forEach(function( server_id ){
            oData[server_id] = [];

            for(var i=0, row; i<RANK; i++){
              row = {};
              field.forEach(function( cname ){ row[cname] = null; });
              row.rank = i+1;
              oData[server_id].push( row );
            }

          });

          result.forEach(function( row ){

            dateRange.forEach(function( range, idx ){

              if( range[0] <= row.log_time && range[1] >= row.log_time && row.rank <= RANK ){

                if( idx === 0 )
                  $.extend(oData[row.world_id][+row.rank-1], row);
                else
                  oData[row.world_id][+row.rank-1][ range[2] ] = row.total_value;

              }

            });

          });

          // 테이블 생성
          ret.server.forEach(function( server_id ){

            $wList.clientTable( oData[ server_id ], {
              title: $adm.sprintf('%s / %s / %s', serverName[server_id], ret.typeDesc, $adm.getDate('Y-m-d H:00 ~ H:59', e) ),
              field: field,
              head: {
                total_value: '총 획득량',
                add_type_1: '1순위',
                add_value_1: '획득량',
                add_type_2: '2순위',
                add_value_2: '획득량',
                usn : ret.type == 42101 ? 'guild_uid' : 'Usn'
              },
              width: '100%',
              sort_field: 'rank',
              column_width: [50, 100, 120],
              translate: {
                add_type_1: TypeDesc,
                add_type_2: TypeDesc
              }
            });

          });

        });

      }

    }

    /**
     * 아이템 복사
     */
    function fnMonitor5(){

      openMonitor( $(this).text(), makeTable, {
        server: true,
        edate: '+0d',
        ehour: true
      });

      function makeTable( $win, ret ){

        var TICK = 1,  // 선택 시간부터 2시간 범위 시간(hour)
            RANK = 100; // 노출 랭킹 1위 ~ RANK위

        var TypeDesc = DESC.DBLog_log_type_TYPES[34000].data_3;

        var e = $adm.getDate('GET DATE OBJECT', ret.edate+ret.ehour+'0000'),
            s = e - TICK * HOUR,
            range  = [
              [s, e],
              [s - HOUR, e - HOUR],               // 1시간 전
              [s - HOUR - HOUR, e - HOUR - HOUR], // 2시간 전
              [s - DAY, e - DAY]                  // 1일 전
            ],
            dateRange = [],
            field     = ['rank', 'usn', 'csn', 'item_get_cnt', 'item_cid', 'item_name', 'add_type'];

        range.forEach(function( a, i ){
          dateRange.push([
            $adm.getDate('YmdH', new Date(a[0])), // 검색 시작 시간
            $adm.getDate('YmdH', new Date(a[1])), // 검색 종료 시간
            $adm.getDate('d일 H:00 ~ H:59', new Date(a[1]))
          ]);

          if( i > 0 )
            field.push( dateRange[i][2] );

        });

        // 데이터 조회
        ItemInitialize().then(function(){

          $win.ajaxAsync('getLogMonitor', 5, ret.server, null, dateRange).then(function( result ){

            var $wList = $E('div').win({
              title : $adm.getDate('Y-m-d H시', e),
              parent : $win,
              top : 0,
              left : 155,
              width : 1200,
              height : 'auto',
              buttonpane : false
            });

            // 빈 객체 셋팅
            var oData = {};
            ret.server.forEach(function( server_id ){
              oData[server_id] = [];

              for(var i=0, row; i<RANK; i++){
                row = {};
                field.forEach(function( cname ){ row[cname] = null; });
                row.rank = i+1;
                oData[server_id].push( row );
              }

            });

            result.forEach(function( row ){

              dateRange.forEach(function( range, idx ){

                if( range[0] <= row.log_time && range[1] >= row.log_time && row.rank <= RANK ){

                  if( idx === 0 )
                    $.extend(oData[row.world_id][+row.rank-1], row);
                  else
                    oData[row.world_id][+row.rank-1][ range[2] ] = row.item_get_cnt;

                }

              });

            });

            // 테이블 생성
            ret.server.forEach(function( server_id ){

              $wList.clientTable( oData[ server_id ], {
                title: $adm.sprintf('%s / %s', serverName[server_id], $adm.getDate('Y-m-d H:00 ~ H:59', e) ),
                field: field,
                head: {
                  item_get_cnt: '중복획득횟수',
                  item_cid: '아이템 CID',
                  item_name: '아이템명',
                  add_type: '획득경로'
                },
                width: '100%',
                sort_field: 'rank',
                column_width: [50, 100, 120, 50, 100, 100, 100],
                translate: {
                  add_type: TypeDesc,
                  item_name: function(v, cname, row){
                    return itemMap[ row.item_cid ] || row.item_cid;
                  }
                }
              });

            });

          });

        });

      }

    }

    /**
     * 1:1 거래 평균가
     */
    function fnMonitor6(){

      openMonitor( $(this).text(), makeTable, {
        sdate: '-6d',
        edate: '-1d',
        item: true,
        typeName: '거래유형',
        types: {
          32002 : '1:1 거래'
        }
      });

      function makeTable( $win, ret ){

        var s = $adm.getDate('GET DATE OBJECT', ret.sdate),
            e = $adm.getDate('GET DATE OBJECT', ret.edate),
            field = ['world_id'],
            dateFormat = 'm월 d일';

        if( s >= e ) return alert('시작일이 종료일보다 작아야 합니다.');

        for(var i=+s; i<=+e; i+=DAY)
          field.push( $adm.getDate(dateFormat, i) );

        // 데이터 조회
        $win.ajaxAsync('getLogMonitor6', 6, ret.item, ret.type, ret.sdate, ret.edate).then(function( result ){

          var $wList = $E('div').win({
            title : $adm.sprintf('%s / %s ~ %s', ret.typeDesc, $adm.getDate('Y-m-d H시', s), $adm.getDate('Y-m-d H시', e)),
            parent : $win,
            top : 0,
            left : 155,
            width : 1200,
            height : 'auto',
            buttonpane : false
          });

          // 빈 객체 셋팅
          var oData = {};

          serverInfo.forEach(function( server ){

            var row = {};

            field.forEach(function( cname ){ row[cname] = 0; });

            row.world_id = server.server_id;

            oData[server.server_id] = row;

          });

          result.forEach(function( row ){

            // 만약 서버 정보에 정의되지 않은 데이터가 있다면 무시
            if( !oData[row.world_id] ) return;

            oData[row.world_id][$adm.getDate(dateFormat, row.log_time)] = Math.round( row.trade_value / row.trade_cnt );

          });

          var data = $.map(oData, function(row){ return row; });

          $wList.clientTable( data, {
            title: $adm.sprintf('%s ~ %s / %s / %d / %s', $adm.getDate('Y-m-d', s), $adm.getDate('Y-m-d', e), ret.typeDesc, ret.item, ret.item_name ),
            field: field,
            head: {
              world_id: '서버'
            },
            width: '100%',
            sort_field: 'world_id',
            column_width: [50],
            translate: {
              world_id: serverName
            }
          });

        });

      }

    }

    function openMonitor( title, callbackSearch, opt ){

      var $this = $(this),
          $win = $E('div').win({
            title : title,
            parent : menu,
            top : 0,
            left : 155,
            width : 1400,
            height : 700
          }),
          $wServer, $wType, $wItem, $wDate;

      var top = 0;

      // 서버 선택
      if( opt.server ){

        $wServer = $E('div').win({
          title : '서버',
          parent : $win,
          top : top,
          left : 0,
          width : 150,
          height : 150,
          buttonpane : false,
          close : false,
          screen_toggle : false,
          minimum : false,
          resizable : false,
          draggable : false,
          'extends' : false
        });

        $E('label').append(
          $E('check').change(function(){ $wServer.find('INPUT[type=checkbox]').prop('checked', this.checked); }),
          $E('span').text( '전체선택' )
        ).css({display:'block'}).appendTo( $wServer );

        $.each(serverInfo, function( idx, server ){

          $E('label').append(
            $E('check', {name:'server', value:server.server_id}),
            $E('span').text( server.name )
          ).css({
            display: 'inline-block',
            'min-width': '50%'
          }).appendTo( $wServer );

        });

        $wServer.find('INPUT:first').prop('checked', true).change();

        top += 155;

      }

      // 유형 선택
      if( opt.types ){
        $wType = $E('form').win({
          title : opt.typeName,
          parent : $win,
          top : top,
          left : 0,
          width : 150,
          height : 150,
          buttonpane : false,
          close : false,
          screen_toggle : false,
          minimum : false,
          resizable : false,
          draggable : false,
          'extends' : false
        });

        $.each(opt.types, function( type, text ){

          $E('label').append(
            $E('radio', {name:'types', value:type}),
            $E('span').text( text )
          ).css({
            display: 'inline-block',
            width: '50%'
          }).appendTo( $wType );

        });

        $wType.find('INPUT:first').prop('checked', true);

        top += 155;

      }

      // 아이템 선택
      if( opt.item ){
        $wItem = $E('form').win({
          title : '아이템',
          parent : $win,
          top : top,
          left : 0,
          width : 150,
          height : 150,
          buttonpane : false,
          close : false,
          screen_toggle : false,
          minimum : false,
          resizable : false,
          draggable : false,
          'extends' : false
        });

        $wItem.layout(
          'table',
          [
            'CID/아이템명'
          ],
          [
            $E('text', {name:'item'}).validate({required:true, onlynumber:true, innerMsg:true})
          ]
        );

        ItemInitialize().then(function(){

          $wItem.find('INPUT[name=item]').autocomplete({
            minLength: 0,
            delay: 1000,
            source: itemList
          });

        });

        top += 155;

      }

      var $search = $E('button').text('조회').css({width:'95%', height: 40}).click(function(){

        if( $wDate && !$wDate.validate() ) return;
        if( $wItem && !$wItem.validate() ) return;

        var ret = {};

        if( opt.types ){
          ret.type     = $wType.find('INPUT[name=types]:checked').val();
          ret.typeDesc = opt.types[ret.type];
          if( !ret.type )
            return alert(opt.typeName + '를 선택해 주세요.');
        }

        if( opt.item ){
          ret.item = $wItem.find('INPUT[name=item]').val();
          ret.item_name = itemMap[ret.item];
        }

        if( opt.server ){
          ret.server = $wServer.find('INPUT[name=server]:checked').map(function(){ return this.value; }).toArray();
          if( !ret.server.length )
            return alert('서버를 선택해 주세요.');
        }

        if( opt.sdate )
          ret.sdate = $sdate.val();

        if( opt.shour )
          ret.shour = +$shour.val() ? +$shour.val() : '00';

        if( opt.edate )
          ret.edate = $edate.val();

        if( opt.ehour )
          ret.ehour = +$ehour.val() ? +$ehour.val() : '00';

        if( opt.smin || $.isNumeric( opt.smin ) )
          ret.smin = $smin.val();

        if( opt.emin || $.isNumeric( opt.emin ) )
          ret.emin = $emin.val();

        'shour ehour smin emin'.split(' ').forEach(function(v){
          if( ret[v] !== undefined && ret[v].toString().length == 1 )
            ret[v] = '0'+ret[v];
        });

        callbackSearch( $win, ret );

      });

      // 기간 선택
      if( opt.sdate || opt.shour || opt.edate || opt.ehour ){

        $wDate = $E('div').win({
          title : '기간',
          parent : $win,
          top : top,
          left : 0,
          width : 150,
          buttonpane : false,
          close : false,
          screen_toggle : false,
          minimum : false,
          resizable : false,
          draggable : false,
          'extends' : false
        }).css({'text-align':'center'});

        var $sdate = $E('text', {name:'sdate'}).validate({required:true, date: opt.sdate}),
            $edate = $E('text', {name:'edate'}).validate({required:true, date: opt.edate}),
            $shour = $E('select', {name:'shour'}).selectOptions({0:'0시',1:'1시',2:'2시',3:'3시',4:'4시',5:'5시',6:'6시',7:'7시',8:'8시',9:'9시',10:'10시',11:'11시',12:'12시',13:'13시',14:'14시',15:'15시',16:'16시',17:'17시',18:'18시',19:'19시',20:'20시',21:'21시',22:'22시',23:'23시'}, {sort:false}).val( $adm.getDate('H', +(new Date())-HOUR) ),
            $ehour = $E('select', {name:'ehour'}).selectOptions({0:'0시',1:'1시',2:'2시',3:'3시',4:'4시',5:'5시',6:'6시',7:'7시',8:'8시',9:'9시',10:'10시',11:'11시',12:'12시',13:'13시',14:'14시',15:'15시',16:'16시',17:'17시',18:'18시',19:'19시',20:'20시',21:'21시',22:'22시',23:'23시'}, {sort:false}).val( $adm.getDate('H', +(new Date())-HOUR) ),
            $smin  = $E('select', {name:'shour'}).selectOptions({0:'0분'/*,10:'10분',20:'20분'*/,30:'30분'/*,40:'40분',50:'50분'*/}, {sort:false}).val( $.isNumeric( opt.smin ) ? opt.smin : $adm.getDate('i', +(new Date())-(HOUR/2)) ),
            $emin  = $E('select', {name:'shour'}).selectOptions({0:'0분'/*,10:'10분',20:'20분'*/,30:'30분'/*,40:'40분',50:'50분'*/}, {sort:false}).val( $.isNumeric( opt.emin ) ? opt.emin : $adm.getDate('i', +(new Date())-(HOUR/2)) ),
            head   = [],
            obj    = [];

        if( opt.sdate ){
          head.push( opt.edate ? '시작' : '날짜' );
          obj.push( $sdate );
        }

        if( opt.shour ){

          head.push('시간');

          if( opt.shour !== true ) $shour.val( opt.shour );

          if( opt.smin || $.isNumeric( opt.smin ) )
            obj.push( $shour.add($smin) );
          else
            obj.push( $shour );

        }

        if( opt.edate ){
          head.push( opt.sdate ? '종료' : '날짜' );
          obj.push( $edate );
        }

        if( opt.ehour ){

          head.push('시간');

          if( opt.ehour !== true ) $ehour.val( opt.ehour );

          if( opt.emin || $.isNumeric( opt.emin ) )
            obj.push( $ehour.add($emin) );
          else
            obj.push( $ehour );

        }

        $wDate.layout('table-vertical', head, obj).append( $search ).append( $search );

      }
      else
        $wType.append( $search );

    }

  };

});

})(jQuery, this, this.document);
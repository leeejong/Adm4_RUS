/**
 * BlessCDNInfo
 * ADM 4.0 JavaScript Menu
 * @author jj2lover@neowiz.com 2016.01.15
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
 define(['beans/Qt/QtDesc', 'adm/adm.graph'], function(DESC, Graph){
  /**
   * BlessCDNInfo Menu
   * @param {mixed} arg1
   * @param {mixed} arg2
   */
  return function BlessCDNInfo( arg1, arg2 ){

    var menu = this;

    // 여기서부터 메뉴를 구성 하세요

    var sub_options = $E('div').win({
      title         : '메뉴 선택',
      parent        : menu,
      top           : 0,
      left          : 0,
      width         : 230,
      height        : 300,
      buttonpane    : false,
      close         : false,
      screen_toggle : false,
      minimum       : false,
      status        : false,
      resizable     : false,
      draggable     : false,
      'extends'     : false
    });


  var   b_menu_1  = $E('button').text('1. CDN 다운로드 통계정보 그래프 ').css({'width':210, 'text-align':'left'}).button().click(function(){  fn_showCDNInfo() }),
        b_menu_2  = $E('button').text('2. CDN 다운로드 완료 건수').css({'width':210, 'text-align':'left'}).button().click(function(){ fn_showDownCnt() }),
        b_menu_3  = $E('button').text('3. CDN 다운로드 평균 속도').css({'width':210, 'text-align':'left'}).button().click(function(){ fn_showDownSpped() });

    sub_options.append(b_menu_1, b_menu_2, b_menu_3);
    var sub_contents = _drawWin( 'CDN 다운로드 정보',menu, 0, 240, 1380, 750);
    fn_showCDNInfo()

      function fn_showDownCnt() {
        sub_contents.win('remove_child');

        var list = [];
          menu.ajax({
            async      : false,
            methodcall : ['getCDNDownCnt'],
            success    : function( result ){
              list = result;
            }
          });

          sub_contents.empty().clientTable(list, {
            width: '100%',
            pagesize: 10,
            field: [ 'reg_date', 'cdn_id', 'cnt'],
            cell_align : 'right',
            head: {
                'reg_date': '날짜',
                'cdn_id' :'CDN_ID 정보(verion.ini 참조) ',
                'cnt' : '다운로드 완료 건수',
              },
            translate: {
                cnt: function(v, cname, row){
                  return $E('lable').text(  row.cnt + ' 건' ).css({'color':'red'});
                }
              },
            'footer': true,
              filter_view       : true,
              sort_field        : 'reg_date',                         // 기본 정렬 컬럼 명
              sort_asc          : false,                              // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
            }
          );
      }

      function fn_showDownSpped() {
        sub_contents.win('remove_child');

        var list = [];
          menu.ajax({
            async      : false,
            methodcall : ['getCDNDDownSpeed'],
            success    : function( result ){
              list = result;
            }
          });

          sub_contents.empty().clientTable(list, {
            width: '100%',
            pagesize: 10,
            field: [ 'reg_date', 'cdn_id', 'speed'],
            cell_align : 'right',
            head: {
                'reg_date': '날짜',
                'cdn_id' :'CDN_ID 정보(verion.ini 참조) ',
                'speed' : '평균속도(MB/s)',
              },
            translate: {
                speed: function(v, cname, row){
                  return $E('lable').text(  ((row.speed/(1024*1024))/row.cnt).toFixed(2) + ' MB/s' ).css({'color':'red'});
                }
              },
            'footer': true,
              filter_view       : true,
              sort_field        : 'reg_date',                         // 기본 정렬 컬럼 명
              sort_asc          : false,                              // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
            }
          );
      }

    function fn_showCDNInfo() {

        sub_contents.win('remove_child');
        sub_contents.empty();

        var gamename = 'asker';
        var img_graph = $E('div');

        var hours = {}, cdn_list  = [], result_cnt = [], result_speed = [];

        for(var i=0;i<24;i++){
          if(i<10)hours['0'+i]=('0'+i);
          else hours[i+'']=(i+'');
        }
        var Desc      = {};
        //var cdn_list = {'asker':'애스커', 'blacksquad':'블랙스쿼드', 'bless': '블레스'};
        menu.ajax({
          methodcall : ['getCDNInfo'],
          async : false,
          success    : function(r){
            r.cdn_list.forEach(function( row ){
                Desc[row.cdn_id+'_cnt']    = '+ CDN_ID : ' + row.cdn_id + ' 다운로드 완료 횟수';
                Desc[row.cdn_id+'_speed']  = '+ CDN_ID : ' + row.cdn_id +'  다운로드 평균 속도(MB/s)';
            });
            result_cnt    = r.cdn_cnt;
            result_speed  = r.cdn_speed;;
          }
        });

          var d = new Date();
          d.setMinutes(d.getMinutes() - (60*24*7));
          var start = $adm.getDate('YmdHis', d);
          var r = [], obj;

          Graph({
            parent: sub_contents,
            menu: menu,
            getData: function( $w_graph, startdate, enddate ){

                var promise = $.Deferred();
                var chartData = [];
                var i         = 1;

                result_cnt.forEach(function( row ){
                  i++;
                  var data = {
                    reg_date : row.reg_date+' 00:00',
                    key      : row.cdn_id + '_cnt',
                    value    : row.cnt
                  };

                  chartData.push( data );

                });

                result_speed.forEach(function( row ){
                  i++;
                  var data = {
                    reg_date : row.reg_date+' 00:00',
                    key      : row.cdn_id + '_speed',
                    value    : ((row.speed/row.cnt)/(1024*1024)).toFixed(2)
                  };

                  chartData.push( data );

                });
                promise.resolve({
                  rawData: r,
                  chartData: chartData
                });

                return promise;
            },
            keyDescription: Desc,
            nogroupKeys: [],
            //groupKeys: groupKeys,
            title: 'CDN 다운로드 통계 정보',
            //liveUpdate: liveUpdate ? 1000*60*5 : false,
            //reference: reference,
            tickOptions: {day:'1일'},
            tickDefault: 'day',
            graphDefault: 'bar',
            //setTickX: setTickX,
            //setTickFilter: setTickFilter2,
            top: 0,
            left: 0,
            width: 1310,
            height: 650,
            //graphWidth: 700,
            //graphHeight: 430,
            //variablesave: 'AskerGraph.'+title,
            startdate: start,
            enddate: $adm.getDate('YmdHis')
          });
          //avg_speed_table.clientTable('newData',r);
      }

      function _drawWin(title, parent, top, left, width, height)
      {
        return $E('div').win({
              title         : title,
              parent        : parent,
              top           : top,
              left          : left,
              width         : width,
              height        : height,
              buttonpane    : false,
              close         : false,
              screen_toggle : false,
              minimum       : false,
              status        : false,
              resizable     : false,
              draggable     : false,
              'extends'     : false
            })
      }


  };

});

})(jQuery, this, this.document);
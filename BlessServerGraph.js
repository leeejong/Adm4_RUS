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
  define(['beans/Pm/PmCRM.CFG.js', 'beans/Jorbi/highcharts.js', 'https://www.gstatic.com/charts/loader.js'], function (CFG, HC, chart) {

    /**
     * BlessServer Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessServer(arg1, arg2) {

      var menu = this;
      var ta_server;

      var searchBox = $E('div').win({
        title: 'Search'.t('BLESS'),
        parent: menu,
        top: 0,
        left: 0,
        width: 200,
        height: 600,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      function getResultWindow(menu, title, top, left, height, width) {
        return $E('div').win({
          title: 'Result :: ' + title,
          parent: menu,
          top: top || 0,
          left: left || 0,
          width: width || 'auto',
          height: height || 'auto',
          buttonpane: true,
          screen_toggle: true,
          minimum: true,
          status: true,
          resizable: true,
          draggable: true,
          'extends': true
        }).attr('id', title);
      }

      var displayWindow = getResultWindow(menu, 'displayWindow', 0, 205, 600, 1100);

      function setSearchWindow() {
        searchBox.buttonTab([
          {
            name: 'Range',
            contents: function () {
              var usertype = $E('select', {name: 'type'}).validate({required: true}).selectOptions({id: 'ID', usn: 'USN'}, {sort: false}).variablesave('blessPaiduser.type2'),
                      keyword = $E('text', {name: 'keyword'}).css({width: 70}).enterKey(function () {
                if (keyword.validate()) {
                  var start = start_day.val().substring(0, 4) + '-' + start_day.val().substring(4, 6) + '-' + start_day.val().substring(6, 8) + ' ' + start_time.val().substring(0, 2) + ':' + start_time.val().substring(2, 4) + ':' + start_time.val().substring(4, 6);
                  var end = end_day.val().substring(0, 4) + '-' + end_day.val().substring(4, 6) + '-' + end_day.val().substring(6, 8) + ' ' + end_time.val().substring(0, 2) + ':' + end_time.val().substring(2, 4) + ':' + end_time.val().substring(4, 6);
                  searchHistory(usertype.val(), keyword.val(), start, end);
                }
              }).validate(usertype, {
                id: {required: true}, usn: {required: true, onlynumber: true}
              }).variablesave('BlessPaid.keyword3');

              var start_day = $E('text').validate({required: true, date: 'Y-m-d'}).css({'text-align': 'right', width: 70}).variablesave('blessPaiduser.startdate'),
                    start_time = $E('text').text('000000').validate({required: true, time: 'H:i:s'}).css({'text-align': 'right', width: 70}).val('000000').variablesave('blessPaiduser.starttime'),
                    end_day = $E('text').validate({required: true, date: 'Y-m-d'}).css({'text-align': 'right', width: 70}).variablesave('blessPaiduser.enddate'),
                    end_time = $E('text').text('000000').validate({required: true, time: 'H:i:s'}).css({'text-align': 'right', width: 70}).val('235959').variablesave('blessPaiduser.endtime'),
                    searchButton = $E('button').button().text('Search').css({'margin-left': '10px', 'width': '80%', 'height': '45px'}).click(function () {
                if (start_day.val() > end_day.val()) {
                  alert('error.');
                  return;
                } else if (start_day.val() === end_day.val() && start_time.val() > end_time.val()) {
                  alert('Error');
                  return;
                }
                var start = start_day.val().substring(0, 4) + '-' + start_day.val().substring(4, 6) + '-' + start_day.val().substring(6, 8) + ' ' + start_time.val().substring(0, 2) + ':' + start_time.val().substring(2, 4) + ':' + start_time.val().substring(4, 6);
                var end = end_day.val().substring(0, 4) + '-' + end_day.val().substring(4, 6) + '-' + end_day.val().substring(6, 8) + ' ' + end_time.val().substring(0, 2) + ':' + end_time.val().substring(2, 4) + ':' + end_time.val().substring(4, 6);
                //if (keyword.validate()){}

                google.charts.setOnLoadCallback(function(){drawChart(ta_server.val(), start, end);});
              });
              ta_server.val(-1);
              return $E('div').verticalTable([{
                  'Server': ta_server,
                  'Start': start_day,
                  ' ': start_time,
                  'End': end_day,
                  '  ': end_time
                }], {width: '100%'}).append('<br/>', searchButton);
            }
          }
        ]);
      }


      function drawChart(server, start, end) {
        var dataArr = [
          ['regdate', 'cu']
        ];
        var options = {};

        menu.ajax({
          methodcall: ['getGameCUforGraphRange'],
          data: [server, start, end],
          success: function (r) {
            if(!r) return;
            r.forEach(function(row){
              var tempDate = new Date(row.regdate);
              dataArr.push([tempDate, parseInt(row.cu)]);
            });
             var options = {
              chart: {
                title: 'Bless CU Graph for selected range',
                subtitle: 'if you had problem contact leeejong@neowiz.com'
              },
              width: 1080,
              height: 450
              //curveType: 'function'
            };
            var data = google.visualization.arrayToDataTable(dataArr);
            var chart = new google.visualization.LineChart(document.getElementById('displayWindow'));
            chart.draw(data, options);
          }
       });
      }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // 시작 Trigger - after get Serverlist
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      menu.ajaxAsync('getServerInfo').then(function (serverList) {
        serverList.push({'name':'전서버','server_id':'-1'});
        ta_server = $E('select', {name: 'server_id'}).selectOptions(serverList, {text: 'name', value: 'server_id', sort: false}).css({'width': '60px'});

        google.charts.load('current', {packages: ['corechart']});
        setSearchWindow();
      });

    };

  });

})(jQuery, this, this.document);
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
  define(['beans/Pm/PmCRM.CFG.js', 'beans/Jorbi/highcharts.js'], function (CFG, HC) {

    /**
     * BlessServer Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessServer(arg1, arg2) {

      var menu = this;
      var windowArr = [];

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
        });
      }

      function drawGraph(server) {

        windowArr[server].empty();

        var categories = [],
              series = [];

        var config = {
          chart: {height: 350},
          title: {text: 'Bless Current User Graph', x: -20},
          subtitle: {text: 'Source: Jorbi CU Table (Last 12hour) 문의: 서비스개발팀 이종현', x: -20},
          xAxis: {categories: categories, tickInterval: 100, },
          yAxis: {
            title: {text: 'Users(USN)'},
            plotLines: [{value: 0, width: 1, color: '#808080'}]
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
          methodcall: ['getGameCUforGraph'],
          data: [server],
          success: function (r) {
            debug(r);

            if (r === null)
              return;
            var pos = -1;
            var firstData = [];
            var graphIndex = [];
            var graphIndexCounter = 0;
            var serverArr = [server];

            serverArr.forEach(function (element, index, array) {
              graphIndex[ element.chid ] = graphIndexCounter;
              graphIndexCounter++;
            });

            if (r.length > 0) {
              for (var j = 0; j < serverArr.length; j++) {
                series.push({name: '서버'.concat(server), type: 'spline', yAxis: 0, data: [], marker: {enabled: false}});
                firstData.push(false);
              }
              categories.push(r[0]['regdate']);
            }
            pos++;

            for (var i = 1; i < r.length; i++) {
              if (firstData[ 0 ] === false) {
                series[  0 ].data.push(parseInt(r[i]['cu']));
                firstData[ 0 ] = true;
              } else {
                categories.push(r[i]['regdate']);
                series[ 0 ].data[ pos ] = parseInt(r[i]['cu']);
                pos++;
              }
            }
            config.xAxis.categories = categories;
            config.series = series;

            windowArr[server].highcharts(config);

          }
        });
      }

      menu.ajaxAsync('getServerInfo').then(function(server){

        var top       = [0,    0,0,500,500,1000],
              left       = [0,    0,650,0,650,0],
              width    = [0,    645,645,645,645,645],
              height  = [0,    495,495,495,495,495];

        server.forEach(function(element, index, array){
          windowArr[ element.server_id ] = getResultWindow( menu, 'Graph'+element.server_id,
                  top[element.server_id],left[element.server_id],height[element.server_id],width[element.server_id] );
          drawGraph(element.server_id);
        });

        var intv = setInterval(function () {
            server.forEach(function(element, index, array){
              drawGraph(element.server_id);
            });
          }, 1000 * 60 * 1);

        menu.on('remove', function () { clearInterval(intv); });
      });

    };

  });

})(jQuery, this, this.document);
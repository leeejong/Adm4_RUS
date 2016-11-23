/**
 * BlessCommander
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2016.5.11
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
  define(['beans/Bless/BlessDesc', 'beans/Bless/BlessGameData'], function (Desc, GameData) {

    /**
     * BlessMerge Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessCommander(arg1, arg2) {

      var menu = this;
      var gmlevel = 5;
      var ta_server;

      menu.ajaxAsync('getAdmGMLevel').then(function (r) {
        gmlevel = r;
      });

      var searchBox = $E('div').win({
        title: 'Search'.t('BLESS'),
        parent: menu,
        top: 0,
        left: 0,
        width: 200,
        height: 710,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      function getResultWindow(menu, title, width, height, top, left) {
        return $E('div').win({
          title: 'Result :: ' + title,
          parent: menu,
          top: top || 0,
          left: left || 210,
          width: width || '1250',
          height: height || '600',
          buttonpane: true,
          screen_toggle: true,
          minimum: true,
          status: true,
          resizable: true,
          draggable: true,
          'extends': true
        });
      }

      menu.ajaxAsync('getServerInfo').then(function (serverList) {
        ta_server = $E('select', {name: 'server_id'}).selectOptions(serverList, {text: 'name', value: 'server_id', sort: false}).css({'width':'60px'});
        setSearchWindow();
      });

      function setSearchWindow() {
        searchBox.buttonTab([
          {
            name: 'User',
            contents: function () {
              var usertype = $E('select', {name: 'type'}).validate({required: true}).selectOptions({id: 'ID', usn: 'USN'}, {sort: false}).variablesave('BlessCommander.type'),
                    realm = $E('select', {name: 'type'}).validate({required: true}).selectOptions({0: 'HIERON', 1: 'UNION'}, {sort: false}).variablesave('BlessCommander.realm'),
                    week = $E('select', {name: 'type'}).validate({required: true}).selectOptions(Desc.CommanderWeek, {sort: false}).variablesave('BlessCommander.week'),
                    searchButton = $E('button').button().text('Detail').css({'margin-left': '10px', 'width': '80%', 'height': '45px'}).click(function () {
                    search(ta_server.val(), realm.val(), week.val());
              });
              return $E('div').verticalTable([{
                  'Server':ta_server,
                  'Realm': realm,
                  'Week': week
                }], {width: '100%'}).append('<br/>', searchButton);
            }
          }
        ]);
      }



      function search(server, realm, week) {
        // week -1 지난주, 0 이번주, 1 미정산

        menu.ajaxAsync('searchCommander', server, realm, week).then(function (r) {
          var userWin = getResultWindow(menu, 'CommanderInfo', 1200, 700);
          userWin.clientTable(r, {
            field  : ['rnk','rankname','usn','player_db_id','player_name','realm_type','rxp','lastsettletime'],
            head : Desc.DBCommander,
            width : '100%',
            translate_realtime : {
              rankname : function(v, cname, row){
                var rankClass = 'No Rank';
                if(row.rnk === 1){
                  if(row.realm_type===1) rankClass = '총사령관'; else rankClass='대장군';
                }
                else if(row.rnk >=2 && row.rnk<14){
                  if(row.realm_type===1) rankClass = '사령관'; else rankClass='장군';
                }
                else if(row.rnk >=14 && row.rnk<=49){
                  if(row.realm_type===1) rankClass = '군단장'; else rankClass='기사단장';
                }
                return rankClass;
              }
            },
            translate : {
              realm_type : {0:'HIERON', 1:'UNION'}
            },
            pagesize : 20,
            sort_field : 'rnk',
            sort_asc : true
          });
        });
      }

    };

  });

})(jQuery, this, this.document);
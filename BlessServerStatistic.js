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
define(['beans/Bless/BlessDesc'], function (Desc) {

    /**
     * BlessServer Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessServerStatistic(arg1, arg2) {

      var menu = this;
      //var adminGmlevel = GameData.getAdminGMLevel(menu);
      var desc = Desc.ServerHistoryType;

      //시작시간 과 이전몇건 으로 검색.
      var number   = $E('text', {size:30}).validate({onlynumber:true, required: true, maxLength: 3}),
          day      = $E('text').validate({required: true, date:'Y-m-d'}).css({'text-align':'right',width:100}),
          time     = $E('text').text('000000').validate({required: true, time:'H:i:s'}).css({'text-align':'right',width:100}).val('000000'),
          search   = $E('button').text('Confirm').button().click(function(){

            if(!number.validate() || !day.validate() || !time.validate()) return;
            var datetime = day.val().substring(0,4)+'-'+day.val().substring(4,6)+'-'+day.val().substring(6,8)+' '+time.val().substring(0,2)+':'+time.val().substring(2,4)+':'+time.val().substring(4,6);

            menu.ajax({
              methodcall: ['getCU_stat'],
              data : [datetime,number.val()],
              success: function (jorbiCU) {
                var resultWin = $E('div').win({
                  title: 'CU',
                  parent: menu,
                  top: 30,
                  left: 0,
                  width: 800,
                  height: 500,
                  buttonpane: false,
                  close: true,
                  status: false,
                  'extends': false
                });
                debug(jorbiCU);

                resultWin.clientTable(jorbiCU,{
                  field: ['regdate','chid','cu','cu3','cu4','cu1','cu2'],
                  head:  ['Regdate','CHID','Total CU','Waiting','Lobby','Heiran','Union'],
                  sort_field : 'regdate',
                  sort_desc : 'desc',
                  width: '95%'
                })

              }
            });
          });

      menu.append($E('span').text('setDate')).append(day).append(time).append($E('span').text('howMany')).append(number).append(search);




    };

  });

})(jQuery, this, this.document);
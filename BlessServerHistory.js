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
    return function BlessServerHistory(arg1, arg2) {

      var menu = this;
      var desc = Desc.ServerHistoryType;

      menu.ajax({
        methodcall: ['getHistory'],
        success: function (history) {

          menu.clientTable(history,{
            field : ['log_seq','server_id','target','beforevalue','aftervalue','reason','editor','reg_date'],
            head  : Desc.ServerHistoryHead,
            width : '90%'
          });


        }
      });



    };

  });

})(jQuery, this, this.document);
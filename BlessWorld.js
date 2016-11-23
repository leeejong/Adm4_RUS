/**
 * BlessWorldS
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2015.12.28
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
     * BlessWorld Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessWorld(arg1, arg2) {

      var menu = this;

      menu.clientTable(null,{
        connect: {
          menu: menu,
          db: 'bless_middle',
          table: 'dbo.bl_bt_world',
          edit:['*'],
          delete:true,
          insert:true
        },
        field : ['world_id', 'world_name','open_yn'],
        head  : ['World_ID','World_Name','Open_YN'],
        pagesize : 9,
        width: '70%'
      });

    };

  });

})(jQuery, this, this.document);
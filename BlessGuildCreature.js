/**
 * BlessGuildCreature
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2016.1.7
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
     * BlessGuild Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessGuildCreature(arg1, arg2) {

      var menu = this;

      var w_search = $E('div').win({
        title: 'Search'.t('BLESS'),
        parent: menu,
        top: 0,
        left: 0,
        width: 1400,
        height: 120,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      var $ta_server;
      var $type = $E('select', {name: 'type'}).validate({required: true}).selectOptions({
        guildid: 'Guild ID',
        guildname: 'Guild Name',
        character: 'CSN / Name',
      }, {sort: false}).variablesave('BlessGuild.type'),
        $keyword = $E('text', {name: 'keyword'}).css({width: 100}).enterKey(function(){if($keyword.validate()){fnSearch();}}).validate($type, {
          guildid: {required: true},
          guildname: {required: true},
          character: {required: true},
      }).variablesave('BlessGuild.keyword'),
              $search = $E('button').text('Search').button().click(function(){if($keyword.validate()){fnSearch();}});

      var searchHeaderArr = new Array(),
          searchServerArr = new Array();

      menu.ajaxAsync('getServerInfo').then(function (serverList) {
        $ta_server = $E('select', {name: 'server_id'}).selectOptions(serverList, {text: 'name', value: 'server_id', sort: false});

        var searchAll = $E('check').attr("checked", false).click(function(){
          var $this = $(this);
          if($this.is(':checked')){
            searchServerArr.forEach(function(server){
              server[0].checked = true;
            });
          }
          else{
            searchServerArr.forEach(function(server){
              server[0].checked = false;
            });
          }
        });
        searchHeaderArr.push('Total');
        searchServerArr.push( searchAll );

        serverList.forEach(function(item){
          var chid = item.chid;
          searchHeaderArr.push(item.name);
          searchServerArr.push( $E('check').attr("checked", false).attr('name',item.chid) );
        });

        searchHeaderArr.push('Search');
        searchServerArr.push( $search );

        w_search.layout( 'table', searchHeaderArr, searchServerArr );

      });

      function fnSearchAction( server ){
        return w_search.ajax({
          methodcall: 'getGuildCreature',
          data: [ server ],
          processError: function(){ return false; } // 에러메세지 무시
        }).then(function( guildCreature ){
          return guildCreature;
        });
      }

      function fnSearch() {

        var promises = [];

        searchServerArr.forEach(function(server){
          if(server[0].checked === true && parseInt(server[0].name) > 0){
            promises.push( fnSearchAction( parseInt( server[0].name ) ) );
          }
        });

        $.when.apply(null, promises).then(function(){

          var resultWin = $E('div').win({
            title: 'Result :: '.t('BLESS'),
            parent: menu,
            top: 120,
            left: 0,
            width: 1400,
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
          var concatResult = Array.prototype.concat.apply([], arguments);
          var called = [], deleted = [];

          concatResult.forEach(function( item ){
            if( item.unreg_flag > 0 ){
              deleted.push( item );
            }
            else{
              called.push( item );
            }
          });

          resultWin.buttonTab([
            {
              name: 'Guild Creature',
              contents: $adm.clientTable(called, {
                field : ['server','db_id','rp_product_cid','type','type_cid','location_x','location_y','location_z','field_cid','volume_channel_cid','unreg_date','remain_time','remove'],
                head  : Desc.DBGuildCreature,
                width:'98%',
                translate_realtime : {
                  remove : function(v, cname, row){
                    return $E('button').button({icons:{primary:'ui-icon-minus'}}).css({'width':35,'height':26}).click(function(){
                      if(confirm('Are you sure?')){
                        resultWin.ajaxAsync('removeGuildCreature', row.server, row.db_id).then(function(r){alert('Complete.');});
                      }
                    });
                  }
                }
              })
            },
            {
              name: 'Deleted Guild Creature',
              contents: $adm.clientTable(deleted, {
                field : ['server','db_id','rp_product_cid','type','type_cid','location_x','location_y','location_z','field_cid','volume_channel_cid','unreg_date','remain_time'],
                head  : Desc.DBGuildCreatue,
                width:'98%'
              })
            }
          ]);
        }), function(err){
          alert(err);
        };

      }


    };
  });

})(jQuery, this, this.document);
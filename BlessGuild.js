/**
 * BlessGuild
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2015.12.01
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
  define([/*Require*/], function () {

    /**
     * BlessGuild Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessGuild(arg1, arg2) {

      var menu = this;
      var searchState = false;
      var guildid = '';

      function getResultWindow(menu, title, width, height, top, left) {
        return $E('div').win({
          title: 'Result :: ' + title,
          parent: menu,
          top: top || 130,
          left: left || 410,
          width: width || 'auto',
          height: height || 'auto',
          buttonpane: false,
          screen_toggle: true,
          minimum: true,
          status: true,
          resizable: true,
          draggable: true,
          'extends': false
        });
      }

      var w_search = $E('div').win({
        title: 'Search'.t('BLESS'),
        parent: menu,
        top: 0,
        left: 0,
        width: 400,
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

      var w_menu = $E('div').win({
        title: 'Menu'.t('BLESS'),
        parent: menu,
        top: 130,
        left: 0,
        width: 400,
        height: 500,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      var w_guildinfo = $E('div').win({
        title: 'GuildInfo'.t('BLESS'),
        parent: menu,
        top: 0,
        left: 410,
        width: 1300,
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

      menu.ajaxAsync('getServerInfo').then(function (serverList) {
        $ta_server = $E('select', {name: 'server_id'}).selectOptions(serverList, {text: 'name', value: 'server_id', sort: false}).css({'width':'60px'});

        w_search.layout(
          'table',
          ['Type', 'Server', 'Keyword', ' '],
          [$type, $ta_server, $keyword, $search]
          );

      });

      w_menu.append($E('button').text('길드 구성원 정보').button().width('100%').click(guildMember));
      w_menu.append($E('button').text('길드 등급 정보').button().width('100%').click(guildGrade));


      function fnSearch() {
        debug('fnSearch Called');
        menu.ajax({
          methodcall: 'getGuildinfo',
          data: [$type.val(),$ta_server.val(), $keyword.val()],
          success: function (r) {
            if(r[0]!=null) guildid = r[0]['db_id'];
            searchState = true;
            w_guildinfo.empty();
            w_guildinfo.clientTable(r, {
              field: ['db_id','name','level','exp','gold', 'rp','accumulated_co_rp','accumulated_ro_rp','influence_amount','calculate_influence_date','unreg_date','unreg_flag','changeChief'],
              head:  ['Guild_ID','길드명','레벨', '경험치', '골드', 'RP','CO_RP','RO_RP','영향력','영향력 정산일','Unreg_date','Unreg_flag','길드장위임'],
              footer: false, width: '100%',
              translate: {unreg_flag: {1: '해산', 0: '정상'}},
              translate_realtime : {
                changeChief : function(v, cname, row){
                  return $E('button').button({icons:{primary:'ui-icon-refresh'}}).click(function(){
                    var tempWin = getWindow(menu, '길드장 위임', 90,1400,'auto','auto');
                    var nextChief = $E('text').enterKey(changeChief),
                          changeChiefButton = $E('button').button().text('변경').css({width:'80px',height:'20px'}).click(changeChief);
                    tempWin.append(nextChief, changeChiefButton);
                    function changeChief(){
                      menu.ajaxAsync('changeChief', $ta_server.val(), row.db_id, nextChief.val()).then(function(r){
                        if(r.ErrCode===1000){
                          alert('처리가 완료되었습니다. 재검색 후 이용해주세요');
                        }
                        alert('에러가 발생했습니다 - '+r.ErrMsg);
                      });
                    }
                  })
                }
              }
            });
//            w_guildinfo.clientTable(r, {
//              field: ['notice','notice_date','reg_date','reusable_name_date'], //slotcount, moru 작업예정
//              head: ['공지','공지일','등록일','Reusable_name_date'],
//              footer: false, width: '100%',
//              translate: {},
//              translate_realtime: {}
//            });
          }
        });
      }

      function guildMember() {
        if (!searchState) {
          alert('길드를 검색 후 이용해주세요');
          return;
        }
        var curMenu = getResultWindow(menu, ''.t('BLESS') + 'DBGuildMember(' + guildid + ')', 1300, 440);
        var svr = $ta_server.val();
        curMenu.ajax({
          methodcall: 'getGuildMember',
          data: [guildid, $ta_server.val()],
          success: function (r) {
            curMenu.clientTable(r, {
              field : ['grade_type','db_id','player_db_id','real_name','join_date','level','logout_date','unreg_date','unreg_flag','delete'],
              width: '100%',
              cell_modify : [ 'grade_type' ],
              cell_modify_after : function( bef, aft, cname, row ){
                return alert('등급수정기능은 스튜디오 협의후 제공 예정입니다.');
                //return menu.ajaxAsync( 'setBlockChatDate', row.player_db_id, row.server_id, aft );
              },
              translate_realtime : {
                'delete' : function(v, cname, row){
                  return $E('button').button().text('삭제').click(function(){
                    if(confirm('정말 삭제하시겠습니까?')){
                      return alert('삭제기능은 스튜디오 협의후 제공 예정입니다.');

                      menu.ajaxAsync('deleteMember', row.db_id, svr).then(function(){
                        alert('삭제가 완료되었습니다. 재검색 후 이용해주세요');
                      });
                    }
                  });
                }
              },
              sort_field : 'grade_type',
              sort_asc : true
            });
          }
        })
      }
      function guildGrade() {
        if (!searchState) {
          alert('길드를 검색 후 이용해주세요');
          return;
        }
        var curMenu = getResultWindow(menu, ''.t('BLESS') + 'DBGuildGrade(' + guildid + ')', 1300, 440);
        var svr = $ta_server.val();
        curMenu.ajax({
          methodcall: 'getMemberGrade',
          data: [guildid, $ta_server.val()],
          success: function (r) {
            curMenu.clientTable(r, {width: '100%'});
          }
        })
      }

      function getWindow(menu, title, top, left, width, height) {
        return $E('div').win({
          title: title,
          parent: menu,
          top: top || 0,
          left: left || 0,
          width: width || 'auto',
          height: height || 'auto',
          buttonpane: false,
          close: true,
          status: false,
          'extends': false
        });
      }

    };
  });

})(jQuery, this, this.document);
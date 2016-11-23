/**
 * BlessLogView
 * ADM 4.0 JavaScript Menu
 * @author bitofsky@neowiz.com 2014.02.07
 * @package
 * @subpackage
 * @encoding UTF-8
 */

// http://glat.info/jscheck/
/*global $, jQuery, $adm, $E, confirm, console, alert, JSON, HTMLInputElement define */

// 명료한 Javascript 문법을 사용 한다.
"use strict";

(function($, window, document){
define(['beans/Bless/BlessDesc', 'beans/Bless/BlessGameData'], function( DESC, GameData ){
  /**
   * BlessLogView Menu
   * @param {mixed} arg1
   * @param {mixed} arg2
   */
  return function BlessRxRView( arg1, arg2 ){
    var im = this;
    $adm.loadCss('common/css/themes/leeejong/styler.css?t=' + (new Date().getTime()));
    im.addClass("leeejong");
    var wins = [];
    var els = {
        search: {panel: null, minimize: false, type: null, key: null, btn: null, tbl: null, padding: {left: 3, top: 13}},
        view: null
    };
    els.search.panel = $E('div').addClass("Search_Form").css({'display': 'block'});

    els.search.panel.append($E('label').text("서버선택"));
    els.search.contents = $E('div');
    els.search.tbl = $E('div');
    im.append(els.search.panel).append("<hr>").append(els.search.contents);
    //els.search.contents.append(els.search.tbl);

    im.ajaxAsync('getServerInfo').then(function( serverList ){
      els.search.server = $E('select', {name:'server_id'}).selectOptions( serverList, {text:'name', value:'server_id', sort: false} );
      els.search.panel.append( els.search.server )
        .append( $E('label').text("CO") )
        .append( $E('button').text('정보').click( function(){
          im.ajaxAsync('getCOList', els.search.server.val()).then(function( co ){
            els.search.contents.empty().clientTable( co, {
              field : ['bid_price','citadel_cid','citadel','name','guild_db_id'],
              head  : ['bid_price','citadel','citadel_cid','name','guild_db_id'],
              translate : {
                citadel_cid : DESC.citadel,
                guild : DESC.guildname
              },
              translate_realtime : {
                citadel : function(v, cname, row){return row.citadel_cid;},
              },
              width: '100%'
            } );
          })
        }))
        .append( $E('button').text('입찰정보').click( function(){
          im.ajaxAsync('getCOBidList', els.search.server.val()).then(function( co ){
            els.search.contents.empty().clientTable( co, {
              width: '100%'
            } );
          })
        }))
        .append( $E('label').text("RO") )
        .append( $E('button').text('정보').click( function(){
          im.ajaxAsync('getROList', els.search.server.val()).then(function( co ){
            els.search.contents.empty().clientTable( co, {
              field : ['realm_type','calculate_rp_date','name','guild_db_id'],
              head  : ['realm','calculate_rp_date','name','guild_db_id'],
              translate : {
                realm_type : DESC.realm
              },

              width: '100%'
            } );
          })
        }))
        .append( $E('button').text('참가정보').click( function(){
          im.ajaxAsync('getROGuildReservations', els.search.server.val()).then(function( co ){
            els.search.contents.empty().clientTable( co, {
              field : ['realm_type','db_id','attacker','name','guild_db_id'],
              head  : ['realm','db_id','attacker','name','guild_db_id'],
              translate : {
                attacker  : DESC.attacker,
                realm_type : DESC.realm
              },
              width: '100%'
            } );
          })
        }))
        .append( $E('label').text("설정정보") )
        .append( $E('button').text('컨퀘스트 설정').click( function(){
          im.ajaxAsync('getConquestSetup', els.search.server.val()).then(function( co ){
            els.search.contents.empty().clientTable( co, {
              width: '100%'
            } );
          })
        }))
        .append( $E('button').text('CO 설정').click( function(){
          im.ajaxAsync('getCOAuctionList', els.search.server.val()).then(function( co ){
            els.search.contents.empty().clientTable( co, {
              width: '100%'
            } );
          })
        }))
        .append( $E('button').text('RO 설정').click( function(){
          im.ajaxAsync('getROReservations', els.search.server.val()).then(function( co ){
            els.search.contents.empty().clientTable( co, {
              width: '100%'
            } );
          })
        }));
    });

    function getGuild(dbid, server){
      im.ajax({
        methodcall : ['getGuildName'],
        data       : [  dbid, server  ],
        success    : function( r ){
          debug(r);
          debug(r.name);
          return r.name;
        }
      });
    }

  }
})})(jQuery, this, this.document);
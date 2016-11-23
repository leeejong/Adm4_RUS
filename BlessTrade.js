/**
 * BlessTrade
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
  define(['beans/Bless/BlessDesc'], function (Desc) {

    /**
     * BlessTrade Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessTrade(arg1, arg2) {

      var menu = this,
            searchState = false,
            searchType = '',
            searchKey = '',
            searchServer = '',
            rangeStart = '',
            rangeEnd = '';

      var headDesc = Desc.TradeHead;
      var logType = Desc.TradeLogType;

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
        height: 190,
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
        top: 200,
        left: 0,
        width: 400,
        height: 430,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      var w_target = $E('div').win({
        title: 'Target Info'.t('BLESS'),
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
        id: '거래번호',
        user: 'USN / PmangID',
        character: 'CSN / Name'
      }, {sort: false}).variablesave('BlessTrade.type'),
        $keyword = $E('text', {name: 'keyword'}).css({width: 95}).enterKey(function(){if($keyword.validate()){fnSearch();}}).validate($type, {
          id: {required: true},
          user: {required: true},
          character: {required: true},
      }).variablesave('BlessTrade.keyword'),
        $sDate =  $E('text').validate({required: true, date:'-1 days'}),
        $sTime = $E('text').validate({required: true, date:'H:i:s'}).val('000000'),
        $eDate =  $E('text').validate({required: true, date:'Y-m-d'}),
        $eTime = $E('text').validate({required: true, date:'H:i:s'}).val('235959'),
        $range = $E('div').append($sDate,' ',$sTime,' ~ ',$eDate,' ',$eTime),
        $search = $E('button').text('Search').button().click(function(){if($keyword.validate()){fnSearch();}});

      menu.ajaxAsync('getServerInfo').then(function (serverList) {
        $ta_server = $E('select', {name: 'server_id'}).selectOptions(serverList, {text: 'name', value: 'server_id', sort: false}).css({'width':'100px'});

        w_search.layout(
          'table',
          ['Type', 'Server', 'Keyword'],
          [$type, $ta_server, $keyword]
        ).layout('table',['Range','Search'],[$range, $search]);

      });

      w_menu.append($E('button').text('등록 정보').button().width('100%').click(auction)); //bl_gt_auction
      w_menu.append($E('button').text('거래 내역').button().width('100%').click(auctionLog)); //bl_lt_auction
      w_menu.append($E('button').text('수령탭 정보').button().width('100%').click(outbox)); //bl_gt_auction_outbox
      w_menu.append($E('button').text('수령 내역').button().width('100%').click(outboxLog)); //bl_lt_auction_outbox


      function fnSearch() {
        debug('fnSearch Called');
        menu.ajax({
          methodcall: 'getTradeInfo',
          data: [$type.val(),$ta_server.val(), $keyword.val()],
          success: function (r) {
            w_target.empty();
            if(r[0]===null){ return '값이 없습니다'; }
            searchType =  $type.val(); searchServer =  $ta_server.val(); searchState = true;
            rangeStart = $sDate.val().substring(0,4)+'-'+$sDate.val().substring(4,6)+'-'+$sDate.val().substring(6,8)+' '+$sTime.val().substring(0,2)+':'+$sTime.val().substring(2,4)+':'+$sTime.val().substring(4,6);
            rangeEnd = $eDate.val().substring(0,4)+'-'+$eDate.val().substring(4,6)+'-'+$eDate.val().substring(6,8)+' '+$eTime.val().substring(0,2)+':'+$eTime.val().substring(2,4)+':'+$eTime.val().substring(4,6);

            switch(searchType){
              case 'id': searchKey = r[0]['auction_id']; break;
              case 'user': searchKey = r[0]['usn']; break;
              case 'character': searchKey = r[0]['csn']; break;
            }
            w_target.empty();
            w_target.clientTable(r, {
              footer: false, width: '100%',
            });
          }
        });
      }

      function auction(){
        if (!searchState) return alert('대상정보를 검색 후 이용해주세요');
        var curMenu = getResultWindow(menu, ''.t('BLESS') + 'Auction( Type - ' + searchType+ ', Key -'+ searchKey  + ')', 1300, 500);
        curMenu.ajax({
          methodcall: 'getAuction',
          data: [searchType, searchServer, searchKey],
          success: function (r) {
            curMenu.clientTable(r,{
              field  : ['auction_id','reg_date','expire_date','world_id','usn','csn','item_db_id','item_cid','item_name','amount','total_price','detail','withdraw'],
              head : headDesc,
              width: '100%',
              pagesize : 13,
              sort_field : 'auction_id',
              sort_desc : false,
              translate_realtime : {
                withdraw : function(r, cname, row){
                  return $E('button').button({text:false, icons:{primary:'ui-icon-refresh'}}).click(function(){
                    curMenu.ajaxAsync('cancelAuction',row.auction_id, row.usn).then(function (r) { debug(r); alert('회수가 완료되었습니다.'); auction(); });
                  });
                },
                detail : function(r, cname, row){
                  return $E('button').button({text:false, icons:{primary:'ui-icon-plus'}}).click(function(){
                    curMenu.ajaxAsync('searchDetail',row.auction_id).then(function (r) {
                      $E('div').dialog().clientTable(r,{
                        field : ['name', 'Data'],
                        head : ['StatType', 'Value'],
                        translate : {
                          'Data' : Desc.legend_option
                        }
                      });
                    });
                  });
                }
              }
            });
          }
        });
      }

      function auctionLog(){ //기간추가해야됨
        if (!searchState) return alert('대상정보를 검색 후 이용해주세요');
        rangeStart = $sDate.val().substring(0,4)+'-'+$sDate.val().substring(4,6)+'-'+$sDate.val().substring(6,8)+' '+$sTime.val().substring(0,2)+':'+$sTime.val().substring(2,4)+':'+$sTime.val().substring(4,6);
        rangeEnd = $eDate.val().substring(0,4)+'-'+$eDate.val().substring(4,6)+'-'+$eDate.val().substring(6,8)+' '+$eTime.val().substring(0,2)+':'+$eTime.val().substring(2,4)+':'+$eTime.val().substring(4,6);
        var curMenu = getResultWindow(menu, ''.t('BLESS') + 'AuctionLog( Type - ' + searchType+ ', Key -'+ searchKey  + ')', 1300, 500);
        curMenu.ajax({
          methodcall: 'getAuctionLog',
          data: [searchType, searchServer, searchKey, rangeStart, rangeEnd],
          success: function (r) {
            curMenu.clientTable(r,{
              field  : ['auction_id','reg_date','world_id','usn','csn','item_db_id','item_cid','item_name','total_price','commission','amount','log_type','log_date','buy_usn'],
              head : headDesc,
              width: '100%',
              pagesize : 13,
              sort_field : 'auction_id',
              sort_desc : false,
              translate : { log_type : logType.auction }
            });
          }
        });
      }

      function outbox(){
        if (!searchState) return alert('대상정보를 검색 후 이용해주세요');
        var curMenu = getResultWindow(menu, ''.t('BLESS') + 'Outbox( Type - ' + searchType+ ', Key -'+ searchKey  + ')', 1400, 500);
        curMenu.ajax({
          methodcall: 'getOutbox',
          data: [searchType, searchServer, searchKey],
          success: function (r) {
            curMenu.clientTable(r,{
              field  : ['auction_id','outbox_id','status','item_db_id','item_name','amount','total_price','active_world','active_csn','in_type','upd_date','expire_date','reg_date','setnormal','setenddate','remove'],
              head : headDesc,
              width: '100%',
              pagesize : 13,
              sort_field : 'auction_id',
              sort_desc : false,
              translate : {
                status : {N:'등록중', U:'지급중'},
                in_type : logType.outbox
              },
              translate_realtime : {
                remove : function(v, cname, row){
                  return $E('button').button({text:false, icons:{primary:'ui-icon-minus'}}).click(function(){
                    curMenu.ajaxAsync('removeOutbox',row.outbox_id, row.usn).then(function (r) { debug(r); alert('Complete.'); outbox(); });
                  });
                },
                setenddate : function(v, cname, row){
                  return $E('button').button({text:false, icons:{primary:'ui-icon-plus'}}).click(function(){
                    curMenu.ajaxAsync('setEnddate',row.outbox_id).then(function (r) { debug(r); alert('Complete'); outbox(); });
                  });
                },
                setnormal : function(v, cname, row){
                  if(row.in_type===4){
                    return $E('button').button({text:false, icons:{primary:'ui-icon-plus'}}).click(function(){
                      curMenu.ajaxAsync('setNormal',row.outbox_id).then(function (r) { debug(r); alert('Complete.'); outbox(); });
                    });
                  }
                  return '';
                }
              }
            });
          }
        });
      }

      function outboxLog(){ //기간추가해야됨
        if (!searchState) return alert('대상정보를 검색 후 이용해주세요');
        rangeStart = $sDate.val().substring(0,4)+'-'+$sDate.val().substring(4,6)+'-'+$sDate.val().substring(6,8)+' '+$sTime.val().substring(0,2)+':'+$sTime.val().substring(2,4)+':'+$sTime.val().substring(4,6);
        rangeEnd = $eDate.val().substring(0,4)+'-'+$eDate.val().substring(4,6)+'-'+$eDate.val().substring(6,8)+' '+$eTime.val().substring(0,2)+':'+$eTime.val().substring(2,4)+':'+$eTime.val().substring(4,6);
        var curMenu = getResultWindow(menu, ''.t('BLESS') + 'OutboxLog( Type - ' + searchType+ ', Key -'+ searchKey  + ')', 1400, 500);
        curMenu.ajax({
          methodcall: 'getOutboxLog',
          data: [searchType, searchServer, searchKey, rangeStart, rangeEnd],
          success: function (r) {
            curMenu.clientTable(r,{
              field  : ['log_type','in_type','auction_id','outbox_id','expire_date','item_db_id','item_name','amount','upd_date','gold','active_world','active_csn','new_item_db_id','restore'],
              head : headDesc,
              width: '100%',
              pagesize : 13,
              sort_field : 'auction_id',
              sort_desc : false,
              translate : {
                in_type : logType.outbox,
                log_type : logType.auction
              },
              translate_realtime : {
                restore : function(v, cname, row){
                  if(row.active_csn===null){
                    return $E('button').button({text:false, icons:{primary:'ui-icon-refresh'}}).click(function(){
                      curMenu.ajaxAsync('restoreOutbox',row.outbox_id, row.usn).then(function (r) { debug(r); alert('복구가 완료되었습니다.'); outboxLog(); });
                    });
                  }
                  return '';
                }
              }
            });
          }
        });
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
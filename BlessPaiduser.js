/**
 * BlessPaiduser
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2015.12.18
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
     * BlessPaiduser Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessPaiduser(arg1, arg2) {

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
              var usertype = $E('select', {name: 'type'}).validate({required: true}).selectOptions({id: 'ID', usn: 'USN'}, {sort: false}).variablesave('blessPaiduser.type'),
                      keyword = $E('text', {name: 'keyword'}).css({width: 70}).enterKey(function () {
                if (keyword.validate()) {
                  searchUser(usertype.val(), keyword.val());
                }
              }).validate(usertype, {
                id: {required: true}, usn: {required: true, onlynumber: true}
              }).variablesave('BlessPaid.keyword'),
                      searchButton = $E('button').button().text('Having').css({'margin-left': '10px', 'width': '80%', 'height': '45px'}).click(function () {
                if (keyword.validate())
                  searchUser(usertype.val(), keyword.val());
              }),
                      searchButton2 = $E('button').button().text('Expired').css({'margin-left': '10px', 'width': '80%', 'height': '45px'}).click(function () {
                if (keyword.validate())
                  searchUser2(usertype.val(), keyword.val());
              });

              return $E('div').verticalTable([{
                  'Type': usertype,
                  'Key': keyword
                }], {width: '100%'}).append('<br/>', searchButton, '<br/>', searchButton2);
            }
          },
          {
            name: 'Log',
            contents: function () {
              var usertype = $E('select', {name: 'type'}).validate({required: true}).selectOptions({id: 'ID', usn: 'USN'}, {sort: false}).variablesave('blessPaiduser.type'),
                      keyword = $E('text', {name: 'keyword'}).css({width: 60}).enterKey(function () {
                if (keyword.validate()) {
                  searchUser(usertype.val(), keyword.val());
                }
              }).validate(usertype, {
                id: {required: true}, usn: {required: true, onlynumber: true}
              }).variablesave('BlessPaid.keyword2'),
                      searchButton = $E('button').button().text('Open Log').css({'margin-left': '10px', 'width': '80%', 'height': '45px'}).click(function () {
                if (keyword.validate())
                  searchLog(usertype.val(), ta_server.val(), keyword.val());
              });

              return $E('div').verticalTable([{
                  'Type': usertype,
                  'Server': ta_server,
                  'Key': keyword
                }], {width: '100%'}).append('<br/>', searchButton);
            }
          },
          {
            name: 'History',
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
                if (keyword.validate())
                  searchHistory(usertype.val(), keyword.val(), start, end);
              });
              return $E('div').verticalTable([{
                  'Type': usertype,
                  'Key': keyword,
                  'Start': start_day,
                  ' ': start_time,
                  'End': end_day,
                  '  ': end_time
                }], {width: '100%'}).append('<br/>', searchButton);
            }
          }
        ]);
      }



      function searchUser(type, key) { //보유중인 상품 조회

        menu.ajaxAsync('searchUser', type, key, 1).then(function (r) {
          var userWin = getResultWindow(menu, 'Userinfo - Having Items ' + key);
          userWin.clientTable(r, {
            field: ['giftbox_id', 'reg_date', 'provider_type', 'provider_usn', 'title', 'status', 'expire_date', 'cash_item_id', 'pay_price','amount','active_world','active_csn', 'saleinfo_id', 'getback', 'withdraw'],
            head: Desc.PaiduserGiftbox,
            width: '100%',
            translate_realtime: {
              getback: function (v, cname, row) {
                return $E('button').button().text('Back').css({'width': '60', 'height': '25'}).click(function () {
                  if (gmlevel === null || gmlevel > 3) {
                    alert('Not enough Gmlevel=>' + gmlevel);
                    return;
                  }
                  if (confirm('Are you sure?')) {
                    userWin.ajaxAsync('modifyGiftbox', 3, row.giftbox_id).then(alert('Complete'));
                  }
                });
              },
              withdraw: function (v, cname, row) {
                return $E('button').button().text('Withdraw').css({'width': '80', 'height': '25'}).click(function () {
                  if (gmlevel === null || gmlevel > 3) {
                    alert('Not enough Gmlevel=>' + gmlevel);
                    return;
                  }
                  if (confirm('Are you sure?')) {
                    userWin.ajaxAsync('modifyGiftbox', 2, row.giftbox_id).then(alert('Complete'));
                  }
                });
              }
            },
            translate: {
              provider_type: Desc.PaiduserProviderType,
            }
          });
        });
      }

      function searchUser2(type, key) { //만료일 경과상품 조회

        menu.ajaxAsync('searchUser', type, key, 2).then(function (r) {
          var userWin = getResultWindow(menu, 'Userinfo - Expired items ' + key);
          userWin.clientTable(r, {
            field: ['giftbox_id', 'reg_date', 'provider_type', 'provider_usn', 'title', 'status', 'expire_date', 'cash_item_id', 'pay_price','amount','active_world','active_usn', 'saleinfo_id'],
            head: Desc.PaiduserGiftbox,
            width: '100%'
          });
        });
      }
      function searchLog(type, server, key) {

        menu.ajaxAsync('searchLog', type, server, key).then(function (r) {
          var userWin = getResultWindow(menu, 'Userinfo - searchLog ' + key);
          userWin.clientTable(r, {
//            field: ['giftbox_id', 'reg_date', 'provider_type', 'provider_usn', 'title', 'status', 'expire_date', 'cash_item_id', 'pay_price', 'saleinfo_id'],
//            head: ['Giftbox_ID', '받은시간', '지급유형', '보낸USN', '상품명', '상태', '만료일', '꾸러미CID', '결재금액', 'NBOS결재번호'],
            width: '100%'
          });
        });
      }

      function searchHistory(type, key, start, end) {
        menu.ajaxAsync('searchHistory', type, key, start, end).then(function (r) {
          var logWin = getResultWindow(menu, 'searchHistory');
          logWin.clientTable(r, {
            field: ['giftbox_id', 'get_date', 'provider_type', 'provider_usn', 'title', 'reg_date', 'status', 'log_type', 'active_world', 'active_csn', 'cash_item_id', 'pay_price','amount', 'expire_date', 'saleinfo_id'],
            head:  Desc.PaiduserGiftbox,
            width: '100%',
            translate: {
              status: Desc.PaiduserStatus,
              log_type: Desc.PaiduserLogtype,
              provider_type: Desc.PaiduserProviderType,
            }
          });
        });


      }




    };

  });

})(jQuery, this, this.document);
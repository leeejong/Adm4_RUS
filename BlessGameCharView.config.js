/**
 * BlessGameCharView.config
 * ADM 4.0 JavaScript Menu
 * @author bitofsky@neowiz.com 2013.05.29
 * @modified leeejong@neowiz.com 2015.12.23
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
   * @param {type} CharInfo
   * @param {type} GameData
   * @param {type} DESC
   * @returns {BlessGameCharView.config_L22.BlessGameCharView.configAnonym$2}
   */
  define(['beans/Bless/BlessGameCharView.info.js', 'beans/Bless/BlessGameData', 'beans/Bless/BlessDesc'], function (CharInfo, GameData, DESC) {

    var menu = null;
    var adminGmlevel = 9;
    var serverCart = {};

    function transTime(v, cname, row) {
      return $E('span', {tooltip: $adm.getDate($adm.values.DATEFORMAT, v)}).text($adm.getDate('Y-m-d', v)).tooltip();
    }

    /**
     * GameCharView_config Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return {
      multi_character: true,
      UseHoverCharList: true,
      ssn: 347,
      game: 'Bless',
      langNameSpace: 'BLESS',
      search_type: {
        account: 'USN / ID',
        character: 'CSN / Name'
      },
      search_validate: {
        account: {required: true},
        character: {required: true}
      },
      getUserInfoArgs: ['search_type', 'search_key', 'server_id'],
      getCharListArgs: ['@METHOD[0][usn]'],
      clientTable: {
        userInfo: {
          field: ['userid', 'usn', 'connect', 'grade', 'gradePoint', 'vip', 'vipStart', 'vipEnd', 'viewVip', 'gmlevel', 'kickout', 'trade', 'ban'],
          head: DESC.CharConfigUserinfo,
          translate: {
            gmlevel: function (v, cname, row) {
              return GameData.getDataEditButton(adminGmlevel, menu, 0, 0, row.usn, 0, 1, DESC.DBGameGMLevel[v], DESC.DBGameGMLevel, 0);
            },
            kickout: function (v, cname, row) {
              return GameData.getDataEditButton(adminGmlevel, menu, 0, 0, row.usn, 0, 4, '', serverCart, 0);
            },
            vipEnd: function (v, cname, row) {
              if (row.vip_level > 0)
                return GameData.getDataEditButton(adminGmlevel, menu, 0, 0, row.usn, 0, 109, v, 0, row.vip_level);
              else
                return '';
            },
            connect: function (v, cname, row) {
              return $E('button').button({icons: {primary: 'ui-icon-plus'}}).css({'width': 35, 'height': 26}).click(function () {
                menu.ajax({
                  methodcall: ['getConnectInfo'],
                  methodparam: [[row.usn]],
                  success: function (connectInfo) {
                    var subwin = $E('div').win({
                      title: 'Connection', parent: menu,
                      top: 110, left: 660, width: 'auto', height: 'auto',
                      buttonpane: false, screen_toggle: true, minimum: true,
                      status: true, resizable: false, draggable: true, 'extends': false
                    });
                    if (connectInfo['jorbi']) {
                      subwin.empty();
                      var connect = '-', pcb = '-';
                      if (connectInfo['jorbi'].lblged === 'T')
                        connect = serverCart[connectInfo['jorbi'].chid] + ' ON';
                      else if (connectInfo['jorbi'].lblged === 'F')
                        connect = 'OFF';
                      if (connectInfo['jorbi'].pcb_ef === 'T')
                        pcb = 'PCB ON(PCBID :' + connectInfo['jorbi'].pcb_id + ')';
                      else if (connectInfo['jorbi'].pcb_ef === 'F')
                        pcb = 'PCB OFF';
                      subwin.append($E('span').text(connect)).append($E('span').text(' / ')).append($E('span').text(pcb));
                      subwin.clientTable(connectInfo['middle'], {
                        field: ['name', 'csn', 'upd_date', 'reg_date'],
                        head: ['Name', 'CSN', 'Update_date', 'Reg_date'],
                        footer: false
                      });
                    } else {
                      subwin.empty();
                      subwin.append($E('span').text('Disconnect'));
                    }
                  }
                });
              });
            },
            trade: function (v, cname, row) {
              var usn = row.usn;
              return $E('button').button({icons: {primary: 'ui-icon-plus'}}).css({'width': 35, 'height': 26}).click(function () {
                menu.ajax({
                  methodcall: ['getTradeInfo', 'getTradeDeny'],
                  methodparam: [[row.usn], [row.usn]],
                  success: function (tradeInfo, denyInfo) {
                    var subwin = $E('div').win({
                      title: 'TradeInfo',
                      parent: menu,
                      top: 110,
                      left: 810,
                      width: 'auto',
                      height: 'auto',
                      buttonpane: false,
                      screen_toggle: true,
                      minimum: true,
                      status: true,
                      resizable: true,
                      draggable: true,
                      'extends': false
                    });
                    subwin.clientTable(tradeInfo, {
                      title: 'TradeInfo',
                      field: ['server_name', 'stop_all_trade', 'stop_auction', 'stop_mail', 'stop_personal_trade', 'stop_warehouse'],
                      head: ['Server', 'All', 'Auction', 'Mail', '1:1 Trade', 'GuildWarehouse'],
                      width: '100%',
                      translate: {
                        'stop_all_trade': {0: 'Free', 1: 'Restrict'},
                        'stop_auction': {0: 'Free', 1: 'Restrict'},
                        'stop_mail': {0: 'Free', 1: 'Restrict'},
                        'stop_personal_trade': {0: 'Free', 1: 'Restrict'},
                        'stop_warehouse': {0: 'Free', 1: 'Restrict'}
                      },
                      cell_modify: ['stop_all_trade', 'stop_auction', 'stop_mail', 'stop_personal_trade', 'stop_warehouse'],
                      cell_modify_after: function (bef, aft, cname, tradeRow) {
                        if (aft === '1' && (adminGmlevel === null || adminGmlevel > 4)) {
                          alert('You have not enough auth. GmLevel-> ' + adminGmlevel);
                          return;
                        }
                        if (aft === '0' && (adminGmlevel === null || adminGmlevel > 2)) {
                          alert('You have not enough auth. GmLevel-> ' + adminGmlevel);
                          return;
                        }
                        return menu.ajaxAsync('setTradeRestrict', row.usn, tradeRow.server_id, cname, aft);
                      },
                      footer: false,
                      scrollbar: false
                    });
                    subwin.clientTable(denyInfo, {
                      title: 'TradeCenter Restrict Info',
                      field: ['usn', 'reg_usn', 'reg_date', 'remove'],
                      translate_realtime: {
                        remove: function (v, cname, row) {
                          return $E('button').button({icons: {primary: 'ui-icon-minus'}}).css({'width': 35, 'height': 26}).click(function () {
                            return menu.ajaxAsync('removeTradeDeny', row.usn).then(function (r) {
                              if(r) alert('Complete'); else alert('Error occured.');
                            });
                          });
                        }
                      },
                      width: '100%'
                    });
                    subwin.append($E('button').button().text('Restrict TradeCenter').css({'width': 380, 'height': 26}).click(function () {
                      menu.ajaxAsync('insertTradeDeny', usn).then(function (r) {
                        if (r) alert('Complete'); else alert('Error occured.');
                      });
                    }));
                  }
                });
              });
            },
            ban: function (v, cname, row) {
              return $E('button').button({icons: {primary: 'ui-icon-document'}}).css({'width': 35, 'height': 26}).click(function () {
                menu.ajaxAsync('getBanInfo', row.usn).then(function (r) {
                  var subwin = $E('div').win({
                    title: 'Ban Info',
                    parent: menu,
                    top: 110,
                    left: 810,
                    width: 'auto',
                    height: 'auto',
                    buttonpane: false,
                    screen_toggle: true,
                    minimum: true,
                    status: true,
                    resizable: true,
                    draggable: true,
                    'extends': false
                  });
                  subwin.clientTable(r, {
                    field: ['usn', 'server_name', 'expiretime', 'msg', 'banReset'],
                    head: ['USN', 'Server', 'ExpireTime', 'Message', 'Reset'],
                    width: '100%',
                    footer: false,
                    translate: {
                      banReset: function (v, cname, row) {
                        return $E('button').button({icons: {primary: 'ui-icon-trash'}}).css({'width': 35, 'height': 26}).click(function () {
                          if (adminGmlevel === null || adminGmlevel > 3) {
                            alert('You have not enough auth. GmLevel-> ' + adminGmlevel);
                            return;
                          }
                          if (confirm('Are you sure?')) {
                            menu.ajaxAsync('resetBan', row.usn, row.serverchid);
                            alert('Complete');
                          }
                        });
                      }
                    }
                  });
                });
              });
            },
            viewVip: function (v, cname, row) {
              return $E('button').button({icons: {primary: 'ui-icon-document'}}).css({'width': 35, 'height': 26}).click(function () {
                menu.ajaxAsync('getVipInfo', row.usn).then(function (r) {
                  var subwin = $E('div').win({
                    title: 'VIP Info',
                    parent: menu,
                    top: 110,
                    left: 810,
                    width: 'auto',
                    height: 'auto',
                    buttonpane: false,
                    screen_toggle: true,
                    minimum: true,
                    status: true,
                    resizable: true,
                    draggable: true,
                    'extends': false
                  });
                  subwin.clientTable(r, {
                    field: ['level', 'eff_start_date', 'eff_end_date', 'upd_date', 'reg_date'],
                    head: ['Level', 'StartDate', 'EndDate', 'Upd_date', 'Reg_date'],
                    width: '100%',
                    footer: false
                  });
                });
              });
            },
            gradePoint: function (v, cname, row) {
              return $E('button').button().text(v).css({'width': 45, 'height': 26}).click(function () {
                if (adminGmlevel === null || adminGmlevel > 2) {
                  alert('You have not enough auth. GmLevel-> ' + adminGmlevel);
                  return;
                }
                menu.ajaxAsync('getGradeBaseInfo', row.usn).then(function (r) {
                  var gradeWin = $E('div').win({
                    title: 'Modify Grade',
                    parent: menu,
                    top: 0,
                    left: 1615,
                    width: 'auto',
                    height: 'auto',
                    buttonpane: false,
                    screen_toggle: true,
                    minimum: true,
                    status: true,
                    resizable: true,
                    draggable: true,
                    'extends': false
                  });
                  var modifyWin = $E('div').win({
                    title: 'Modify Point',
                    parent: menu,
                    top: 120,
                    left: 720,
                    width: 270,
                    height: 150,
                    buttonpane: false,
                    screen_toggle: false,
                    minimum: true,
                    status: true,
                    resizable: false,
                    draggable: true,
                    'extends': false
                  });
                  gradeWin.clientTable(r, {
                    field: ['grade', 'grade_name', 'str_value', 'end_value'],
                    head: ['Grade', 'Name', 'StartValue', 'EndValue'],
                    footer: false,
                    slide: false
                  });
                  var gradeState = -1;
                  var afterGrade = $E('span').text('Press Enter Button');
                  var afterPoint = $E('text').change(function () {
                    var inputVal = afterPoint.val();
                    r.forEach(function (eachGrade) {
                      if (inputVal >= eachGrade.str_value && inputVal <= eachGrade.end_value) {
                        afterGrade.text(eachGrade.grade_name);
                        gradeState = eachGrade.grade;
                      }
                      if (inputVal <= 900) {
                        afterGrade.text('No Grade');
                        gradeState = 0;
                      }
                    });
                    if (inputVal > 100000000000 || inputVal < 0)
                      afterGrade.text("Error");
                  });
                  var changeButton = $E('button').button().text('Apply').css({'width': 250, 'height': 30, 'text-align': 'center'}).click(function () {
                    if (gradeState < 0 || isNaN(afterPoint.val()) || afterPoint.val() < 0) {
                      alert('Error');
                      return;
                    }
                    if (!confirm('Are you sure?'))
                      return;
                    modifyWin.ajaxAsync('modifyGradePoint', row.usn, afterPoint.val(), gradeState).then(function () {
                      alert('Complete.');
                    });
                  });
                  modifyWin.verticalTable([[
                      afterPoint, afterGrade
                    ]], {head: ['Point', 'Grade'], width: '98%'}).append('<br>', '  ', changeButton);

                });
              });
            }
          }
        },
        charList: {
          field: ['server_name', 'player_db_id', 'player_name', 'player_level', 'gold'],
          head: {
            player_db_id: 'CSN',
            server_name: 'Server',
            player_name: 'Name',
            player_level: 'Level',
            gold: 'Gold'
          },
          translate: {
            logout_time: transTime
          }
        }
      },
      tabs: {
        'Character': CharInfo
      },
      extraArguments: [],
      getExtraForm: function (menu) {

        return menu.ajaxAsync('getServerInfo').then(function (serverList) {

          serverList.forEach(function (row) {
            var serverrow = {};
            serverrow[row.server_id] = row.name;
            row.modname = row.server_id + '.' + row.name;
            if (row.server_id === 17)
              row.modname += "(8/15)";
            if (row.server_id === 18)
              row.modname += "(6/7/13)";
            if (row.server_id === 19)
              row.modname += "(5/9)";
            if (row.server_id === 20)
              row.modname += "(4/12)";
            if (row.server_id === 21)
              row.modname += "(14/16)";
            $.extend(serverCart, serverrow);
          });

          var $server = $E('select', {name: 'server_id'}).selectOptions(serverList, {text: 'modname', value: 'server_id', sort: false});

          // 검색기간 메뉴 삭제 및 서버 정보를 가장 앞으로 교체
          menu.find('table > thead > tr > td:eq(0)').before(menu.find('table > thead > tr > td:eq(2)').text('Server'));
          menu.find('table > tbody > tr > td:eq(0)').before(menu.find('table > tbody > tr > td:eq(2)').html($server));

          return $E('div');
        });
      },
      setMenu: function (m) {
        menu = m;
        adminGmlevel = GameData.getAdminGMLevel(menu);
      },
      getCharacterTabs: function (charList) {

        var cur = [],
                del = [];

        charList.forEach(function (cha) {
          if (+cha.unreg_flag)
            del.push(cha);
          else
            cur.push(cha);
        });

        var r = {};
        r['Active'] = cur;
        r['Removed'] = del;
        return r;

      }

    };

  });

})(jQuery, this, this.document);
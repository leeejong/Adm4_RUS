/**
 * BlessMerge
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
     * BlessMerge Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessMerge(arg1, arg2) {

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
              var usertype = $E('select', {name: 'type'}).validate({required: true}).selectOptions({id: 'ID', usn: 'USN'}, {sort: false}).variablesave('blessPaiduser.type'),
                      keyword = $E('text', {name: 'keyword'}).css({width: 70}).enterKey(function () {
                if (keyword.validate()) {
                  searchUser(usertype.val(), keyword.val());
                }
              }).validate(usertype, {
                id: {required: true}, usn: {required: true, onlynumber: true}
              }).variablesave('BlessPaid.keyword'),
                searchButton = $E('button').button().text('Search').css({'margin-left': '10px', 'width': '80%', 'height': '45px'}).click(function () {
                if (keyword.validate())
                  searchUser(ta_server.val(), usertype.val(), keyword.val());
              });

              return $E('div').verticalTable([{
                  'Server':ta_server,
                  'Type': usertype,
                  'Key': keyword
                }], {width: '100%'}).append('<br/>', searchButton);
            }
          }
        ]);
      }



      function searchUser(server, type, key) {

        //DBAccountData 조회
        menu.ajaxAsync('searchUser', server, type, key, 1).then(function (r) {
          var userWin = getResultWindow(menu, 'DBAccountData ' + key, 1200, 200);
          userWin.clientTable(r, {
            field : ['usn', 'logout_date', 'realm', 'setH','setU'],
            head:['USN','Logout_date','Realm','setToHeiran','setToUnion'],
            footer: false,
            width: '100%',
            translate_realtime: {
              'setH': function (v, cname, row) {
                if(row.realm===1){
                  return $E('button').button().text('Change').css({'width': '60', 'height': '25'}).click(function () {
                    if (confirm('are you sure?')) {
                      userWin.ajaxAsync('changeUser', server, row.usn, 0, 1).then(alert('Complete'));
                    }
                  });
                } else return '';
              },
              'setU': function (v, cname, row) {
                if(row.realm===0){
                  return $E('button').button().text('Change').css({'width': '60', 'height': '25'}).click(function () {
                    if (confirm('are you sure?')) {
                      userWin.ajaxAsync('changeUser', server, row.usn, 0, 2).then(alert('Complete'));
                    }
                  });
                } else return '';
              }
            },
            translate : {realm:Desc.realm}
          });
        });
        //DBPlayer조회
        menu.ajaxAsync('searchUser', server, type, key, 2).then(function (r) {
          var userWin = getResultWindow(menu, 'DBPlayer ' + key, 1200, 500, 210);
          userWin.clientTable(r, {
            field : ['db_id','player_name','realm_type','race_type','gender_type','class_type','must_change_name','unreg_flag','unreg_date','delete','restore1', 'restore2'],
            footer: false,
            width: '100%',
            translate : {
              realm_type : Desc.realm,
              race_type : Desc.raceTypeHud,
              gender_type : Desc.genderTypeHud,
              class_type : Desc.classTypeHud
            },
            translate_realtime: {
              'delete': function (v, cname, row) {
                if(row.unreg_flag===0){
                  return $E('button').button().text('Remove').css({'width': '60', 'height': '25'}).click(function () {
                    if (confirm('Are you sure?')) {
                      userWin.ajaxAsync('changeUser', server, row.usn, row.db_id, 3).then(alert('Complete'));
                    }
                  });
                } else return '';
              },
              'restore1': function (v, cname, row) {
                if(row.unreg_flag===1){
                  return $E('button').button().text('onlyRestore').css({'width': '60', 'height': '25'}).click(function () {
                    if (confirm('Are you sure?')) {
                      userWin.ajaxAsync('changeUser', server, row.usn, row.db_id, 4).then(alert('Complete'));
                    }
                  });
                } else return '';
              },
              'restore2': function (v, cname, row) {
                if(row.unreg_flag===1){
                  return $E('button').button().text('NameConflict').css({'width': '60', 'height': '25'}).click(function () {
                    var name = $E('text');
                    var nameWin = getResultWindow(menu, 'changename', 200, 130, 300, 700);
                    nameWin.append(name).append($E('button').button().text('ChangeName').click(function(){
                      if (confirm('Are you sure?')) {
                        userWin.ajaxAsync('changeUser', server, name.val(), row.db_id, 5).then(alert('Complete'));
                      }
                    }));

                  });
                } else return '';
              }
            }
          });
        });
      }

    };

  });

})(jQuery, this, this.document);
/**
 * BlessPost
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2015.9.6
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
  define('Bless/BlessPost/getResultWindow', [], function () {
    return function (menu, title, width, height, top, left) {
      return $E('div').win({
        title: 'Result :: ' + title,
        parent: menu,
        top: top || 130,
        left: left || 410,
        width: width || 'auto',
        height: height || 'auto',
        buttonpane: true,
        screen_toggle: true,
        minimum: true,
        status: true,
        resizable: true,
        draggable: true,
        'extends': true
      });
    };
  });

  define(['Bless/BlessPost/getResultWindow', 'adm/adm.sendProcess','beans/Bless/BlessDesc'], function (getResultWindow, sendProcess, Desc) {

    return function BlessPost(arg1, arg2) {

      var menu = this;

      var ta_server, ta_server2, ta_server3;

      menu.ajaxAsync('getServerInfo').then(function (serverList) {
        ta_server = $E('select', {name: 'server_id'}).selectOptions(serverList, {text: 'name', value: 'server_id', sort: false});
        ta_server2 = $E('select', {name: 'server_id'}).selectOptions(serverList, {text: 'name', value: 'server_id', sort: false});
        ta_server3 = $E('select', {name: 'server_id'}).selectOptions(serverList, {text: 'name', value: 'server_id', sort: false});
      });

      var leftmenu = $E('div').win({
        parent: menu,
        title: 'Menu',
        width: 120,
        height: 700,
        top: 0,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      var rightmenu = $E('div').win({
        parent: menu,
        title: 'Sender',
        left: 120,
        width: 1150,
        height: 700,
        top: 0,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      leftmenu.append($E('button').text('Send Mail').button().width('100%').click(mailSend));
      //leftmenu.append($E('button').text('유저 검색').button().width('100%').click(extractUser));
      //leftmenu.append($E('button').text('Make Item').button().width('100%').click(makeItem));
      leftmenu.append($E('button').text('Send Usnbox').button().width('100%').click(sendGiftbox));

/**
 * MakeItem -> 아이템 생성
 * @returns {undefined}
 */
      function makeItem(){
        rightmenu.win('remove_child');

        var subWin = $E('div').win({
          parent: rightmenu,
          title: '아이템 생성',
          left: 0,
          width: 500,
          height: 650,
          status: false,
          'extends': false,
        });

        var cid   = $E('text').validate({required: true, onlyNumber: true, innerMsg: true}).css({'box-sizing': 'border-box', width: '100px', height: 20}).variablesave('BlessPost.makeItem1'),
            amount= $E('text').validate({required: true, onlyNumber: true, innerMsg: true}).css({'box-sizing': 'border-box', width: '100px', height: 20}).variablesave('BlessPost.makeItem2'),
            legend= $E('text').validate({required: true, onlyNumber: true, innerMsg: true}).css({'box-sizing': 'border-box', width: '100px', height: 20}).variablesave('BlessPost.makeItem3'),
            remain= $E('text').validate({required: true, onlyNumber: true, innerMsg: true}).css({'box-sizing': 'border-box', width: '100px', height: 20}).variablesave('BlessPost.makeItem4'),
            type1 = $E('select').selectOptions(Desc.EParamType_forMake).val('-1'),
            val1  = $E('text').validate({required: true, onlyNumber: true, innerMsg: true, maxLength:8}).css({'box-sizing': 'border-box', width: '100px', height: 20}).val(0),
            type2 = $E('select').selectOptions(Desc.EParamType_forMake).val('-1'),
            val2  = $E('text').validate({required: true, onlyNumber: true, innerMsg: true, maxLength:8}).css({'box-sizing': 'border-box', width: '100px', height: 20}).val(0),
            type3 = $E('select').selectOptions(Desc.EParamType_forMake).val('-1'),
            val3  = $E('text').validate({required: true, onlyNumber: true, innerMsg: true, maxLength:8}).css({'box-sizing': 'border-box', width: '100px', height: 20}).val(0),
            type4 = $E('select').selectOptions(Desc.EParamType_forMake).val('-1'),
            val4  = $E('text').validate({required: true, onlyNumber: true, innerMsg: true, maxLength:8}).css({'box-sizing': 'border-box', width: '100px', height: 20}).val(0),
            type5 = $E('select').selectOptions(Desc.EParamType_forMake).val('-1'),
            val5  = $E('text').validate({required: true, onlyNumber: true, innerMsg: true, maxLength:8}).css({'box-sizing': 'border-box', width: '100px', height: 20}).val(0),
            type6 = $E('select').selectOptions(Desc.EParamType_forMake).val('-1'),
            val6  = $E('text').validate({required: true, onlyNumber: true, innerMsg: true, maxLength:8}).css({'box-sizing': 'border-box', width: '100px', height: 20}).val(0),
            type7 = $E('select').selectOptions(Desc.EParamType_forMake).val('-1'),
            val7  = $E('text').validate({required: true, onlyNumber: true, innerMsg: true, maxLength:8}).css({'box-sizing': 'border-box', width: '100px', height: 20}).val(0),
            type8 = $E('select').selectOptions(Desc.EParamType_forMake).val('-1'),
            val8  = $E('text').validate({required: true, onlyNumber: true, innerMsg: true, maxLength:8}).css({'box-sizing': 'border-box', width: '100px', height: 20}).val(0),
            type9 = $E('select').selectOptions(Desc.EParamType_forMake).val('-1'),
            val9  = $E('text').validate({required: true, onlyNumber: true, innerMsg: true, maxLength:4}).css({'box-sizing': 'border-box', width: '100px', height: 20}).val(0),
            dueDate = $E('text').validate({required: true, date: 'Y-m-d'}).css({'text-align': 'right', width: 100});
        var b_ready = $E('button').text('제작').button().css({'width': '95%'}).click(function () {
          var duration = dueDate.val().substring(0, 4) + '-' + dueDate.val().substring(4, 6) + '-' + dueDate.val().substring(6, 8);
          if (!subWin.validate()) return;

          menu.ajax({
            methodcall: ['makeItem'],
            data: [
              ta_server3.val(),cid.val(),amount.val(),legend.val(),remain.val()
              ,type1.val(),val1.val()
              ,type2.val(),val2.val()
              ,type3.val(),val3.val()
              ,type4.val(),val4.val()
              ,type5.val(),val5.val()
              ,type6.val(),val6.val()
              ,type7.val(),val7.val()
              ,type8.val(),val8.val()
              ,type9.val(),val9.val()
              ,duration
            ],
            success: function (r) {
              debug(r);
              var rWin = $E('div').win({
                parent: rightmenu,
                title: 'Result',
                left: 500,
                width: 600,
                height: 650,
                status: false,
                'extends': false,
              });
              var dbidText = $E('text').val(r),
                  dbidSpan = $E('span').text("생성된 Item의 DBID입니다 ");
              rWin.append(dbidSpan).append(dbidText);
            },
            error: function () {
            }
          });

        });

        subWin.clientTable([
          ['Server', ta_server3],
          ['ItemCid',cid],
          ['Amount',amount],
          ['Legend_opt_cid',legend],
          ['Remain_effect_Charges',remain],
          [type1,val1],
          [type2,val2],
          [type3,val3],
          [type4,val4],
          [type5,val5],
          [type6,val6],
          [type7,val7],
          [type8,val8],
          [type9,val9],
          ['Duration_Date',dueDate]
          ],{
          head : ['Type', 'Value'],
          width: '100%',
          footer: false,
          pagesize : 20
        }).append(b_ready);
      }

/**
 * mailSend -> 우편발송
 * @returns {undefined}
 */
      function mailSend() {
        rightmenu.win('remove_child');
        var subWindow1 = $E('div').win({
          parent: rightmenu,
          title: 'Send Mail',
          left: 0,
          width: 300,
          height: 650,
          status: false,
          'extends': false,
        });
        var subWindow2 = $E('div').win({
          parent: rightmenu,
          title: 'Send Mail',
          left: 300,
          width: 800,
          height: 650,
          status: false,
          'extends': false,
        });

        var ta_userlist = $E('textarea').validate({required: true, innerMsg: true}).height(380).width('100%').variablesave('BlessPost.ta_userlist');
        var b_ready = $E('button').text('Send').button().css({'margin-left': '10px', 'width': '95%'}).click(fn_ready);
        var usertype = $E('select', {name: 'type'}).selectOptions({'csn':'CSN', 'name':'Name'}, {text: 'name', value: 'type', sort: false}).variablesave('BlessPost.ta_usertype1'),
            ta_subject = $E('textarea').validate({required: true, maxByte: 40, innerMsg: true}).css({'box-sizing': 'border-box', width: '100%', height: 20}).variablesave('BlessPost.ta_subject'),
            ta_msg = $E('textarea').validate({required: true, maxByte: 300, innerMsg: true}).css({'box-sizing': 'border-box', width: '100%', height: 80}).variablesave('BlessPost.ta_msg'),
            moneyText = $E('text').val(0).validate({required: true, onlynumber: true}),
            ta_item = $E('div');

        var idSpan1 = $E('span').text('ITEM_ID  '), valueSpan1 = $E('span').text('  개수  '), standardSpan1 = $E('span').text('  Standard Stats  ');
        var idSpan2 = $E('span').text('ITEM_ID  '), valueSpan2 = $E('span').text('  개수  '), standardSpan2 = $E('span').text('  Standard Stats  ');
        var idSpan3 = $E('span').text('ITEM_ID  '), valueSpan3 = $E('span').text('  개수  '), standardSpan3 = $E('span').text('  Standard Stats  ');
        var idSpan4 = $E('span').text('ITEM_ID  '), valueSpan4 = $E('span').text('  개수  '), standardSpan4 = $E('span').text('  Standard Stats  ');
        var idSpan5 = $E('span').text('ITEM_ID  '), valueSpan5 = $E('span').text('  개수  '), standardSpan5 = $E('span').text('  Standard Stats  ');

        var item1_id = $E('text').val(-1), item1_value = $E('text').val(0).css({width:'110px'}), item1_checkbox = $E('check').attr("checked", true), item1_dbid = $E('text').val(-1);
        var item2_id = $E('text').val(-1), item2_value = $E('text').val(0).css({width:'110px'}), item2_checkbox = $E('check').attr("checked", true), item2_dbid = $E('text').val(-1);
        var item3_id = $E('text').val(-1), item3_value = $E('text').val(0).css({width:'110px'}), item3_checkbox = $E('check').attr("checked", true), item3_dbid = $E('text').val(-1);
        var item4_id = $E('text').val(-1), item4_value = $E('text').val(0).css({width:'110px'}), item4_checkbox = $E('check').attr("checked", true), item4_dbid = $E('text').val(-1);
        var item5_id = $E('text').val(-1), item5_value = $E('text').val(0).css({width:'110px'}), item5_checkbox = $E('check').attr("checked", true), item5_dbid = $E('text').val(-1);

        ta_item.verticalTable([{
            'item1': $E('div').append(idSpan1).append(item1_id).append(valueSpan1).append(item1_value).append(standardSpan1).append(item1_checkbox).append(item1_dbid),
            'item2': $E('div').append(idSpan2).append(item2_id).append(valueSpan2).append(item2_value).append(standardSpan2).append(item2_checkbox).append(item2_dbid),
            'item3': $E('div').append(idSpan3).append(item3_id).append(valueSpan3).append(item3_value).append(standardSpan3).append(item3_checkbox).append(item3_dbid),
            'item4': $E('div').append(idSpan4).append(item4_id).append(valueSpan4).append(item4_value).append(standardSpan4).append(item4_checkbox).append(item4_dbid),
            'item5': $E('div').append(idSpan5).append(item5_id).append(valueSpan5).append(item5_value).append(standardSpan5).append(item5_checkbox).append(item5_dbid),
          }]);

        subWindow1.verticalTable([{'Type':usertype,'Target': ta_userlist}], {width: '100%'});
        subWindow2.verticalTable([{
            'Server': ta_server,
            'Title': ta_subject,
            'Body': ta_msg,
            'Attached Item': ta_item,
            'Attached Gold': moneyText
          }], {width: '100%'}).append('<br/>', b_ready);

        function fn_ready() {
          if (!subWindow2.validate() || !subWindow1.validate())
            return;

          var userlist = ta_userlist.val().trim(),
              subject  = ta_subject.val().trim(),
              msg      = ta_msg.val().trim(),
              money    = moneyText.val().trim(),
              server   = ta_server.val().trim();

          if (!userlist)
            return alert('Error. no target.');
          if (!subject)
            return alert('Error. no title.');
          if (!msg)
            return alert('Error. no body.');

          var split = userlist.split('\n'),
              users = [],
              userCount = 0;


          for (var i in split) {
            var v = split[i].trim();
            if (!v)
              continue;
            if(usertype.val()==='csn' && isNaN(v)){
              alert(v+"Error. csn error");
              continue;
            }
            if(userCount>500){
              alert('Error. Maxsize is 500');
              return;
            }
            users.push(v);
            userCount++;
          }
          if(userCount<1) return alert('Error. No target');

          var itemlist = {
            itemid1: item1_id.val(), value1: item1_value.val(), checkbox1: item1_checkbox[0].checked, dbid1: item1_dbid.val(),
            itemid2: item2_id.val(), value2: item2_value.val(), checkbox2: item2_checkbox[0].checked, dbid2: item2_dbid.val(),
            itemid3: item3_id.val(), value3: item3_value.val(), checkbox3: item3_checkbox[0].checked, dbid3: item3_dbid.val(),
            itemid4: item4_id.val(), value4: item4_value.val(), checkbox4: item4_checkbox[0].checked, dbid4: item4_dbid.val(),
            itemid5: item5_id.val(), value5: item5_value.val(), checkbox5: item5_checkbox[0].checked, dbid5: item5_dbid.val(),
          };

          fn_sendReady(usertype.val(), users, itemlist, subject, msg, Number(money), server);
        }

        function fn_sendReady(usertype, users, itemlist, subject, msg, money, server) {

          debug(itemlist);
          var process = [];
          for (var userIdx in users) {
            process.push({
              userIdx: userIdx,
              usertype: usertype,
              user: users[userIdx],
              itemlist: itemlist,
              subject: subject,
              msg: msg,
              money: money,
              server: server,
            });
          }
          sendProcess(process, {
            data_field: ['usertype', 'user', 'itemlist', 'subject', 'msg', 'money', 'server'],
            methodcall: 'giveItemGamemoney',
            menu: menu,
            title: 'Bless 아이템/게임머니 지급 프로세스',
          });
        }
      }

/**
 * extractUser -> 조건별 대상자 추출
 * @returns {undefined}
 */
      function extractUser() {
        rightmenu.win('remove_child');
        var subWindow1 = $E('div').win({
          parent: rightmenu,
          title: '조건별 대상자 추출',
          left: 0,
          width: 300,
          height: 650,
          status: false,
          'extends': false,
        });

        var realm = $E('select').selectOptions(Desc.realm).val(99),
            race = $E('select').selectOptions(Desc.raceTypeHud).val(99),
            blessClass = $E('select').selectOptions(Desc.classTypeHud).val(99),
            gender = $E('select').selectOptions(Desc.genderTypeHud).val(99),
            minlevel = $E('text').validate({required: true, onlyNumber: true, innerMsg: true}).css({'box-sizing': 'border-box', width: '100%', height: 20}).val(0),
            maxlevel = $E('text').validate({required: true, onlyNumber: true, innerMsg: true}).css({'box-sizing': 'border-box', width: '100%', height: 20}).val(0),
            checkLogout = $E('check').attr("checked", false),
            logoutDate = $E('text').validate({required: true, date: 'Y-m-d'}).css({'text-align': 'right', width: 100});

        var b_extract = $E('button').text('추출').button().css({'width': '100%'}).click(function () {
          if (!subWindow1.validate()) return;
          if (minlevel.val()!=0 && maxlevel.val()!=0 && minlevel.val() > maxlevel.val()){ alert("Minlevel must be lower than Maxlevel"); return; }
          var logoutDatetime = logoutDate.val().substring(0, 4) + '-' + logoutDate.val().substring(4, 6) + '-' + logoutDate.val().substring(6, 8) + ' 00:00:00';

          menu.ajax({
            methodcall: ['selectUser'],
            //$server, $realm, $race, $class, $gender, $minLevel, $maxLevel, $logoutDate
            data: [ta_server2.val(), realm.val(), race.val(), blessClass.val(), gender.val(), minlevel.val(), maxlevel.val(), checkLogout[0].checked, logoutDatetime],
            success: function (r) {
              var targetListWindow = $E('div').win({
                parent: rightmenu,
                title: 'Target List',
                left: 300,
                width: 800,
                height: 650,
                status: false,
                'extends': false,
              });
              targetListWindow.clientTable(r,{
                width: '100%',
                pagesize : 18,
                translate : {
                  gender_type : Desc.genderTypeHud,
                  realm_type : Desc.realm,
                  race_type : Desc.raceTypeHud,
                  class_type : Desc.classTypeHud,
                }
              });
            },
            error: function () {}
          });


        });

        subWindow1.verticalTable([{
          '서버': ta_server2,
          '진영': realm,
          '종족': race,
          '직업': blessClass,
          '성별': gender,
          '레벨최소값 (0:미설정)': minlevel,
          '레벨최대값 (0:미설정)': maxlevel,
          '휴면 체크여부' : checkLogout,
          '휴면기준일': logoutDate,
        }], {width: '100%'}).append('<br/>', b_extract);
      }

      function sendGiftbox() {
        rightmenu.win('remove_child');
        var subWindow1 = $E('div').win({
          parent: rightmenu,
          title: 'Send USNBOX',
          left: 0,
          width: 300,
          height: 650,
          status: false,
          'extends': false,
        });
        var subWindow2 = $E('div').win({
          parent: rightmenu,
          title: 'Send USNBOX',
          left: 300,
          width: 800,
          height: 650,
          status: false,
          'extends': false,
        });

        var itemState = false;

        var usertype = $E('select', {name: 'type'}).selectOptions({'usn':'USN', 'id':'Pmang_ID'}, {text: 'name', value: 'type', sort: false}).variablesave('BlessPost.ta_usertype2'),
            ta_userlist = $E('textarea').validate({required: true, innerMsg: true}).height(380).width('100%').variablesave('BlessPost.ta_userlist3');
        var b_ready = $E('button').text('Send').button().css({'margin-left': '10px', 'width': '95%'}).click(fn_ready);
        var ta_sendtype = $E('select', {name: 'type'}).selectOptions(Desc.PaiduserProviderType, {text: 'name', value: 'type', sort: false}),
            ta_subject = $E('textarea').validate({required: true, maxByte: 40, innerMsg: true}).css({'box-sizing': 'border-box', width: '100%', height: 20}).variablesave('BlessPost.ta_subject3'),
            ta_sender = $E('textarea').validate({required: true, maxByte: 40, innerMsg: true}).css({'box-sizing': 'border-box', width: '100%', height: 20}).variablesave('BlessPost.ta_sender3'),
            ta_expire = $E('text').val(1).validate({required: true, onlynumber: true}).variablesave('BlessPost.ta_expire3'),
            ta_item = $E('text').validate({required: true, onlynumber: true}).change(function(){
              //invalid Itemcid Check
              menu.ajaxAsync('checkItemcid',ta_item.val() ).then(function(r){
                r ? itemState=true : itemState = false;
              });
            });

        subWindow1.verticalTable([{'Type':usertype,'Target': ta_userlist}], {width: '100%'});
        subWindow2.verticalTable([{
            'Title'       : ta_subject,
            'SendType'   : ta_sendtype,
            'Sender' : ta_sender,
            'ExpireTime'   : ta_expire,
            'Reward CID'  : ta_item
          }], {width: '100%'}).append('<br/>', b_ready);

        function fn_ready() {
          if (!subWindow2.validate() || !subWindow1.validate())
            return;
          if(!itemState){
            alert('Invalid Reward.');
            return;
          }

          var userlist = ta_userlist.val().trim(),
              subject  = ta_subject.val().trim(),
              sender   = ta_sender.val().trim(),
              item     = ta_item.val().trim();

          if (!userlist)
            return alert('Error No target.');
          if (!subject)
            return alert('Error. no title');
          if (!sender)
            return alert('Error. No sender.');
          if (!item)
            return alert('Error. No reward.');

          var split = userlist.split('\n'),
              users = [],
              userCount = 0;

          for (var i in split) {
            var v = split[i].trim();
            if (!v)
              continue;
            if(usertype.val()==='usn' && isNaN(v)){
              alert(v+" Error. invalid usn");
              continue;
            }
            if(userCount>500){
              alert('Error. Maxsize is 500');
              return;
            }
            users.push(v);
            userCount++;
          }
          if(userCount<1) return alert('Error. No target');

          fn_sendReady(usertype.val(), users, subject, ta_sendtype.val(), sender, ta_expire.val(), item);
        }

        function fn_sendReady(usertype, users, subject, sendtype, sender, expire, item) {

          var process = [];
          for (var userIdx in users) {
            process.push({
              userIdx   : userIdx,
              usertype  : usertype,
              user      : users[userIdx],
              subject   : subject,
              sendtype  : sendtype,
              sender    : sender,
              expire    : expire,
              item      : item
            });
          }
          sendProcess(process, {
            data_field: ['usertype', 'user', 'subject', 'sendtype', 'sender', 'expire', 'item'],
            methodcall: 'sendGiftbox',
            menu: menu,
            title: 'Bless 아이템/게임머니 지급 프로세스',
          });
        }
      }

    };

  });

})(jQuery, this, this.document);

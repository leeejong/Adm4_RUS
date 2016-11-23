/**
 * BlessGameDataModifyMemo
 * ADM 4.0 JavaScript Menu
 * @author sungje@neowiz.com 2015.03.17
 * @package
 * @subpackage
 * @encoding UTF-8
 */

// http://glat.info/jscheck/
/*global $, jQuery, $adm, $E, confirm, console, alert, JSON, HTMLInputElement define */

// 명료한 Javascript 문법을 사용 한다.
"use strict";

(function($, window, document){

/**
 * AMD(Asynchronous Module Definition)
 */
define(['beans/Bless/BlessGameData','beans/Bless/BlessDesc'], function(GameData, DESC){

  /**
   * BlessGameDataViewer Menu
   * @param {mixed} arg1
   * @param {mixed} arg2
   */
  return function BlessGameDataModifyMemo( arg1, arg2 ){

    var menu = this;

    // 검색 항목 선언부
    var s_serverList = $E('select', {name:'server_id'});
    menu.ajaxAsync('getServerInfo').then(function( serverList ){
      s_serverList.selectOptions( serverList, {text:'name', value:'server_id', sort: false} );
    });

    // 로그 조회용 날짜 선택폼
    var i_sdate = $E('text',{name:'sdate', nosave:true}).validate({required:true, date:'-4d'}),
        i_edate = $E('text',{name:'edate', nosave:true}).validate({required:true, date:'0d'});
    var i_regMsn = $E('text',{name:'regmsn', nosave:true}),
        i_approveMsn = $E('text',{name:'approvemsn', nosave:true});

    var b_search     = $E('button').text('Search');
    var d_contents   = $E('div');

    // 검색결과
    function fnSearchResult(searchType) {

      var fields, sortAsc;
      if (searchType == 1) {  // 미처리 메모일 경우
        fields = ['reg_date','msn','server_id','usn','csn','character_name','edit_db','modify_code_name','extra_id','before_data','edit_data','edit_memo','reference_url','b_approve','b_reject'];
        sortAsc = true;
      } else {  // 처리된 메모일 경우
        fields = ['reg_date','msn','server_id','usn','csn','character_name','edit_db','modify_code_name','extra_id','before_data','edit_data','edit_memo','reference_url','approve_msn','approve_date'];
        sortAsc = false;
      }

      //console.log(s_serverList.val());
      //if (s_serverList.val() == '') return;

      menu.ajaxAsync('getGameDataModifyList', searchType, s_serverList.val(),i_sdate.val(), i_edate.val(), i_regMsn.val(), i_approveMsn.val())
          .then(function( resultList ){
            console.log('getGameDataModifyList....');
            console.log(resultList);
            d_contents.empty().clientTable( resultList, {
              pagesize: 20,
              field: fields,
              head: DESC.DBGameDataModifyLogInfo,
              sort:true,
              sort_field: 'reg_date',
              sort_asc: [sortAsc],
              translate: { reg_date:'Y-m-d H:i:s', approve_date:'Y-m-d H:i:s' },
              translate_realtime: {
                msn: function(v, cname, row){
                  return v + ' (' + row.msn_id + ' / ' + row.msn_name + ')';
                },
                approve_msn: function(v, cname, row){
                  return v + ' (' + row.approve_msn_id + ' / ' + row.approve_msn_name + ')';
                },
                character_name: function( v, cname, row ){
                  if (row.csn == '' || row.csn == 0) return '';
                  return GameData.parseLinkName('<blessUserLink:'+row.server_id+'|character|'+row.csn+'>');
                },
                edit_db: function(v, cname, row){
                  return row.edit_db;
                },
                b_approve: function(v, cname, row){
                  return $E('button').text('Accept').button().click(function(){

                    var modifyResult = GameData.confirmModifyGameDataItem(menu, row.log_seq);

                    if (modifyResult == true) {
                      fnSearchResult(1);
                    } else if (modifyResult == false) {
                      alert('Error. Failed.');
                    } else {  // 에러메세지 표시
                      alert(modifyResult);
                    }
                  });
                },
                b_reject: function(v, cname, row){
                  return $E('button').text('Reject').button().click(function(){

                   var sub_regist    = $E('div'),
                        bottom        = $E('div').css({'text-align':'center'}),
                        t_memo         = $E('textarea').css({width:200,height:70}).css("background","#E1E1E1"),
                        b_close        = $E('button').text('Close').button().click(function(){ sub_regist.dialog('close'); }),
                        b_regist       = $E('button').text('Reject').button().click(function(){
                          var rejectModifyResult = GameData.rejectModifyGameDataItem(menu, row.log_seq, t_memo.val());
                          if (rejectModifyResult == true) {
                            sub_regist.dialog('close');
                            fnSearchResult(1);
                          } else if (rejectModifyResult == false) {
                            alert('Error. Failed.');
                          } else {  // 에러메세지 표시
                            alert(rejectModifyResult);
                          }
                        });

                    bottom.append(b_regist, b_close);
                    sub_regist.verticalTable([[ t_memo ]], {head: [ 'Reject Reason' ] });
                    sub_regist.append(bottom)
                      .dialog({title: 'Reject'});

                  });
                },
                extra_id:function(v, cname, row){
                  if (v == 0) return '';
                  if (row.edit_table_name == 'DBQuest') {
                    if (row.extra_cid != null) return GameData.parseLinkName('<questid:'+row.extra_cid+'>');
                    else return v;
                  } else if (row.edit_table_name == 'DBMonsterBook') {
                    if (row.extra_cid != null) return GameData.parseLinkName('<monsterBookID:'+row.extra_cid+'>');
                    else return v;
                  //} else if (row.edit_table_name == 'DBItem') {
                  //  return GameData.parseLinkName('<item_uid:'+row.server_id+'|'+v+'>');
                  } else {
                    return v;
                  }
                },
                edit_memo:function(v, cname, row){
                  return ($adm.bytes(v) >= 50) ? $E('label',{tooltip:v}).text(v.substr(0,50) + '...').tooltip() : v;
                },
                reference_url: function(v, cname, row){
                  if (v != '' && v != null) {
                    if (v.indexOf('http://') > -1 || v.indexOf('https://') > -1) {
                      return $E('button',{tooltip:v}).text('Link').button().click(function(){ window.open(v); }).tooltip();
                    } else {
                      return $E('button',{tooltip:v}).text('File').button().click(function(){
                        prompt("Press Ctrl+C to Copy.", v );
                      }).tooltip();
                    }
                  } else {
                    return v;
                  }
                }
              },
              /*translate_realtime: {
                skill_list: function(v){
                  return GameData.parseLinkName( GameData.getDataTagSplit('skillName',v, ' ') );
                },
                npc_id: function(v, cname, row){

                  return GameData.getDetailLink('NPC', v, 'npc_id', v);

                }
              },*/
              //width: '100%',
              filter_view: true
            } );
      });
    }

    menu.buttonTab([

      {
        name: 'Remain Memos',
        select: function( tab ){

          b_search = $E('button').text('Search').button().click( function() {fnSearchResult(1)} );
          tab.empty()
            .clientTable([[s_serverList, b_search]], {head: ['Server',' '], sort:true, footer:false })
            .append(d_contents.empty());

          console.log(s_serverList.val());
          if (s_serverList.val() != null) fnSearchResult(1);  // 디폴트 값 검색
        }
      },

      {
        name: 'Completed Memos',
        select: function( tab ){

          b_search = $E('button').text('Search').button().click( function() {fnSearchResult(2)} );

          tab.empty()
            .clientTable(
              [[s_serverList, $adm.joinElements( i_sdate, '<span>~</span>', i_edate ), i_regMsn, i_approveMsn, b_search]]
                , {head: ['Server', 'Date', 'Request MSN', 'Accpet MSN', ' ']
                , sort:true, footer:false }
            )
            .append(d_contents.empty());

          fnSearchResult(2);  // 디폴트 값 검색
        }
      }
    ],{active:0});
  };
});

})(jQuery, this, this.document);
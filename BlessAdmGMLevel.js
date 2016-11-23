/**
 * BlessAdmGMLevel
 * ADM 4.0 JavaScript Menu
 * @author sungje@neowiz.com 2015.03.13
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
define(['beans/Bless/BlessDesc','beans/Bless/BlessGameData'], function( DESC, GameData ){

  /**
   * BlessAdmGMLevel Menu
   * @param {mixed} arg1
   * @param {mixed} arg2
   */
  return function BlessAdmGMLevel( arg1, arg2 ){

    var menu = this;
    var adminGmlevel = GameData.getAdminGMLevel(menu);

    var $wSearch = $E('div').win({
        title         : '어드민툴 계정 검색',
        parent        : menu,
        top           : 0,
        left          : 0,
        width         : 450,
        height        : 120,
        buttonpane    : false,
        close         : false,
        screen_toggle : false,
        minimum       : false,
        resizable     : false,
        draggable     : false,
        'extends'     : false
      });

    var $sSearchType = $E('select').selectOptions({msn:'MSN', admid:'ID', admname:'이름'}),
        $tKeyword    = $E('text').validate($sSearchType, {msn:{required:true, onlynumber:true},
                                                          admid:{required:true, userid:true}, admname:{required:true}}
                                          ).enterKey( fnSearchAdmin ),
        $bSearch     = $E('button').text('검색').button().click( fnSearchAdmin );

    $wSearch
      .clientTable([[$sSearchType, $tKeyword, $bSearch]], {head: ['검색조건','검색어',' '], sort:false, footer:false, width:'100%'})
      .variablesave('BlessAdmGMLevel.$wSearch');

    var $wGroup = $E('div').win({
      title         : 'GM 등급별 어드민툴 계정 리스트',
      parent        : menu,
      top           : 0,
      left          : 460,
      width         : 400,
      height        : 120,
      buttonpane    : false,
      close         : false,
      screen_toggle : false,
      minimum       : false,
      resizable     : false,
      draggable     : false,
      'extends'     : false
    });

    $wGroup.append(
      $E('button').css({width:90, height:40}).text('GM1').data('gm_level', 1),
      $E('button').css({width:90, height:40}).text('GM2').data('gm_level', 2),
      $E('button').css({width:90, height:40}).text('GM3').data('gm_level', 3),
      $E('button').css({width:90, height:40}).text('GM4').data('gm_level', 4)
    ).delegate('BUTTON', 'click', function(){

      var level = $(this).data('gm_level');
      fnGetAdminList.call(this, level);

    }).children().button().css({
      height: 70
    });

    /**
     * Admin 계정 검색 시작
     * @param {Number|event} searchMsn 숫자가 들어오는 경우 MSN 이라고 보고 검색
     */
    function fnSearchAdmin( searchMsn ){

      var keyword, searchtype;

      if( $.isNumeric(searchMsn) ){
        keyword    = searchMsn;
        searchtype = 'msn';
      }
      else if( $wSearch.validate() ){
        if ($sSearchType.val() != 'msn' && $tKeyword.val().length < 2)
          return alert('2글자 이상 입력해 주세요.');

        keyword    = $tKeyword.val();
        searchtype = $sSearchType.val();
      }
      else
        return;
        fnSearchAdminTable( searchtype, keyword );
    }

    function fnMakeAdminListCreateTable($wAdminList, list) {

      $wAdminList.clientTable( list, {
        width: '100%',
        field: ['msn','gm_level','reg_date', 'id', 'name', 'teamname' ,'reg_msn'],
        head: DESC.DBGMLevelInfo,
        translate: {
            reg_date: 'Y-m-d H:i:s'
        },
        translate_realtime: {
          reg_msn: function(v, cname, row){
            if (v == null) return '';
            return v + '(' + row.reg_name + ', ' + row.reg_id + ')';
          }
        },
        cell_modify : [ 'gm_level' ],

        cell_modify_after : function( bef, aft, cname, row ){

          if (aft == '') return alert('수정할 GM등급값을 입력해 주세요');

          if (adminGmlevel == 1) {
            if (!confirm('GM등급을 ' + row.gm_level + ' -> ' + aft + '로 변경하시겠습니까?')) return;
            return menu.ajaxAsync( 'setGMLevel', row.msn, aft );
          } else {
            alert('수정 권한이 없습니다.');
            return;
          }
        }
      });
    }

    /**
     * 검색결과 어드민계정 테이블 윈도우 생성
     * 사용자 정보를 조회 / 수정 할 수 있다.
     * @param {Number} msn
     */
    function fnSearchAdminTable( searchtype, keyword ){

      menu.ajax({
        methodcall: 'getAdminMemberInfo',
        data: [searchtype, keyword],
        success: fnMakeAdminMemberList
      });

      function fnMakeAdminMemberList( list ){

        var $wAdminList = $E('div').win({
          title         : '어드민툴 계정 조회 (검색어 :' + keyword + ')',
          parent        : menu,
          top           : 130,
          left          : 0,
          width         : 900,
          height        : 'auto',
          buttonpane    : false
        });

        fnMakeAdminListCreateTable($wAdminList, list);
      }
    }

    /**
     * 등급별 사용자 리스트 조회
     * @param {Number} level 조회 등급
     */
    function fnGetAdminList( level ){

      var btn = $(this);

      menu.ajax({
        methodcall: 'getAdminList',
        data: [level],
        success: fnMakeAdminList
      });

      function fnMakeAdminList( list ){

        var $wAdminList = $E('div').win({
          title         : 'GM' + level + ' 등급 :: 어드민 리스트',
          parent        : menu,
          top           : 130,
          left          : 0,
          width         : 800,
          height        : 'auto',
          buttonpane    : false,
          position      : {
            my: 'left top',
            at: 'left bottom+5',
            of: btn
          }
        });

        fnMakeAdminListCreateTable($wAdminList, list);
      }
    }
  };
});

})(jQuery, this, this.document);
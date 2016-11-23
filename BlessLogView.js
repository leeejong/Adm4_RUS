/**
 * BlessLogView
 * ADM 4.0 JavaScript Menu
 * @author bitofsky@neowiz.com 2014.02.07
 * @modified leeejong@neowiz.com 2015.12.22
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
define(['beans/Bless/BlessDesc', 'beans/Bless/BlessGameData'], function( DESC, GameData ){

  /**
   * BlessLogView Menu
   * @param {mixed} arg1
   * @param {mixed} arg2
   */
  return function BlessLogView( arg1, arg2 ){

    var defArgs = arg1 ? JSON.parse( arg1 ) : null;

    if( defArgs ){
      setTimeout(function(){
        $.each(defArgs, function( name, value ){
          var $obj = $forms[name] || eval('$'+name);
          if( $obj ) $obj.val(value);
        });
        fnSearch(1);
      }, 1000);
    }

    var menu = this;


    /***********************************************************************************
     * Search options
     **********************************************************************************/
    var $w_search = $E('div').win({
      title         : 'Search options',
      parent        : menu,
      top           : 0,
      left          : 260,
      width         : 1130,
      height        : 185,
      buttonpane    : false,
      close         : false,
      screen_toggle : false,
      minimum       : false,
      resizable     : false,
      draggable     : false,
      'extends'     : false
    });

    var $w_tools = $E('div').win({
      title         : 'Tools',
      parent        : menu,
      top           : 0,
      left          : 1390,
      width         : 270,
      height        : 185,
      buttonpane    : false,
      close         : false,
      screen_toggle : false,
      minimum       : false,
      resizable     : false,
      draggable     : false,
      'extends'     : false
    });

    //추가기능 설정
    var pmangid  = $E('text').val('PmangID'),
        charsvr  = $E('text').val('Server'),
        charname = $E('text').val('CharName');

    $w_tools.append($E('span').text('PmangID -> USN')).append('<br>');
    $w_tools.append(pmangid);
    $w_tools.append($E('button').css({width:'62px'}).text('Search').button().click(function(){
      $w_tools.ajaxAsync('getUSN', pmangid.val()).then(function( usn ){
        $w_tools.append($E('span').text(usn)).append('<br>');
      });
    })).append('<br>');

    $w_tools.append($E('span').text('Charname -> CSN')).append('<br>');
    $w_tools.append(charsvr).append('<br>');
    $w_tools.append(charname);
    $w_tools.append($E('button').css({width:'62px'}).text('Search').button().click(function(){
      $w_tools.ajaxAsync('getCSN', charsvr.val(), charname.val()).then(function( csn ){
        $w_tools.append($E('span').text(csn)).append('<br>');
      });
    })).append('<br>');

    var d = new Date(),
        hh = ""+d.getHours(),
        ii = ""+d.getMinutes(),
        ss = ""+d.getSeconds();
    if(hh.length==1){hh = "0"+hh}
    if(ii.length==1){ii = "0"+ii}
    if(ss.length==1){ss = "0"+ss}

    var his = hh+ii+ss;

    var $forms = {
          world_id: $E('text', {size:2}).validate({required:true}),
          account_uid: $E('text', {size:9}),
          character_uid: $E('text', {size:12}).val(0),
          party_uid: $E('text', {size:8}).validate({onlynumber:true}),
          guild_uid: $E('text', {size:8}).validate({onlynumber:true}),
          item_uid: $E('text', {size:8}).validate({onlynumber:true}),
          npc_uid: $E('text', {size:8}).validate({onlynumber:true}),
          level: $E('text', {size:2}).validate({onlynumber:true}),
          race_type: $E('text', {size:2}).validate({onlynumber:true}),
          class_type: $E('text', {size:2}).validate({onlynumber:true}),
          gender_type: $E('text', {size:2}).validate({onlynumber:true}),
          position: $E('text', {size:6}),
          data_0: $E('text', {size:9}),
          data_1: $E('text', {size:9}),
          data_2: $E('text', {size:9}),
          data_3: $E('text', {size:9}),
          data_4: $E('text', {size:9}),
          data_5: $E('text', {size:9})
        },
        $sdate   = $E('text',{name:'sdate', nosave:true}).validate({required:true, date:'-1 days'}).css({width:'68px'}),
        $stime   = $E('text',{name:'stime', nosave:true}).validate({required:true, time:his}).css({width:'58px'}),
        $edate   = $E('text',{name:'edate', nosave:true}).validate({required:true, date:'+0 days'}).css({width:'68px'}),
        $etime   = $E('text',{name:'etime', nosave:true}).validate({required:true, time:his}).css({width:'58px'}),
        $searchV1  = $E('button').text('SearchV1').button().click( function(){fnSearch(1);} ),
        $searchV2 = $E('button').text('SearchV2').button().click( function(){fnSearch(0);} );

    $w_search
      .layout(
        'table',
        ['Range', 'World','level', 'race', 'class', 'gender', 'Account', 'Character', 'SearchV1', 'V2'],
        [$adm.joinElements($sdate, $stime, '<span> ~ </span>',  $edate, $etime), $forms.world_id,$forms.level, $forms.race_type, $forms.class_type, $forms.gender_type, $forms.account_uid, $forms.character_uid, $searchV1, $searchV2]
      );

    $w_search
      .layout(
        'table',
        ['data_0', 'data_1', 'data_2', 'data_3', 'data_4', 'data_5', 'party_uid','guild_uid','item_uid','npc_uid', 'position'],
        [$forms.data_0, $forms.data_1, $forms.data_2, $forms.data_3, $forms.data_4, $forms.data_5,$forms.party_uid, $forms.guild_uid, $forms.item_uid, $forms.npc_uid, $forms.position]
      );

    $w_search.variablesave('BlessLogView.search');

    /**
     * 로그 조회 시작
     * 각 로그 타입별로 리퀘스트를 분리 한다.
     */
    function fnSearch( type ){

      var actionList = $action.val() || [];

      if( !$w_search.validate() ) return;
      if( !actionList.length ) return alert('Error - action');

      var starttime = $sdate.val() + $stime.val(),
          endtime   = $edate.val() + $etime.val(),
          forms     = {};

      $.each($forms, function( n, $this ){

        if( !$this.val().trim() ) return;

        forms[n] = +$this.val() || $this.val().trim();

      });

      // 액션별로 리퀘스트를 보관
      var promises = [];

      actionList.forEach(function( action ){
        // 리퀘스트 실행
        promises.push( fnSearchAction( action, starttime, endtime, forms ) );
      });

      // 모든 리퀘스트가 성공하면..
      $.when.apply(null, promises).then(function(){

        if(type===1){
          fnResultForDownload( starttime, endtime, forms, Array.prototype.concat.apply([], arguments) );
        }
        else{
          fnResult( starttime, endtime, forms, Array.prototype.concat.apply([], arguments) );
        }

      }, function( err ){
        alert(err);
      });

    }


    /**
     * fnResultForDownload 기존 검색기능을 다운로드 전용으로 명명한다.
     * @param {type} starttime
     * @param {type} endtime
     * @param {type} forms
     * @param {type} result
     * @returns {undefined}
     */
    function fnResultForDownload( starttime, endtime, forms, result ){
      var title = $adm.sprintf('Result :: %s ~ %s', starttime, endtime);

      var $w_result = $E('div').win({
        title: title,
        parent: menu,
        top: 190,
        left: 260,
        width: 1400,
        height: 535,
        buttonpane: false,
        close: true,
        screen_toggle: true,
        minimum: true,
        resizable: true,
        draggable: true,
        'extends': true
      });

      $w_result.clientTable( result , {

        width       : '100%',
        height      : '100%',
        field       : ['log_time', 'log_type', 'world_id', 'account_uid', 'pmang_id', 'character_uid', 'character_name', 'data_0', 'data_1', 'data_2', 'data_3', 'data_4', 'data_5', 'detail_data','*', 'description'],
        head        : DESC.DBLog,
        sort_field  : ['log_time', 'log_type'],
        sort_asc    : [true, false],
        filter_view : true,
        pagesize    : 12,
        translate   : DESC.DBLog_TYPES,
        translate_realtime: {
          pmang_id: function( v, cname, log ){
            if (log.account_uid == '' || log.account_uid == 0) return '';
            return fnParseDataLink('<blessUserLink:'+log.world_id+'|account|'+log.account_uid+'>');
          },
          character_name: function( v, cname, log ){
            if (log.character_uid == '' || log.character_uid == 0) return '';
            return fnParseDataLink('<blessUserLink:'+log.world_id+'|character|'+log.character_uid+'>');
          },
          position: function( v, cname, log ){
            if (v == null || v == 0) return '';
            var matches = v.match(/[-\d]{1,}/g);
            if( matches.length != 9 ) return v;
            var mapType    = {0:'F', 1:'D', 2:'I'}[matches[0]] || matches[0],
                mapId      = matches[1],
                instantId  = matches[2],
                x          = matches[3]+'.'+matches[4],
                y          = matches[5]+'.'+matches[6],
                z          = matches[7]+'.'+matches[8],
                tagMap     = ':<worldmap_id:'+mapId + '>',
                tagInstant = '';
            switch( true ){
              case mapType == 'I' : // 인스턴트필드인 경우
                tagInstant = ':<instant_field_id:' + instantId + '>'; break;
              case mapType == 'D' : // 던전인 경우
                tagInstant = ':<dungeon_id:' + instantId + '>'; break;
            }
            var tag = mapType + tagMap + tagInstant+', ',
                xyz = 'x: '+x + '\ny: '+y + '\nz: '+z;
            return $adm.joinElements( fnParseDataLink( tag ), $E('A', {title: xyz, href:'#'}).text('POS'));
          },
          description: function( v, cname, log ){
            return log.log_type, DESC.DBLog_log_type_description[log.log_type]
          }
        }
      });

    }

    /**
     * 로그 조회 결과 디스플레이
     * @param Array result
     */
    function fnResult( starttime, endtime, forms, result ){

      var title = $adm.sprintf('Result :: %s ~ %s', starttime, endtime);

      var $w_result = $E('div').win({
        title: title,
        parent: menu,
        top: 190,
        left: 260,
        width: 1400,
        height: 535,
        fullscreen : true,
        buttonpane: false,
        close: true,
        screen_toggle: true,
        minimum: true,
        resizable: true,
        draggable: true,
        'extends': true
      });

      $w_result.clientTable( result , {
        width       : '100%',
        field       : ['log_time', 'log_type', 'world_id', 'account_uid', 'pmang_id', 'character_uid', 'character_name', 'data_0', 'data_1', 'data_2', 'data_3', 'data_4', 'data_5', 'detail_data', 'item_uid', 'description'],
        head        : DESC.DBLog,
        sort_field  : ['log_time', 'log_type'],
        sort_asc    : [true, false],
        filter_view : true,
        pagesize    : 20,
        translate   : DESC.DBLog_TYPES,
        translate_realtime: {
          pmang_id: function( v, cname, log ){
            if (log.account_uid == '' || log.account_uid == 0) return '';
            return fnParseDataLink('<blessUserLink:'+log.world_id+'|account|'+log.account_uid+'>');
          },
          character_name: function( v, cname, log ){
            if (log.character_uid == '' || log.character_uid == 0) return '';
            return fnParseDataLink('<blessUserLink:'+log.world_id+'|character|'+log.character_uid+'>');
          },
          position: function( v, cname, log ){
            if (v == null || v == 0) return '';
            var matches = v.match(/[-\d]{1,}/g);
            if( matches.length != 9 ) return v;
            var mapType    = {0:'F', 1:'D', 2:'I'}[matches[0]] || matches[0],
                mapId      = matches[1],
                instantId  = matches[2],
                x          = matches[3]+'.'+matches[4],
                y          = matches[5]+'.'+matches[6],
                z          = matches[7]+'.'+matches[8],
                tagMap     = ':<worldmap_id:'+mapId + '>',
                tagInstant = '';
            switch( true ){
              case mapType == 'I' : // 인스턴트필드인 경우
                tagInstant = ':<instant_field_id:' + instantId + '>'; break;
              case mapType == 'D' : // 던전인 경우
                tagInstant = ':<dungeon_id:' + instantId + '>'; break;
            }
            var tag = mapType + tagMap + tagInstant+', ',
                xyz = 'x: '+x + '\ny: '+y + '\nz: '+z;
            return $adm.joinElements( fnParseDataLink( tag ), $E('A', {title: xyz, href:'#'}).text('POS'));
          },
          description: function( v, cname, log ){
            return $E('button').button().css({'width':'20','height':20}).text('+').click(function(){
              var descDialog = menu.dialog();
              descDialog.empty();
              descDialog.verticalTable([[ log.log_type, DESC.DBLog_log_type_description[log.log_type]  ]], {head:['Type','Desc']});
            });
          },
          data_0 : function(v, cname, log){
            var logtype_item_needed = [20051,30000,30001,30002,32000,32001,32002,33001,33004,34000,34001,34002,34100,34101,34200,34202,34300,34301,37000,38000];
            if( $adm.inArray( parseInt(log.log_type), logtype_item_needed) > -1 ){
              return GameData.parseLinkName('<item_id:'+v+'>');
            }
            else{

              return v;
            }
          },
          data_1 : function(v, cname, log){
            var logtype_item_needed = [21203];
            if( $adm.inArray( parseInt(log.log_type), logtype_item_needed) > -1 ){
              return GameData.parseLinkName('<item_id:'+v+'>');
            }
            else{
              return v;
            }
          },
          data_2 : function(v, cname, log){
            var logtype_item_needed = [36000,36001,36030,36031,36050,36051,36100,36101];
            if( $adm.inArray( parseInt(log.log_type), logtype_item_needed) > -1 ){
              return DESC.DBLog_log_type_TYPES[ parseInt(log.log_type) ]['data_2'][ parseInt(v) ];
            }
            else{
              return v;
            }
          },
          data_3 : function(v, cname, log){
            var logtype_item_needed = [34000,34001];
            if( $adm.inArray( parseInt(log.log_type), logtype_item_needed) > -1 ){
              return DESC.DBLog_log_type_TYPES[ parseInt(log.log_type) ]['data_3'][ parseInt(v) ];
            }
            else{
              return v;
            }
          },
          data_4 : function(v, cname, log){
            var logtype_item_needed = [36300,36301];
            if( $adm.inArray( parseInt(log.log_type), logtype_item_needed) > -1 ){
              return DESC.DBLog_log_type_TYPES[ parseInt(log.log_type) ]['data_4'][ parseInt(v) ];
            }
            else{
              return v;
            }
          }
        }
      });

    }

    function fnParseDataLink( text ){
      return typeof text == 'string' ? GameData.parseLinkName(text) : '';
    }

    /**
     * 로그 리퀘스트
     */
    function fnSearchAction( action,starttime, endtime, forms ){

      return $w_search.ajax({
        methodcall: 'getLogData',
        data: [action, starttime, endtime, forms],
        processError: function(){ return false; } // 에러메세지 무시
      }).then(function( logList ){
        logList.forEach(function( log ){});
        return logList;
      });

    }

    /***********************************************************************************
     * Action list
     **********************************************************************************/
    var $w_action = $E('div').win({
      title         : 'Action list',
      parent        : menu,
      top           : 0,
      left          : 0,
      width         : 250,
      height        : 730,
      buttonpane    : false,
      close         : false,
      screen_toggle : false,
      minimum       : false,
      resizable     : false,
      draggable     : false,
      'extends'     : false
    });

    var $action = $E('select',{multiple:true}).css({width:'100%', height:630}),
        $preset = $E('select', {nosave:true}).css({width:150, height:50}).on('click mousedown', changePreset ),
        $save   = $E('button').css({width:40, height:40}).button({text:false, icons:{primary:'ui-icon-disk'}}).click( addPreset ),
        $delete = $E('button').css({width:40, height:40}).button({text:false, icons:{primary:'ui-icon-trash'}}).click( delPreset );

    $w_action.append( $preset, $save, $delete, $action ).variablesave('BlessLogView.action');

    reloadPreset();
    getLogtype();

    /**
     * Add Preset
     */
    function addPreset(){

      var actions = $action.val();

      if( !actions.length ) return alert('Error - action');

      var $name = $E('text').validate({required:true, maxBytes:200}).val( $preset.children('[value!=""]:selected').text() || '' ).enterKey(function(){
            if( !$popup.validate() ) return;
            $w_action.ajaxAsync('addPreset', $name.val(), actions.join(',')).then(function(){ $popup.dialog('close'); }).then( reloadPreset );
          }),
          $popup = $adm.getCommonDialog().append( $name ).dialog({
            title: 'Add Preset',
            stick: {right: this}
          });

    }

    /**
     * Del Preset
     */
    function delPreset(){

      var name = $preset.children(':selected').text();

      if( !$preset.val() || !confirm('Delete Preset : '+name)) return;

      $w_action.ajaxAsync('delPreset', name).then( reloadPreset );

    }

    /**
     * Change Preset
     */
    function changePreset( event ){

      // ctrlKey / shiftKey 는 change 에서 확인이 안되어서 부득이 click 으로 감지를 위해 꼼수 처리 한다.
      // mousedown != onclick 값이 다르면 change가 발생했다는 의미가 된다.
      if( event.type == 'mousedown' ){
        $preset.data('old', $preset.val());
        return;
      }
      else if( $preset.data('old') == $preset.val() )
        return;

      var actions = $preset.val().split(',');

      if( !actions.length ) return;

      if( event.ctrlKey || event.shiftKey )
        actions = actions.concat( $action.val() );

      $action.val( actions );

    }

    /**
     * Reload Preset
     * @returns {Promise}
     */
    function reloadPreset(){

      return $w_action.ajaxAsync('getPreset', function( list ){
        $preset.selectOptions( list, {text:'name', value:'actions', 'default':[{text:'-- Preset --', value:''}]} );
      });

    }

    function getLogtype(){
      $w_action.ajaxAsync('getLogtype', function( logtype ){
        DESC.DBLog_TYPES.log_type = logtype;
        $action.selectOptions(logtype, {sort:false});
      });
    }

    // 각 Type에 맞는 UID문자열을 받아옴
    function getPointTargetUidString(server_id, type, target_uid) {
      var result = '';
      switch( type ){
        case 2 : result = ' ◁ <questid:'+target_uid+'>'; break; // 퀘스트
        case 5 : result = ' ◁ <item_id:'+target_uid+'>'; break; // 아이템
        case 1 : case 4 : case 7 :
          result = ' ◁ <blessUserLink:'+server_id+'|character|'+target_uid+'>'; break; // 거래등
        case 0 : case 6 :
          result = ' ◁ <npcid:'+target_uid+'>'; break; // NPC 사냥
        case 3 : result = ' ◁ <monsterbookid:'+target_uid+'>'; break; // 몬스터북
        default : result = ' ◁ target_uid:'+target_uid; break; // 기타
      }
      return result;
    }
  };

});

})(jQuery, this, this.document);
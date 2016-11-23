/**
 * BlessGameData
 * ADM 4.0 JavaScript Menu
 * @author bitofsky@neowiz.com 2013.06.05
 * @package
 * @subpackage
 * @encoding UTF-8
 */

// http://glat.info/jscheck/
/*global $, jQuery, $adm, $E, confirm, console, alert, JSON, HTMLInputElement define */

// 명료한 Javascript 문법을 사용 한다.
"use strict";

(function($, window, document){

var requireModules = ['beans/Bless/BlessDesc'];

var GameDataCategory = [
  'Item',
  'NPC',
  'Quest',
  'Prop',
  'Dialog',
  'ItemDropTable',
  'PCSkill',
  'MonsterBook',
  'WorldMap',
  'InstantDungeon',
  'InstantField',
  'VoluntaryAction',
  'AbnormalStatus',
  'Mount',
  'DesinationPointReference',
  'DestinationPointReference',
  'Fellow',
  'Pet'
];

/**
 * AMD(Asynchronous Module Definition)
 */
define( requireModules.concat( GameDataCategory.map(function(cat){ return 'beans/Bless/BlessGameData/BlessGameData.'+cat; }) ), function( Desc ){

  /**
   * GameData Utility Object
   */
  var GameData = {
    debug : true
  };

  /**
   * XML File Read
   * @return {Promise} XMLDocument
   */
  GameData.getGameXml = function(filename){

    return $adm.promiseCache('BL.getGameXml:'+filename, function(){

      var path = 'http://adm.dev.nwz.kr/beans/Bless/BlessGameData.xml.php';
      return $.ajax({
        url: path,
        data: {filename:filename},
        dataType: 'text'
      }).then(function( xmlText ){

        // 네임스페이스 제거. IE와 크롬은 네임스페이스 처리법이 달라 어쩔 수 없다.
        return $(
          $.parseXML(
            xmlText.replace(/bl:/g,'')
          )
        );

      });

    });

  };

  /**
   * Search XML Nodes
   * @param {String} filename File name
   * @param {String} nodename Node name
   * @param {String} attr Attribute name
   * @param {String} keyword Find keyword
   * @param {String} oper
   * @return {Promise} Array Nodes
   */
  GameData.getGameData = function(filename, nodename, attr, keyword, oper){

    oper = oper || '=';

    var query = attr ? nodename+'['+attr+oper+'"'+keyword+'"]' : nodename;

    debug("QUERY IS "+query);

    return GameData.getGameDataQuery(filename, query);

  };

  /**
   * 직접 쿼리 입력하여 XML 검색
   * @param {String} filename
   * @param {String} query
   * @return {Promise} Array Nodes
   */
  GameData.getGameDataQuery = function(filename, query){
    var ret = [];

    return GameData.getGameXml(filename).then(function($xml){
      if( GameData.debug )
        console.debug(query);

      $xml.find(query).each(function(i, node){
        ret.push( GameData.getAttributes(node) );
      });
      return ret;

    });

  };

  /**
   * XML 노드로부터 속성정보 추출
   * .node 로 해당 노드가 포함 된다.
   * @param {xmlNode} node
   * @return {Object}
   */
  GameData.getAttributes = function( node ){

    if( !node ) return;

    var attrs = {
          node: node
        },
        isset = false,
        $node = $(node);

    $(node.attributes).each(function(i, attrName){

      isset = true;

      attrs[attrName.nodeName.toLowerCase()] = $node.attr(attrName.nodeName);

    });

    if( attrs.item_id && attrs.equip_category ){
      var cat = attrs.equip_category.split('_');
      attrs.equip_cat1 = cat[0];
      attrs.equip_cat2 = cat[1];
      attrs.equip_cat3 = cat[2];
    }
    else if( attrs.skill_id && attrs.mobilitytype ){
      var mov = attrs.mobilitytype.split('_');
      attrs.move_cast   = mov[1] == 'able';
      attrs.move_firing = mov[3] == 'able';
      attrs = $.extend({}, GameData.getAttributes(node.getElementsByTagName('skillInfo')[0])||{}, attrs);
    }

    return isset ? attrs : undefined;

  };

  /**
   * 텍스트에서 게임 데이터 태그를 인식하여 상세보기 링크를 생성 한다.
   * @example
   * 게임"<itemName:F08_angrymane_wand> 수집" => "성난갈기 놀의 지팡이 수집"
   * "<itemName:F08_angrymane_wand:노출명> 수집" => "노출명 수집"
   * @param {String} text
   * @return {jQueryObject} span 객체
   */
  GameData.parseLink = function(text){

    var r = text.replace(/<([a-z_]*):([ 'a-z0-9_\|\#]*)([^\>]*)>/gi, function(find, search, keyword, text){

      var lSearch = search.toLowerCase();

      text    = text ? text.substring(1) : '';
      keyword = keyword.trim();

      if( lSearch == 'blessuserlink' ){
        var args = keyword.split('|');
        return $adm.sprintf('<a href="#" role="BlessUserLink" server_id="%s" search="%s" keyword="%s">%s</a>', args[0], args[1], args[2], args[2]);
      }
      else if( lSearch == 'item_uid' ){
        var args = keyword.split('|');
        return $adm.sprintf('[<a href="#" role="BlessLogLink" server_id="%s" search="item" keyword="%s" action="34000,34001,34100,34101,34200,34202,34300,34301">%s</a>]', args[0], args[1], args[1]);
      }

      for( var datatype in DataKey )
        if( DataKey[datatype].tag[lSearch] )
          return $adm.sprintf('<a href="#" role="BlessGameDataLink" datatype="%s" search="%s" keyword="%s" >%s</a>', datatype, DataKey[datatype].tag[lSearch], keyword, text || keyword);

      return search + ':' + keyword;

    });

    return $E('span').html(r);

  };

  /**
   * 링크 정보로 대상 이름을 변환하여 노출 한다.
   * 비동기로 아이템명을 찾아야 할 때 사용 한다.
   * @param {String} text
   * @return {jQueryObject} span 객체
   */
  GameData.parseLinkName = function(text){

    return GameData.parseLink(text).find('A[role="BlessGameDataLink"], A[role="BlessUserLink"]').each(function(){

      var self      = $(this),
          cur       = self.text(),
          role      = self.attr('role'),
          server_id = self.attr('server_id'),
          datatype  = self.attr('datatype'),
          search    = self.attr('search'),
          keyword   = self.attr('keyword');

      if( role == 'BlessUserLink' ){

        $adm.promiseCache(
          $adm.sprintf('BL.getBlessUserLink:%s|%s|%s', server_id, search, keyword),
          function(){
            return $adm.ajax({
              methodcall: 'getBlessUserLink',
              data: [server_id, search, keyword],
              arrayArguments: true
            });
          }
        ).then(function(txt){
          self.text(txt);
        });

      }
      else if( role == 'BlessLogLink' ){
        // 암것도 안함
      }
      else if( DataKey[datatype] )
        GameData.getGameDataNameMap( datatype, search ).then(function(map){
          // 데이터키의 이름정보가 있으나 현재 데이터키가 보여지고 있는 경우 이름으로 교체 한다.
          if( map[keyword] && keyword == cur )
            self.text(map[keyword] || keyword);
        });

    }).end();

  };

  /**
   * 데이터 링크 객체를 생성 한다.
   * @param {String} datatype Item, NPC, Quest 등등 게임데이터 종류
   * @param {String} text 링크 텍스트
   * @param {String} search 검색 유형
   * @param {String} keyword 검색키
   * @return {jQueryObject} a 객체
   */
  GameData.getDetailLink = function(datatype, text, search, keyword){

    return $E('a',{href:'#', role:'BlessGameDataLink', datatype:datatype, search:search, keyword:keyword}).text(text);

  };

  /**
   * 게임데이터 전체 리스트 조회
   * @param {String} datatype Item, NPC, Quest 등등 게임데이터 종류
   * @return {Promise} Array
   */
  GameData.getGameDataList = function(datatype){

    debug(DataKey);

          return GameData.getGameData(DataKey[datatype].filename, DataKey[datatype].nodename);


    return $adm.promiseCache('BL.getGameDataList:'+datatype, function(){


    });

  };

  /**
   * 게임데이터의 전체 이름 객체 반환
   * @example
   * {
   *   item_id: item_name,
   *   item_id: item_name,
   *   item_id: item_name
   * }
   * @param {String} datatype Item, NPC, Quest 등등 게임데이터 종류
   * @param {String} key 객체의 Key로 사용할 속성. default=DataKey[datatype].id ex> item_id, code_name
   * @param {String} value 객체의 value로 사용할 속성. default=DataKey[datatype].name ex> item_name
   * @return {Promise} Object
   */
  GameData.getGameDataNameMap = function(datatype, key, value){

    key   = key || DataKey[datatype].id;
    value = value || DataKey[datatype].name;

    return $adm.promiseCache('BL.getGameDataNameMap:'+datatype+':'+key+':'+value, function(){

      return GameData.getGameDataList(datatype).then(function( list ){

        var map = {};

        list.forEach(function(item){
          map[ item[key] ] = item[ value ];
        });

        return map;

      });

    });

  };

  /**
   * 게임데이터 속성 중 키를 복수로 담고 있는 경우가 있다.
   * 이 경우 각 키를 데이터 링크 태그로 변환 한다.
   * @example
   * "RB0001_Helmet,RB0001_Upper,RB0001_Belt" => "<itemName:RB0001_Helmet><br/><itemName:RB0001_Upper><br/><itemName:RB0001_Belt><br/>"
   * @param {tagName} tagName 게임데이터 태그 종류
   * @param {tagString} tagString 변환할 텍스트
   * @param {separate} [separate=','] 구분자. 기본은 콤마
   * @return {String} 변환된 태그 스트링
   */
  GameData.getDataTagSplit = function(tagName, tagString, separate){

    var ret = '';

    (tagString||'').split(separate||',').forEach(function(tagData){
      ret += '<'+tagName+':'+tagData.trim()+'><br/>';
    });

    return ret;

  };

  /**
   * 게임데이터 상세보기 객체 반환
   * @example
   * GameData.getDetail.Item('name', 'RB0001_Helmet').then(function( $detail ){
   *  $detail.dialog();
   * });
   * @return {Promise} jQueryObject
   */
  GameData.getDetail = {};


  /**
   * 게임 데이터 수정 버튼
   * @param {String} code 수정 대상 코드. default=1 ex> 1
   * @param {String} name 수정 대상 명칭. default='' ex> GM권한등급
   * @return {Promise} Object
   */
  GameData.getAdminGMLevel = function(menu){

    var gmlevel=5;
    menu.ajax({
      methodcall: 'getAdmGMLevel',
      async: false,
      success: function(r){
        console.log('getAdmGMLevel : ' + r);
        gmlevel = r;
      }
    });
    return gmlevel;
  };

  /**
   * 게임 데이터 수정 버튼
   * @param {type} gmlevel
   * @param {type} menu
   * @param {type} csn
   * @param {type} server_id
   * @param {type} usn
   * @param {type} character_name
   * @param {type} code           code 수정 대상 코드. default=1 ex> 1
   * @param {type} before_data
   * @param {type} extra_data1    type4의 경우 선택할수 있는 Object가 들어가는데 거기에 사용함(여러개 중 선택용)
   * @param {type} extra_data2    기타경우 추가값이 필요하다면 extra_data2를 사용한다
   * @returns {window.$E|@var;edit_view_value}
   */
  GameData.getDataEditButton = function(gmlevel, menu, csn, server_id, usn, character_name, code, before_data, extra_data1, extra_data2){

    var editInfo;// = GameDataEditInfo[code];
    var button = $E('button');

    menu.ajax({
      //async: false,
      methodcall: 'getModifyInfo',
      data: [ code ],
      success: function(r){
        editInfo = r;

        // 코드번호에 따라 버튼 표시 형태 설정
        var btn_text = '';
        if (code==2 || code == 31 || code == 36 || code == 66 || code==86 || code==87 || code==88 || code==96 || code==112 || code==113 || code==114 || code==115 ) btn_text = 'Del';
        else if (code == 3 ||code == 37 || code == 69 || code==89 || code==90 || code==91) btn_text = 'Recover';
        else if (code == 38) btn_text = 'Move';
        else if (code == 67 || code == 68) btn_text = 'Return';
        else if (code == 4) btn_text = 'Kick';
        else if (code == 79 || code==80) btn_text = 'Move';
        else if (code == 53){ btn_text = 'set Story Quest -> Jorbi Call'; button.css({'width':'99%', 'height':'40px'});}
        else if (code == 82) btn_text = 'Send';

        if (btn_text != '') {
          button.text(btn_text).button();
        } else {
          button.text(before_data).button({icons:{primary:'ui-icon-pencil'}});
        }

        button.click(function(){

            var t_number, t_text, d_day, d_time, s_item_id, b_result_view;
            var sub_regist    = $E('div'),
                bottom        = $E('div').css({'text-align':'center'}),
                t_memo         = $E('textarea').css({width:200,height:70}).css("background","#E1E1E1"),
                t_reference_url = $E('text', {size: 30}),
                b_close        = $E('button').text('Close').button().click(function(){ sub_regist.dialog('close'); }),
                b_regist       = $E('button').text('Request').button().click(function(){ modifyGameDataItem(2); });

                if (gmlevel <= editInfo.gm_level) {   // 권한이 있을 경우 바로 수정 처리
                  b_regist       = $E('button').text('Modify').button().click(function(){ modifyGameDataItem(1); });
                }

                if (editInfo.data_type == 6) {  // 수치 회수일 경우 해당 코드의 추가 버튼 추가
                  var b_add_point = GameData.getDataEditButton(gmlevel, menu, csn, server_id, usn, character_name, code-1, before_data, button, extra_data2);
                  b_add_point.text('추가').width('80').height('26').button().click(function(){ sub_regist.dialog('close'); });
                  bottom.append(b_add_point);
                }

                if (editInfo.data_type == 5) {  // 수치 추가일 경우 결과 표시용 버튼 설정
                  b_result_view = extra_data1;
                } else {
                  b_result_view = button;
                }

            bottom.append(b_regist, b_close);

            switch (editInfo.data_type) {   // 각 데이터 타입별 입력 항목 설정
              case 0:
              case 8:
              case 9:
                sub_regist.verticalTable([[ t_memo, t_reference_url ]],
                                          {head: [ 'Memo', 'Reference' ] });
                break;
              case 1:
              case 5:
              case 6:
              case 7:
                t_number       = $E('text', {size: 10}).validate({required:true, onlynumber:true});
                sub_regist.verticalTable([[ t_number, t_memo, t_reference_url ]],
                                          {head: [ 'Number', 'Memo', 'Reference' ] });
                if (code == 35) t_number.val((before_data == 0)? 1:0);           // 초기값 입력(귀속)

                break;

              case 2:
                t_text         = $E('text', {size: 10});
                sub_regist.verticalTable([[ t_text, t_memo, t_reference_url ]],
                                          {head: [ 'Text', 'Memo', 'Reference' ] });
                break;

              case 3:
                d_day          = $E('text').validate({date: '+0d'}).val( $adm.getDate('Ymd', before_data) );
                d_time         = $E('text').validate({time: '000000'}).val( $adm.getDate('His', before_data) );
                sub_regist.verticalTable([[ d_day, d_time, t_memo, t_reference_url ]],
                                          {head: [ 'Date', 'Time', 'Memo', 'Reference' ] });
                break;

              case 4:
                s_item_id      = $E('select').selectOptions(extra_data1, {set:function(){
                    for( var z in extra_data1 ){
                      if(extra_data1[z] == before_data) return z;
                    }
                }});
                sub_regist.verticalTable([[ s_item_id, t_memo, t_reference_url ]],
                                          {head: [ 'Type', 'Memo', 'Reference' ] });
                break;
              case 10:
                var t_text1        = $E('text', {size: 10}),
                    t_text2        = $E('text', {size: 10}),
                    t_text3        = $E('text', {size: 10}),
                    t_text4        = $E('text', {size: 10}),
                    t_text5        = $E('text', {size: 10}),
                    t_text6        = $E('text', {size: 10}),
                    t_text7        = $E('text', {size: 10});
                sub_regist.verticalTable([[ t_text1, t_text2, t_text3, t_text4, t_text5, t_text6, t_text7, t_memo, t_reference_url ]],
                                          {head: [ 'X','Y','Z','Worldmap_Instance_Sid','Worldmap_Type','Wrapper_cid','Worldmap_cid', 'Memo', 'Reference' ] });
                break;
              case 11:
                var t_text1        = $E('select').selectOptions(extra_data1),
                      t_text2        = $E('text', {size: 10});
                sub_regist.verticalTable([[ t_text1, t_text2, t_memo, t_reference_url ]],
                                          {head: [ 'Server', 'Time(min)', 'Memo', 'Reference' ] });
                break;

              case 12:
                sub_regist.verticalTable([[ t_memo, t_reference_url ]],
                                          {head: [ 'Memo', 'Reference' ] });
                break;

            }
            sub_regist.append(bottom)
                      .dialog({title: editInfo.name + ((before_data != '') ? ' Modify Data (Before:' + before_data +')' : '')});

            function modifyGameDataItem(gmlevel_type){

                if ( !sub_regist.validate() ) return;
                if (t_memo.val() == '') {
                  alert('Please insert Memo');
                  return;
                }

                var edit_value = '', before_value = '', edit_view_value = '';
                switch (editInfo.data_type) {
                  case 0:
                    break;

                  case 1:
                    edit_value = t_number.val();
                    if (edit_value < 0) { alert('Error. Minus value is not allowed.'); return; }
                    //else if(edit_value >= 10000){ alert('10000 이상의 값을 가질 수 없습니다.'); return; }
                    before_value = before_data;
                    edit_view_value = edit_value;
                    break;

                  case 2:
                    edit_value = t_text.val();
                    before_value = before_data;
                    edit_view_value = edit_value;
                    break;

                  case 3:
                    edit_value = d_day.val()+d_time.val();
                    before_value = $adm.getDate('Ymd', before_data) + $adm.getDate('His', before_data) ;
                    edit_view_value = $adm.getDate('Y-m-d H:i:s', edit_value);
                    break;

                  case 4:
                    edit_value = s_item_id.val();
                    for( var z in extra_data1 ){
                      if(extra_data1[z] == before_data) before_value = z;
                    }
                    edit_view_value = extra_data1[edit_value];
                    break;

                  case 5:
                    edit_value = t_number.val();
                    if (edit_value < 0) {
                      alert('Error. Minus value is not allowed');
                      return;
                    }
                    else if(edit_value >= 1000000 ){
                      alert('Error. edit_value is more than 1000000');
                      return;
                    }
                    before_value = before_data;
                    edit_view_value = parseInt(edit_value) + parseInt(before_data);
                    break;

                  case 6:
                    edit_value = t_number.val();
                    if (edit_value >= 0) { alert('Error. Please insert minus value.'); return; }
                    if ((parseInt(before_data)+parseInt(edit_value)) < 0) { alert('Error. After value is lower than 0.'); return; }
                    before_value = before_data;
                    edit_view_value = parseInt(edit_value) + parseInt(before_data);
                    break;

                  case 7:
                    edit_value = t_number.val();
                    if ((parseInt(before_data)+parseInt(edit_value)) < 0) { alert('Error. After value is lower than 0.'); return; }
                    before_value = before_data;
                    edit_view_value = parseInt(edit_value) + parseInt(before_data);
                    break;

                  case 8:
                    edit_value = 0;
                    before_value = before_data;
                    edit_view_value = edit_value;
                    break;

                  case 9:
                    edit_value = 1;
                    before_value = before_data;
                    edit_view_value = edit_value;
                    break;

                  case 10:
                    if (t_text1.val() == '' || t_text2.val() == '' || t_text3.val() == '' || t_text4.val() == '' || t_text5.val() == '' || t_text6.val() == '' || t_text7.val() == '') {
                      alert('Error. Insert every field.');
                      return;
                    }
                    before_value = "Modify";
                    edit_view_value = "Completed";
                    var editValue = [t_text1.val(),t_text2.val(),t_text3.val(),t_text4.val(),t_text5.val(),t_text6.val(),t_text7.val()];
                    edit_value = JSON.stringify(editValue);
                    break;

                  case 11:
                    if (t_text1.val() == '' || t_text2.val() == '') {
                      alert('Error. Insert every field.');
                      return;
                    }
                    before_value = "Modify";
                    edit_view_value = "Completed";
                    var editValue = [t_text1.val(),t_text2.val()];
                    edit_value = JSON.stringify(editValue);
                    break;

                  case 12:
                    var editValue = [extra_data1[0].x,extra_data1[0].y,extra_data1[0].z,extra_data1[0].worldtype,extra_data1[0].worldmapwrappercid,extra_data1[0].worldmapcid];
                    edit_value = JSON.stringify(editValue);
                    break;

                }

                var confirm_msg = (gmlevel_type == 1) ? 'Are you sure?' : 'Do you want send request?';
                if ( !confirm(confirm_msg)) return;

                // 게임내 GMLevel변경, KickOut의 경우 로그 기록전에 처리
                if (code == 1) {
                  csn = 0;
                  server_id = 0;
                }
                else if (code == 4) {
                  csn=0;
                  server_id=t_text1.val();
                  //usn svr duration msg
                  menu.ajaxAsync('kickAccount', usn, t_text1.val(), t_text2.val(), t_memo.val()  );
                }

                menu.ajax({
                  arrayArguments : true,
                  methodcall: 'modifyGameDataItem',
                  data: [ code, csn, server_id, usn, character_name, before_value, edit_value, t_memo.val(), extra_data2, t_reference_url.val() ],
                  success: function(r){
                    if( r==true ){
                      if (gmlevel_type == 1) {
                        alert('Completed.');
                        before_data = edit_view_value;
                        b_result_view.text(edit_view_value).css('color', 'red');
                        //.button({icons:{primary:'ui-icon-pencil'}});
                      }
                      sub_regist.dialog('close');
                    } else {
                      if (r != '') alert(r);
                    }
                  }
                });
            }
        });
      },
      error : function(){
        button = before_data;
      }
    });
    //console.log(code, editInfo);
    return button;
  };

  GameData.confirmModifyGameDataItem = function(menu, log_seq){
    console.log('GameData.confirmModifyGameDataItem : ' + log_seq);
    var result = false;
    menu.ajax({
      async: false,
      arrayArguments : true,
      methodcall: 'confirmModifyGameDataItem',
      data: [ log_seq ],
      success: function(r){
        if( r==true ){
          alert('Completed.');
          result = true;
        } else {
          result = r;
        }
      }
    });
    return result;
  };

  GameData.rejectModifyGameDataItem = function(menu, log_seq, memo){
    console.log('GameData.rejectModifyGameDataItem  : ' + log_seq + ', memo : ' + memo);
    if (memo == '') return 'Error. Insert reject reason.';

    var result = false;
    menu.ajax({
      async: false,
      arrayArguments : true,
      methodcall: 'rejectModifyGameDataItem',
      data: [ log_seq, memo ],
      success: function(r){
        if( r==true ){
          alert('Complete.');
          result = true;
        } else {
          result = r;
        }
      }
    });
    return result;
  };

  GameData.itemdetail = function(menu, server, uid){
    var statWin = $E('div').win({ title : 'Item Stat '+uid, parent : menu, top : 150, left : 400, width : 'auto', height : 'auto',
      buttonpane : false, close : true, screen_toggle : true, minimum : true, status : true, resizable : true, draggable : true, 'extends' : false });
    statWin.ajax({
      methodcall : ['getItemStat'],
      data       : [ server, uid ],
      success    : function( r ){
        statWin.append($E('span').text('Legend_option : ')).append($E('span').css('color','red').text(Desc.legend_option[r[2]])).append($E('span').text('  ('+r[2]+')'));
        statWin.clientTable(
          [ [r[0][0], [r[1][0]]],
            [r[0][1], [r[1][1]]],
            [r[0][2], [r[1][2]]],
            [r[0][3], [r[1][3]]],
            [r[0][4], [r[1][4]]],
            [r[0][5], [r[1][5]]],
            [r[0][6], [r[1][6]]],
            [r[0][7], [r[1][7]]]  ] ,
        {
          field: ['0', '1'],
          head: ['statType','statValue'],
          translate : { '0' : Desc.EParamType },
          width: '100%',
          footer: false
        });
      }
    });
  };

  GameData.getLocalname = function(menu, filename, cid){
    var span =$E('button').button().text(cid).click(function(span){
      var self = $(this);
      menu.ajaxAsync('getLocalname', filename, cid).then(function(r){
          if(r!==null)
            self.text(r);
        });
    });
    return span;
  };

  /**
   * DataKey 에 각 게임데이터 XML을 분석을 위한 정보 및 상세보기 구현이 정의 된다.
   * DataKey.Item
   * DataKey.NPC
   * 등등
   */
  var DataKey = GameData.DataKey = {};

  for( var i=requireModules.length; i<arguments.length; i++)
    arguments[i](DataKey, GameData);

  /**
   * 각 게임데이터의 상세보기 기능을 연결 한다.
   */
  for( var k in DataKey )
    (function(k){
      GameData.getDetail[k] = DataKey[k].detail || function(search, keyword){ alert($adm.sprintf('Detail func is under construct(%s, %s, %s)', k, search, keyword)); };
    })(k);

  /**
   * A 링크 중 role=BlessUserLink 인 객체는 클릭 시 해당 유져 검색 툴을 실행시킨다.
   */
  $('BODY').off('click.BlessUserLink').on('click.BlessUserLink', 'A[role="BlessUserLink"]', function(){

    var btn = this,
        attr = GameData.getAttributes(this);

    var menusrl = $adm.getConfig('Server').BlessGameCharViewMenuSrl,
        json = JSON.stringify({
          server_id   : attr.server_id,
          search_type : attr.search,
          search_key  : attr.keyword
        });

    $adm.menu.execute( menusrl, 'Bless', json );

  });

  /**
   * A 링크 중 role=BlessLogLink 인 객체는 클릭 시 해당 유져 검색 툴을 실행시킨다.
   */
  $('BODY').off('click.BlessLogLink').on('click.BlessLogLink', 'A[role="BlessLogLink"]', function(){

    var btn = this,
        attr = GameData.getAttributes(this);

    var menusrl = $adm.getConfig('Server').BlessLogViewMenuSrl,
        json = JSON.stringify({
          server_id   : attr.server_id,
          search_type : attr.search,
          search_key  : attr.keyword,
          action      : attr.action.split(',')
        });

    $adm.menu.execute( menusrl, json );

  });

  /**
   * A 링크 중 role=BlessGameDataLink 인 객체는 클릭 시 해당 게임 데이터 링크로 인식하여 동작하도록 한다.
   */
  $('BODY').off('click.BlessGameDataLink').on('click.BlessGameDataLink', 'A[role="BlessGameDataLink"]', function(){

    var btn = this,
        attr = GameData.getAttributes(this);

    GameData.getDetail[attr.datatype](attr.search, attr.keyword).then(function(contents){

      if( !contents ) return;

      contents.dialog({
        title: attr.datatype+' GameData :: '+attr.search+' = '+attr.keyword,
        stick: {right:btn}
      });

    });

    return false;

  });

  // 개발 편의상 글로벌에 할당..
  if( $adm.getConfig('Server').EnvLocation == 'dev' )
    window.GameData = GameData;

  return GameData;

});

})(jQuery, this, this.document);
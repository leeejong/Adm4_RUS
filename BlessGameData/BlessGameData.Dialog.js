/**
 * BlessGameData.Item
 * 블레스 게임데이터 뷰어 - 대화
 * @author bitofsky@neowiz.com 2013.07.16
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
define(['beans/Bless/BlessDesc'], function(DESC){

  /**
   * DataKey 구조
   * KEY = 데이터 종류(Item, NPC, Quest.. etc)
   * {
   *   filename = XML 파일명
   *   nodename = 최상위 요소별 노드(태그)명
   *   id       = 고유키 이름
   *   code     = 코드명
   *   name     = 식별명
   *   tag      = GameData.parseLink를 통해 파싱될 태그명 <npcName:A00_Oger_Hunter> 은 npcName 이 된다.
   *   detail   = 상세보기 뷰 구현 함수. search, keyword가 인자로 주어짐. 검색 요청된 게임데이터를 찾아 상세 정보를 보여주는 View 객체를 Promise로 리턴해야 한다.
   * }
   */
  return function( DataKey, GameData ){

    /**
     * Dialog 정보
     */
    DataKey.Dialog = {
      filename: 'DialogInfo',
      nodename: 'dialogInfo',
      id: 'dialog_id',
      code: 'code_name',
      name: 'code_name',
      tag: {dialogname:'code_name'},
      detail: function(search, keyword){

        switch(search){
          case 'code_name':
          case 'dialog_id':
            return GameData.getGameData(DataKey.Dialog.filename, DataKey.Dialog.nodename, search, keyword, '=').then( makeTab );

        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var dialogInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '대화 기본 정보',
              contents: function(){

                var condition      = [],
                    talk_list      = [],
                    selection_list = [];

                // 대화 노출 조건
                $(dialogInfo.node).find('condition').children().each(function(idx, cond){

                  var attr     = GameData.getAttributes(cond) || {},
                      nodeName = cond.nodeName,
                      relative = DESC.DialogInfo_Condition[nodeName],
                      target   = '';

                  if( attr.quest )     target = ' <questName:'+attr.quest+'>';
                  else if( attr.item ) target = ' <itemName:'+attr.item+'>';

                  condition.push({
                    relative: relative,
                    target: target
                  });

                });

                // 대화 내용
                $(dialogInfo.node).find('dialog_text').each(function(idx, node){
                  var attr = GameData.getAttributes(node);
                  talk_list.push({
                    talker: '<npcName:'+attr.talker+'>',
                    text: attr.text,
                    camera_type: attr.camera_type
                  });
                });

                // 선택지
                $(dialogInfo.node).find('selection').each(function(idx, node){

                  var attr = GameData.getAttributes(node),
                      cond = '',
                      func = '';

                  $(node).find('selection_condition').children().each(function(idx, nCond){

                    var cAttr = GameData.getAttributes(nCond) || {},
                        nodeName = nCond.nodeName;

                    if( nodeName == 'not_under_escort' )
                      cond += DESC.DialogInfo_SelectionCondition[nodeName] + '<br/>';
                    else
                      cond += DESC.DialogInfo_SelectionCondition[nodeName] + ' : <questName:'+cAttr.quest+'><br/>';

                  });

                  $(node).find('function').children().each(function(idx, nFunc){

                    var fAttr    = GameData.getAttributes(nFunc) || {},
                        nodeName = nFunc.nodeName,
                        desc     = DESC.DialogInfo_SelectionFunction[nodeName] || nodeName,
                        link     = '';

                    switch( true ){
                      case nodeName == 'end'                    : break;
                      case nodeName == 'link'                   : link = '<dialogName:'+fAttr.dialog+'>';           break;
                      case nodeName.indexOf('quest') > -1       : link = '<questName:'+fAttr.quest+'>';             break;
                      case nodeName == 'talkSelection'          : link = '<questName:'+fAttr.quest+'>';             break;
                      case nodeName == 'startWaypoint'          : link = '<waypointName:'+fAttr.departure_id+'> => <waypointName:'+fAttr.arrival_id+'>'; break;
                      case nodeName.indexOf('Waypoint') > -1    : link = '<waypointName:'+fAttr.register_id+'>';    break;
                      case nodeName == 'incQuestObjectiveCount' : link = '<questName:'+fAttr.quest+'>';             break;
                      case nodeName == 'setDestination'         : link = '<destinationName:'+fAttr.destination+'>'; break;
                    }

                    func += $adm.sprintf('%s %s <br/>', desc, link);

                  });

                  selection_list.push({
                    text: attr.selection_text,
                    category: attr.selection_category,
                    condition: cond,
                    func: func
                  });
                });

                var $div = $E('div');

                $div.clientTable([dialogInfo], {
                  title: '기본 정보',
                  width: 1000,
                  sort: false,
                  footer: false,
                  field: ['dialog_id','code_name','category','priority','show_questtype','show_questid','monolog_text'],
                  head: DESC.DialogInfo
                });

                $div.clientTable(condition, {
                  title: '대화 노출 조건',
                  width: '100%',
                  field: ['relative','target'],
                  head: {
                    relative: '조건',
                    target: '대상'
                  },
                  translate_realtime: {
                    target: GameData.parseLinkName
                  }
                });

                $div.clientTable(talk_list, {
                  title: '대화 내용',
                  width: '100%',
                  field: ['talker','camera_type','text'],
                  head: {
                    talker: '화자',
                    camera_type: '카메라',
                    text: '내용'
                  },
                  translate_realtime: {
                    talker: GameData.parseLinkName,
                    text: GameData.parseLinkName
                  }
                });

                $div.clientTable(selection_list, {
                  title: '선택지',
                  width: '100%',
                  field: ['text','category','condition','func'],
                  head: {
                    text: '내용',
                    category: '분류',
                    condition: '노출 조건',
                    func: '선택시 기능'
                  },
                  translate_realtime: {
                    condition: GameData.parseLinkName,
                    func: GameData.parseLinkName
                  }
                });

                return $div;

              }
            }
          ]);
        }

      }
    };

  };

});

})(jQuery, this, this.document);
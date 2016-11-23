/**
 * BlessGameData.InstantField
 * 블레스 게임데이터 뷰어 - 인스턴트 필드
 * @author bitofsky@neowiz.com 2014.02.13
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

    var DataName = 'InstantField';

    /**
     * MonsterBook 정보
     */
    var DataConfig = DataKey[DataName] = {
      filename: 'WorldInfo',
      nodename: 'instantFieldInfo',
      id: 'instant_field_id',
      code: 'code_name',
      name: 'name_k',
      tag: {instant_field_id:'instant_field_id'},
      detail: function(search, keyword){

        switch( search ){
          case 'instant_field_id':
          case 'code_name':
            return GameData.getGameData(DataConfig.filename, DataConfig.nodename, search, keyword, '=').then( makeTab );

        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var dataInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '기본 정보',
              contents: function(){

                var tab = $E('div');

                var arrEntry = [],
                    arrStage = [];

                // 필드 발생 퀘스트 조건
                $(dataInfo.node).children('entry_quest_condition').each(function( idx, node ){
                  arrEntry.push({
                    quest_cid: $(node).attr('quest_cid'),
                    quest_condition_type: $(node).attr('quest_condition_type')
                  });
                });

                // 스테이지 발생 퀘스트 조건
                $(dataInfo.node).children('stage_quest_condition').each(function( idx, node ){
                  arrStage.push({
                    quest_cid: $(node).attr('quest_cid'),
                    quest_condition_type: $(node).attr('quest_condition_type'),
                    stage_index: $(node).attr('stage_index')
                  });
                });

                tab.clientTable([dataInfo], {
                  width: 400,
                  sort: false,
                  footer: false,
                  title: '인스턴트 필드 정보',
                  field: ['instant_field_id', 'code_name', 'name_k', 'description_k', 'worldmap_id', 'volume', 'allow_walk_inout', 'sharing_with_party', 'expire_time', 'stage_count'],
                  head: DESC.InstantFieldInfo
                }).clientTable(arrEntry, {
                  width: 400,
                  title: '필드 발생 퀘스트 조건',
                  field: ['quest_cid', 'quest_condition_type'],
                  head: {
                    quest_cid: 'Quest',
                    quest_condition_type: 'Condition Type'
                  },
                  translate: {
                    quest_cid: function( v ){
                      return GameData.parseLinkName('<questname:'+v+'>');
                    },
                    quest_condition_type: DESC.InstantField_QuestCondition
                  }
                }).clientTable(arrStage, {
                  width: 400,
                  title: '스테이지 발생 퀘스트 조건',
                  field: ['quest_cid', 'quest_condition_type', 'stage_index'],
                  head: {
                    quest_cid: 'Quest',
                    quest_condition_type: 'Condition Type',
                    stage_index: 'Stage Index'
                  },
                  translate: {
                    quest_cid: function( v ){
                      return GameData.parseLinkName('<questname:'+v+'>');
                    },
                    quest_condition_type: DESC.InstantField_QuestCondition
                  }
                });

                return tab;

              }
            }
          ]);
        }
      }
    };

  };

});

})(jQuery, this, this.document);
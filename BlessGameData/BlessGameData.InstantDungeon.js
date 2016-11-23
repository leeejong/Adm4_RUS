/**
 * BlessGameData.InstantDungeon
 * 블레스 게임데이터 뷰어 - 인스턴트 던전
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

    var DataName = 'InstantDungeon';

    /**
     * MonsterBook 정보
     */
    var DataConfig = DataKey[DataName] = {
      filename: 'WorldInfo',
      nodename: 'instantDungeonInfo',
      id: 'dungeon_id',
      code: 'instantdungeon_code_name',
      name: 'instantdungeon_code_name',
      tag: {dungeon_id:'dungeon_id'},
      detail: function(search, keyword){

        switch( search ){
          case 'dungeon_id':
            return GameData.getGameData(DataConfig.filename, DataConfig.nodename, search, keyword, '=').then( makeTab );
          case 'instantdungeon_code_name':
            return GameData.getGameData(DataConfig.filename, DataConfig.nodename, 'instantDungeon_code_name', keyword, '=').then( makeTab );

        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var dataInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '기본 정보',
              contents: function(){

                var tab = $E('div');

                tab.clientTable([dataInfo], {
                  width: 400,
                  sort: false,
                  footer: false,
                  title: '인스턴트 던전 정보',
                  field: ['dungeon_id', 'instantdungeon_code_name', 'worldmap_id', 'enter_method', 'required_party_type', 'required_lvl', 'required_maxlvl', 'cooltime', 'stage_expire', 'reset_able', 'expire_time', 'stage_count'],
                  head: DESC.InstantDungeonInfo
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
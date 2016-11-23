/**
 * BlessGameData.WorldMap
 * 블레스 게임데이터 뷰어 - 월드맵
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

    var DataName = 'WorldMap';

    /**
     * MonsterBook 정보
     */
    var DataConfig = DataKey[DataName] = {
      filename: 'WorldInfo',
      nodename: 'worldMapInfo',
      id: 'worldmap_id',
      code: 'worldmap_code_name',
      name: 'worldmap_code_name',
      tag: {worldmap_id:'worldmap_id'},
      detail: function(search, keyword){

        switch( search.toLowerCase() ){
          case 'worldmap_id':
            return GameData.getGameData(DataConfig.filename, DataConfig.nodename, 'worldMap_id', keyword, '=').then( makeTab );
          case 'worldmap_code_name':
            return GameData.getGameData(DataConfig.filename, DataConfig.nodename, 'worldMap_code_name', keyword, '=').then( makeTab );

        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var dataInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '기본 정보',
              contents: function(){

                var tab = $E('div');

                var dvList = dataInfo.division_map_name.split(';').map(function(x){ return {id: x.split('=')[0], name: x.split('=')[1]}; });

                tab.clientTable([dataInfo], {
                  width: 400,
                  sort: false,
                  footer: false,
                  title: '월드맵 정보',
                  field: ['worldmap_id', 'worldmap_code_name', 'worldmap_type', 'map_name'],
                  head: DESC.WorldMapInfo
                }).clientTable(dvList, {
                  width: '100%',
                  title: 'Division Map Name',
                  sort: false,
                  footer: false
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
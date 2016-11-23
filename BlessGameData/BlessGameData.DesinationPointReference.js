/**
 * BlessGameData
 * 블레스 게임데이터 뷰어 - 귀환지
 * @author leeejong@neowiz.com 2015.5.25
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

    var DataName = 'DesinationPointReference';

    /**
     * MonsterBook 정보
     */
    var DataConfig = DataKey[DataName] = {
      filename: 'DesinationPointReference',
      nodename: 'DestinationPointInfo',
      id: 'id',
      code: 'name',
      name: 'localname',
      tag: {desinationpoint_id:'id'},
      detail: function(search, keyword){

        alert('hi2');

        switch( search.toLowerCase() ){
          case 'id':
            return GameData.getGameData(DataConfig.filename, DataConfig.nodename, 'Id', keyword, '=').then( makeTab );
          case 'name':
            return GameData.getGameData(DataConfig.filename, DataConfig.nodename, 'Name', keyword, '=').then( makeTab );

        }

//        function makeTab(){
//          console.dir(arguments);
//        }


        function makeTab(){


          alert('hi');

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
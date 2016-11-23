/**
 * BlessGameData.MonsterBook
 * 블레스 게임데이터 뷰어 - 몬스터북
 * @author bitofsky@neowiz.com 2014.02.04
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
     * MonsterBook 정보
     */
    DataKey.MonsterBook = {
      filename: 'MonsterBookInfo',
      nodename: 'monsterBookInfo',
      id: 'id',
      code: 'name',
      name: 'local_name',
      tag: {monsterbookid:'id'},
      detail: function(search, keyword){

        switch(search){
          case 'local_name':
          case 'name':
          case 'id':
            return GameData.getGameData(DataKey.MonsterBook.filename, DataKey.MonsterBook.nodename, search, keyword, '=').then( makeTab );

        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var monsterBookInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '기본 정보',
              contents: function(){

                var tab = $E('div');

                tab.clientTable([monsterBookInfo], {
                  width: 1000,
                  sort: false,
                  footer: false,
                  title: '몬스터북 정보',
                  field: ['id', 'name', 'local_name', 'monster_list', 'location', 'open_quest_name'],
                  head: DESC.MonsterBookInfo,
                  translate: {
                    open_quest_name: function( v ){

                      if( !v ) return '';

                      return $adm.joinElements.apply(this, v.split(' ').map(function( questname ){
                        return GameData.parseLinkName('<questName:'+questname+'><br/>');
                      }));

                    }
                  }
                });

                var stageList = [];

                $(monsterBookInfo.node).find('stageInfo').each(function( idx, stageInfo ){

                  stageList.push(
                    $.extend({}, GameData.getAttributes(stageInfo), GameData.getAttributes( stageInfo.children[0].children[0] ))
                  );

                });

                tab.clientTable(stageList, {
                  width: '100%',
                  title: '목표 리스트',
                  field: ['summary', 'count', 'reward_money', 'reward_experience'],
                  head: DESC.MonsterBookInfoStage,
                  translate: {
                    open_quest_name: function( v ){
                      return GameData.parseLinkName('<questName:'+v+'>');
                    }
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
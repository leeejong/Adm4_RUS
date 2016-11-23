/**
 * BlessGameData.Item
 * 블레스 게임데이터 뷰어 - 상호작용 Prop
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
     * Prop 정보
     */
    DataKey.Prop = {
      filename: 'PropInfo',
      nodename: 'propInfo',
      id: 'prop_id',
      code: 'name',
      name: 'name_k',
      tag: {propname:'name', prop_id: 'prop_id'},
      detail: function(search, keyword){

        switch(search){
          case 'name':
          case 'prop_id':
            return GameData.getGameData(DataKey.Prop.filename, DataKey.Prop.nodename, search, keyword, '=').then( makeTab );

        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var propInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '소품 기본 정보',
              contents: function(){

                return $E('div').clientTable([propInfo],{
                  title: '기본 정보',
                  width: 600,
                  sort: false,
                  footer: false,
                  field: ['prop_id','name','name_k','prop_category','description_k','icon_index'],
                  head: DESC.PropInfo,
                  translate: DESC.PropInfo_TYPES
                }).clientTable([propInfo],{
                  title: '속성',
                  width: '100%',
                  sort: false,
                  footer: false,
                  field: ['duration','can_target','interact_type','interact_casting_time','after_interact','deactive_depose_time','faction'],
                  head: DESC.PropInfo,
                  translate: DESC.PropInfo_TYPES
                });

              }
            },
            {
              name: '연관 정보',
              select: function(tab){

                var $pRelativeQuest = $E('div');

                GameData.getGameData(DataKey.Quest.filename,'interact_prop_list','prop',propInfo.name).then(function(list){

                  var arrRelativeQuest = [];

                  list.forEach(function(item){

                    var nodeName   = item.node.nodeName;

                    var quest = GameData.getAttributes( item.node.parentNode );

                    arrRelativeQuest.push({
                      quest_id  : quest.quest_id,
                      name      : quest.name,
                      localname : quest.localname,
                      item      : '<itemName:'+item.item+'>',
                      rate      : item.rate + '%',
                      count     : item.count
                    });

                  });

                  $pRelativeQuest.clientTable(arrRelativeQuest, {
                    title: '연관 퀘스트 소품',
                    width: 600,
                    field: ['quest_id','name','localname','item','rate','count'],
                    head: {
                      quest_id: 'Quest ID',
                      name: '코드네임',
                      localname: '퀘스트 이름',
                      item: '습득 아이템',
                      rate: '습득 확률',
                      count: '습득 수량'
                    },
                    translate_realtime: {
                      quest_id: function(v, cname, row){

                        return GameData.getDetailLink('Quest', v, 'quest_id', v);

                      },
                      item_id: function(v, cname, row){

                        return GameData.getDetailLink('Item', v, 'item_id', v);

                      },
                      item: GameData.parseLinkName
                    }
                  });

                });

                tab.empty().append( $pRelativeQuest );

              }
            }
          ]);
        }
      }
    };

  };

});

})(jQuery, this, this.document);
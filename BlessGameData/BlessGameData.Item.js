/**
 * BlessGameData.Item
 * 블레스 게임데이터 뷰어 - 아이템
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
     * 아이템 정보
     */
    DataKey.Item = {
      filename: 'ItemInfo',
      nodename: 'itemInfo',
      id: 'item_id',
      code: 'name',
      name: 'name_k',
      tag: {itemname:'name', item_id: 'item_id'},

      find: function(search, keyword){
        switch(search){
          case 'name':
          case 'item_id':
            return GameData.getGameData(DataKey.Item.filename, DataKey.Item.nodename, search, keyword, '=');

        }
      },

      detail: function(search, keyword){

        return DataKey.Item.find(search, keyword).then( makeTab );

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var itemInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '아이템 기본 정보',
              contents: function(){

                return $E('div').clientTable([itemInfo], {
                  width: 1000,
                  title: '기본 정보',
                  field: ['item_id','name','name_k','description_k','icon_index','effect_charges','disappear_on_exhaust'],
                  head: DESC.ItemInfo,
                  translate: DESC.ItemInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([itemInfo], {
                  width: '100%',
                  title: '분류 및 제한',
                  field: ['bondingtype','equip_cat1','equip_cat2','equip_cat3','grade','usable_class','usable_minlv','usable_maxlv'],
                  head: DESC.ItemInfo,
                  translate: DESC.ItemInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([itemInfo], {
                  width: '100%',
                  title: '구입 / 판매 / 보관',
                  field: ['enable_sale','buy_price','sell_price','destroyable','stackable','max_holding_count'],
                  head: DESC.ItemInfo,
                  translate: DESC.ItemInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([itemInfo], {
                  width: '100%',
                  title: '기본 스테이터스',
                  field: ['min_wp_damage','max_wp_damage','min_wp_spell_damage','max_wp_spell_damage','wp_attackperiod','parry_amount','armor','resist'],
                  head: DESC.ItemInfo,
                  translate: DESC.ItemInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([itemInfo], {
                  width: '100%',
                  title: '기타 스테이터스',
                  field: ['attack_power','spell_power','hit_rating','dodge_rating','parry_rating','block_rating','block_reduce_rating','critical_rating','haste_rating','resist_rating'],
                  head: DESC.ItemInfo,
                  translate: DESC.ItemInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([itemInfo], {
                  width: '100%',
                  title: '능력치',
                  field: ['strength','agility','intelligence','wisdom','stamina','energy','valor','technique','concentration','will','domination','conviction','insight'],
                  head: DESC.ItemInfo,
                  translate: DESC.ItemInfo_TYPES,
                  sort: false,
                  footer: false
                });

              }
            },
            {
              name: '드랍 정보',
              select: function(tab){

                tab.empty();

                var $itemDrop  = $E('div').appendTo( tab ),
                    $itemTable = $E('div').appendTo( tab );

                DataKey.Item.getDropNPC(search, keyword).then(function( npcList ){

                  $itemDrop.clientTable(npcList, {
                    title: '아이템 드랍 NPC',
                    width: 1000,
                    field: ['npc_id','code_name','npc_name','rate','min_count','max_count'],
                    head: {npc_id:'NPC ID',code_name:'코드네임',npc_name:'NPC 이름',rate:'드랍 확률',min_count:'최소 수량',max_count:'최대 수량'},
                    translate_realtime: {
                      npc_id: function(v, cname, row){

                        return GameData.getDetailLink('NPC', v, 'npc_id', v);

                      }
                    }
                  });

                });

                DataKey.Item.getDropTable(search, keyword).then(function(list){

                  var tableList = [];

                  list.forEach(function(item){
                    var tableInfo = GameData.getAttributes(item.node.parentNode);
                    tableList.push(
                      $.extend({table_id: tableInfo.table_id, name: tableInfo.name}, item)
                    );
                  });

                  $itemTable.clientTable(tableList, {
                    title: '아이템 드랍 테이블',
                    width: 1000,
                    field: ['table_id','name','weight','min_count','max_count','condition_class','condition_gender','condition_race','condition_pcfaction','condition_equip_item','condition_inventory_item'],
                    head: $.extend({}, DESC.ItemDropTableInfo, DESC.ItemDropTableInfoItems),
                    translate: {
                      table_id: function(v, cname, row){

                        return GameData.getDetailLink('ItemDropTable', v, 'table_id', v);

                      },
                      condition_gender: DESC.infoTribeGender2,
                      condition_class: DESC.infoClassType2
                    },
                    add_column: {
                      drop_item                : function(row){ return GameData.parseLinkName('<itemName:'+row.drop_item+'>'); },
                      condition_equip_item     : function(row){ return GameData.parseLinkName( GameData.getDataTagSplit('itemName', row.condition_equip_item) ); },
                      condition_inventory_item : function(row){ return GameData.parseLinkName( GameData.getDataTagSplit('itemName', row.condition_inventory_item) ); }
                    }
                  });

                });

              }
            },
            {
              name: '연관 퀘스트',
              select: function(tab){

                var $pRelativeQuest = $E('div');

                GameData.getGameData(DataKey.Quest.filename, '*','item',itemInfo.name).then(function(list){

                  var arrRelativeQuest = [];

                  list.forEach(function(item){

                    var nodeName   = item.node.nodeName,
                        pNodeName  = item.node.parentNode.nodeName,
                        ppNodeName = item.node.parentNode.parentNode.nodeName;

                    var quest = GameData.getAttributes( pNodeName == 'questInfo' ? item.node.parentNode : item.node.parentNode.parentNode );

                    if( nodeName == 'drop_item_list' )
                      item.summary = $adm.sprintf('<npcName:%s> 에게 획득 가능(%d% * %d)', item.npc, item.rate, item.count);
                    else if( nodeName == 'interact_prop_list' )
                      item.summary = $adm.sprintf('<propName:%s> 에게 획득 가능(%d% * %d)', item.prop, item.rate, item.count);

                    arrRelativeQuest.push({
                      quest_id        : quest.quest_id,
                      name            : quest.name,
                      localname       : quest.localname,
                      parent_relative : pNodeName != 'questInfo' ? pNodeName : '',
                      relative        : nodeName,
                      count           : item.count   || '',
                      summary         : item.summary || item.pcclass || ''
                    });

                  });

                  $pRelativeQuest.clientTable(arrRelativeQuest, {
                    width: 600,
                    field: ['quest_id','name','localname','parent_relative','relative','summary'],
                    head: {
                      quest_id: 'Quest ID',
                      name: '코드네임',
                      localname: '퀘스트 이름',
                      parent_relative: '연관 정보',
                      relative: '내역',
                      summary: '상세'
                    },
                    translate: {
                      parent_relative: {
                        essencial_objective : '수행 목표',
                        on_complete         : '퀘스트 완료시',
                        on_reward           : '퀘스트 보상획득시',
                        on_delete           : '퀘스트 포기/실패시',
                        on_restart          : '퀘스트 재시작시'
                      },
                      relative: {
                        getitem: '아이템 획득',
                        remove_item: '아이템 삭제',
                        drop_item_list: '드랍 몬스터 정보',
                        interact_prop_list: '드랍 상호작용 정보',
                        reward_fix: '고정 보상',
                        reward_selective: '선택 보상'
                      }
                    },
                    translate_realtime: {
                      quest_id: function(v, cname, row){

                        return GameData.getDetailLink('Quest', v, 'quest_id', v);

                      },
                      summary: GameData.parseLinkName
                    }
                  });

                });

                tab.empty().append( $pRelativeQuest );

              }
            }
          ]);
        }
      },
      getDropNPC : function( search, keyword ){

        var promise = Promise();

        DataKey.Item.find(search, keyword).then(function(){

          var itemInfo = arguments[0][0];

          GameData.getGameData(DataKey.NPC.filename, 'drop_item', 'item_name', itemInfo.name).then(function(list){

            var npcList = [];

            list.forEach(function(item){
              var npcInfo = GameData.getAttributes(item.node.parentNode);
              npcList.push({
                npc_id: npcInfo.npc_id,
                code_name: npcInfo.code_name,
                npc_name: npcInfo.local_name,
                rate: item.rate+'%',
                min_count: item.min_count,
                max_count: item.max_count
              });
            });

            promise.resolve( npcList );

         });

        });

        return promise;

      },
      getDropTable : function( search, keyword ){

        var promise = Promise();

        DataKey.Item.find(search, keyword).then(function(){

          var itemInfo = arguments[0][0];

          GameData.getGameData(DataKey.ItemDropTable.filename, 'itemAndCondition', 'drop_item', itemInfo.name).then(function(list){

            var tableList = [];

            list.forEach(function(item){
              var tableInfo = GameData.getAttributes(item.node.parentNode);
              tableList.push(
                $.extend({table_id: tableInfo.table_id, name: tableInfo.name}, item)
              );
            });

            promise.resolve( tableList );

          });

        });

        return promise;

      }
    };

  };

});

})(jQuery, this, this.document);
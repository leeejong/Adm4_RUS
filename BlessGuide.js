/**
 * BlessGuide
 * ADM 4.0 JavaScript Menu
 * @author bitofsky@neowiz.com 2014.06.23
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
define(['beans/Bless/BlessGameData', 'adm/adm.sendProcess'], function( GameData, sendProcess ){

  GameData.debug = false;

  var DataKey = GameData.DataKey;

  var info_guide_type = {
    2: '아이템',
    3: '몬스터',
    4: '퀘스트'
  };

  /**
   * BlessGuide Menu
   * @param {mixed} arg1
   * @param {mixed} arg2
   */
  return function BlessGuide( arg1, arg2 ){

    var menu = this;

    var $type = $E('select').selectOptions(info_guide_type, {sort:false}),
        $load = $E('button').text('불러오기').button().click( fnLoad ),
        $clear = $E('button').text('검색엔진 비우기').button().click( fnSeClear );

    menu.append( $type, $load, $clear );

    function fnLoad(){

      var guide_type = +$type.val();

      switch( guide_type ){
        case 2 : fnLoadItem( guide_type );    break;
        case 3 : fnLoadMonster( guide_type ); break;
        case 4 : fnLoadQuest( guide_type );   break;
      }

    }

    function fnSeClear(){

      var guide_type = +$type.val();

      if (!confirm('이 유형의 검색엔진 데이터를 모두 삭제 합니까?')) return;

      menu.ajaxAsync('deleteGuideTypeSearchEngine', guide_type);

    }

    function fnLoadItem( guide_type ){

      var sendList = [];

      // 연관 퀘스트, 드랍 몬스터 취합이 끝나면 가이드 구성
      Promise(getItemDropInfo(), getItemQuestInfo()).then(function(dropInfo, rewardQuest){

        GameData.getGameDataList('Item').then(function( list ){

          list.forEach(function( o ){

            var send = {
              guide_type   : guide_type,
              category     : info_guide_type[guide_type],
              category_sub : o.equip_cat1,
              title        : o.name_k,
              1  : o.item_id,
              2  : o.name,
              3  : o.name_k,
              4  : o.equip_cat1,
              5  : o.equip_cat2,
              6  : o.equip_cat3,
              7  : o.grade,
              8  : o.usable_class,
              9  : o.usable_minlv,
              10 : o.usable_maxlv,
              11 : o.sell_price,
              12 : o.buy_price,
              13 : o.min_wp_damage,
              14 : o.max_wp_damage,
              15 : o.min_wp_spell_damage,
              16 : o.max_wp_spell_damage,
              17 : o.parry_amount,
              18 : o.armor,
              19 : (dropInfo.mapItemNpc[o.item_id] || []).join(','),      // 드랍 몬스터
              20 : (rewardQuest.mapItemQuest[o.item_id] || []).join(','), // 보상 퀘스트
              text : o.description_k,
              list : {
                10034701: '드랍 몬스터',
                10034702: '연관 퀘스트'
              }
            };

            sendList.push( send );

          });

          sendProcess(sendList, {
            title          : 'Bless 피망 가이드 동기화 프로세스 :: '+info_guide_type[guide_type],
            menu           : menu,
            methodcall     : 'syncGuide',
            arrayArguments : false,
            field          : [1,2,3],
            onComplete     : function(){
              searchEngineCommit(guide_type);
            }
          });

        });

      });

    }

    function fnLoadMonster( guide_type ){

      var sendList = [];

      // 드랍 아이템 취합이 끝나면 가이드 구성
      getItemDropInfo().then(function(dropInfo){

        GameData.getGameDataList('NPC').then(function( list ){

          list.forEach(function( o ){

            if( o.npc_category != 'monster' ) return;

            var sendItem = {
              guide_type   : guide_type,
              category     : info_guide_type[guide_type],
              category_sub : 'MonsterLevel ' + o.level,
              title        : o.local_name,
              1            : o.npc_id,
              2            : o.code_name,
              3            : o.local_name,
              4            : o.level,
              5            : o.exp_acquired,
              6            : o.drop_money,
              7            : o.aggressive_type,
              8            : o.attack_judge_type,
              9            : o.attack_damage_type,
              10           : (dropInfo.mapNpcItem[o.npc_id] || []).join(','), // 드랍 아이템
              text         : o.description,
              list         : {
                10034703: '드랍 아이템'
              }
            };

            sendList.push( sendItem );

          });

          sendProcess(sendList, {
            title          : 'Bless 피망 가이드 동기화 프로세스 :: '+info_guide_type[guide_type],
            menu           : menu,
            methodcall     : 'syncGuide',
            arrayArguments : false,
            field          : [1,2,3],
            onComplete     : function(){
              searchEngineCommit(guide_type);
            }
          });

        });

      });

    }

    function fnLoadQuest( guide_type ){

      var sendList = [];

      // 드랍 아이템 취합이 끝나면 가이드 구성
      getItemQuestInfo().then(function(rewardQuest){

        GameData.getGameDataList('Quest').then(function( list ){

          list.forEach(function( o ){

            var sendItem = {
              guide_type   : guide_type,
              category     : info_guide_type[guide_type],
              category_sub : 'QuestLevel ' + o.level_recommended,
              title        : o.localname,
              1            : o.quest_id,
              2            : o.name,
              3            : o.localname,
              4            : o.share_group,
              5            : o.acceptable_class_list,
              6            : o.level_min,
              7            : o.level_max,
              8            : o.level_recommended,
              9            : o.recommended_PC_number,
              10           : o.reward_money,
              11           : o.reward_experience,
              12           : (rewardQuest.mapQuestItem[o.quest_id] || []).join(','), // 보상 아이템
              text         : o.text_objective_summary,
              list         : {
                10034704: '보상 아이템'
              }
            };

            sendList.push( sendItem );

          });

          sendProcess(sendList, {
            title          : 'Bless 피망 가이드 동기화 프로세스 :: '+info_guide_type[guide_type],
            menu           : menu,
            methodcall     : 'syncGuide',
            arrayArguments : false,
            field          : [1,2,3],
            onComplete     : function(){
              searchEngineCommit(guide_type);
            }
          });

        });

      });

    }

    function searchEngineCommit( guide_type ){

      return menu.ajaxAsync('refreshGuide', guide_type);

    }

    /**
     * 퀘스트 아이템 보상 조회
     * @returns {Promise}
     */
    function getItemQuestInfo(){

      if( getItemQuestInfo.promise ) return getItemQuestInfo.promise;

      getItemQuestInfo.promise = Promise(
        GameData.getGameDataNameMap('Item', DataKey.Item.code, DataKey.Item.id),
        GameData.getGameData(DataKey.Quest.filename, 'reward_fix'),
        GameData.getGameData(DataKey.Quest.filename, 'reward_selective')
      ).then(function( itemNameIdMap, fixList, selectiveList ){

        var mapItemQuest = {},
            mapQuestItem = {};

        [fixList, selectiveList].forEach(function(list){
          list.forEach(function( item ){

            var item_id  = itemNameIdMap[item.item],
                quest_id = $(item.node).parent().attr('quest_id');

            if( !item_id || !quest_id ) return;

            if( !mapItemQuest[item_id] )  mapItemQuest[item_id]  = [];
            if( !mapQuestItem[quest_id] ) mapQuestItem[quest_id] = [];

            mapItemQuest[item_id].push( quest_id );
            mapQuestItem[quest_id].push( item_id );

          });
        });

        return {
          mapItemQuest: mapItemQuest,
          mapQuestItem: mapQuestItem
        };

      });

      return getItemQuestInfo.promise;

    }

    /**
     * 아이템 몬스터 드랍 정보 조회
     * @returns {Promise}
     */
    function getItemDropInfo(){

      if( getItemDropInfo.promise ) return getItemDropInfo.promise;

      getItemDropInfo.promise = Promise(

        GameData.getGameDataNameMap('Item', DataKey.Item.code, DataKey.Item.id),


        // 몬스터 고유 드랍 아이템 찾기
        GameData.getGameData(DataKey.NPC.filename, 'drop_table').then(function( tableList ){

          var npcDropTables = {}; // table_name : [npc_id]

          tableList.forEach(function( table ){
            if( !npcDropTables[ table.table_name ] ) npcDropTables[ table.table_name ] = [];
            npcDropTables[ table.table_name ].push( $(table.node).parent().attr('npc_id') );
          });

          return npcDropTables;

        }),

        // 아이템 드랍 테이블에서 몬스터 찾기
        GameData.getGameData(DataKey.NPC.filename, 'drop_item').then(function(dropList){

          var itemNameNpc = {};

          dropList.forEach(function( item ){

            if( !itemNameNpc[ item.item_name ] ) itemNameNpc[ item.item_name ] = [];

            itemNameNpc[ item.item_name ].push( $(item.node).parent().attr('npc_id') );

          });

          return itemNameNpc;

        }),

        // 드랍 테이블 아이템 리스트
        GameData.getGameData(DataKey.ItemDropTable.filename, 'itemAndCondition')

      ).then(function(itemNameIdMap, npcDropTables, itemNameNpc, dropItems){ // 고유 드랍과 드랍 테이블의 정보를 mix 하며 npcDropTable 정보 생성

        var mapItemNpc = {},
            mapNpcItem = {};

        dropItems.forEach(function( item ){

          var table_name = $(item.node).parent().attr('name'),
              item_name  = item.drop_item;

          if( !itemNameNpc[item_name] ) itemNameNpc[item_name] = [];

          if( !npcDropTables[table_name] ) return;

          npcDropTables[table_name].forEach(function(npc_id){

            itemNameNpc[item_name].push(npc_id);

          });

        });

        $.each(itemNameNpc, function( item_name, npcList ){

          var item_id = itemNameIdMap[item_name];

          npcList.forEach(function(npc_id){

            if( !mapItemNpc[ item_id ] ) mapItemNpc[ item_id ] = [];
            if( !mapNpcItem[ npc_id ] )  mapNpcItem[ npc_id ]  = [];

            mapItemNpc[ item_id ].push( npc_id );
            mapNpcItem[ npc_id ].push( item_id );

          });

        });

        return {
          mapItemNpc: mapItemNpc,
          mapNpcItem: mapNpcItem
        };

      });

      return getItemDropInfo.promise;

    }



  };

});

})(jQuery, this, this.document);
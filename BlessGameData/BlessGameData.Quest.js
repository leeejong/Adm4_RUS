/**
 * BlessGameData.Item
 * 블레스 게임데이터 뷰어 - 퀘스트
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
     * Quest 정보
     */
    DataKey.Quest = {
      filename: 'QuestInfo',
      nodename: 'questInfo',
      id: 'quest_id',
      code: 'name',
      name: 'local_name',
      tag: {questname:'local_name', questid:'quest_id'},
      getObjective: function(node){

        var attr        = GameData.getAttributes(node),
            nodeName    = attr.node.nodeName,
            obj         = {
              summary   : attr.summary,
              essencial : node.parentNode.nodeName == 'essencial_objective',
              target    : attr.npc ? '<npcName:'+attr.npc+'><br/>' : '',
              type      : nodeName,
              detail    : attr.count ? ' X '+attr.count : ''
            };

        switch( nodeName ){
          case 'dealDamage':
            obj.detail = 'HP '+attr.hp_ratio+'% 이하';
            break;
          case 'enterTerritory':
            obj.target = attr.territory;
            break;
          case 'interact':
            obj.target = '<propName:'+attr.prop+'>';
            break;
          case 'kill':
          case 'kill2':
          case 'kill3':
            obj.type = 'kill';
            obj.target += attr.npc1 ? '<npcName:'+attr.npc1+'><br/>' : '';
            obj.target += attr.npc2 ? '<npcName:'+attr.npc2+'><br/>' : '';
            obj.target += attr.npc3 ? '<npcName:'+attr.npc3+'><br/>' : '';
            break;
          case 'useitem':
          case 'getitem':
            obj.target = '<itemName:'+attr.item+'>';
            break;
          case 'aquireSkill':
            obj.target = '<pcskillName:'+attr.skill+'>';
            break;

        }

        return obj;

      },
      detail: function(search, key){

        switch(search){
          case 'quest_id':
          case 'name'    :
            return GameData.getGameData(DataKey.Quest.filename, DataKey.Quest.nodename, search, key, '=').then( makeTab );
        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var questInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '퀘스트 정보',
              contents: function(){

                var nGiver           = $(questInfo.node).find('quest_giver').children(),
                    nRewarder        = $(questInfo.node).find('quest_rewarder').children(),
                    nAcceptCondition = $(questInfo.node).find('accept_condition'),
                    nObjective       = $(questInfo.node).find('essencial_objective').children().add( $(questInfo.node).find('bonus_objective').children() ),
                    arrAC            = [],
                    arrRAC           = [],
                    arrObjective     = [],
                    arrQuestItem     = [];

                // 선행 조건
                nAcceptCondition.each(function(idx, node){
                  arrAC.push({
                    quest_name: '<questName:'+$(node).attr('quest_cid')+'>',
                    condition_type: $(node).attr('quest_condition_type')
                  });
                });

                // 수행 목표
                nObjective.each(function(idx, node){
                  arrObjective.push(
                    DataKey.Quest.getObjective(node)
                  );
                });

                // 이 퀘스트를 선행 조건으로 하는 연계 퀘스트
                GameData.getGameData(DataKey.Quest.filename, 'accept_condition','quest_cid',questInfo.name).then(function(list){
                  list.forEach(function(attr){
                    arrRAC.push({
                      quest_name: '<questName:'+$(attr.node.parentNode).attr('name')+'>',
                      condition_type: attr.quest_condition_type
                    });
                  });
                });

                // 몬스터에게서 얻는 퀘스트 아이템
                $(questInfo.node).find('drop_item_list').each(function(idx, node){

                  var attr = GameData.getAttributes(node);

                  arrQuestItem.push({
                    target: attr.npc,
                    type: 'npc',
                    item: attr.item,
                    rate: attr.rate,
                    count: attr.count
                  });

                });

                // 상호작용으로 얻는 퀘스트 아이템
                $(questInfo.node).find('interact_prop_list').each(function(idx, node){

                  var attr = GameData.getAttributes(node);

                  arrQuestItem.push({
                    target: attr.prop,
                    type: 'prop',
                    item: attr.item,
                    rate: attr.rate,
                    count: attr.count
                  });

                });

                var quest_giver      = nGiver[0].nodeName == 'NPC' ? GameData.parseLinkName('<npcName:'+nGiver.attr('npc_type')+'>') : '자동 수락',
                    quest_rewarder   = nGiver[0].nodeName == 'NPC' ? GameData.parseLinkName('<npcName:'+nRewarder.attr('npc_type')+'>') : '자동 종료';

                var $content = $E('div');

                var $tInfo = $adm.clientTable([questInfo], {
                  width: 600,
                  title: '기본 정보',
                  field: ['quest_id','name','local_name','quest_type','time_limit','acceptable_race_list'],
                  head: DESC.QuestInfo,
                  translate: DESC.QuestInfo_TYPES,
                  sort: false,
                  footer: false
                });

                var $tDesc = $adm.clientTable([questInfo], {
                  width: 600,
                  field: ['name'],
                  head: DESC.QuestInfo,
                  translate_realtime: {
                    name: function( v ){
                      return GameData.parseLinkName(v).css({'max-height':100, display:'block', 'overflow-y':'auto'});
                    }
                  },
                  nowrap: false,
                  sort: false,
                  footer: false
                });

                var $tObjective = $adm.clientTable(arrObjective, {
                  width: '100%',
                  title: '수행 목표 상세',
                  field: ['summary','essencial','target','type','detail'],
                  head: {summary:'설명',essencial:'필수 여부',target:'대상',type:'수행 유형',detail:'상세'},
                  sort: false,
                  footer: false,
                  column_width: [null,null,null,100,100],
                  translate: {
                    type: DESC.infoQuestObjectiveType,
                    essencial: {
                      'true'  : '필수',
                      'false' : '보너스'
                    }
                  },
                  translate_realtime: {
                    summary: GameData.parseLinkName,
                    target: GameData.parseLinkName
                  }

                });

                var $tAcceptCondition = $adm.clientTable(arrAC, {
                  width: '100%',
                  title: '선행 퀘스트 조건',
                  sort: false,
                  footer: false,
                  column_width: [400],
                  head: {quest_name:'퀘스트 이름', condition_type:'조건'},
                  translate: {
                    condition_type: DESC.infoQuestConditionType
                  },
                  translate_realtime: {
                    quest_name: GameData.parseLinkName
                  }
                });

                var $tRelateAcceptCondition = $adm.clientTable(arrRAC, {
                  width: '100%',
                  title: '연계 퀘스트',
                  sort: false,
                  footer: false,
                  column_width: [400],
                  head: {quest_name:'퀘스트 이름', condition_type:'조건'},
                  translate: {
                    condition_type: DESC.infoQuestConditionType
                  },
                  translate_realtime: {
                    quest_name: GameData.parseLinkName
                  }

                });

                var $tQuestItem = $adm.clientTable(arrQuestItem, {
                  width: '100%',
                  title: '퀘스트 아이템 입수 방법',
                  field: ['target','item','rate','count'],
                  head: {target:'입수 대상',item:'아이템 이름',rate:'입수 확률',count:'수량'},
                  translate: {
                    rate: function(v){ return v + '%'; }
                  },
                  add_column: {
                    target: function(row){ return '<'+row.type+'Name:'+row.target+'>'; },
                    item: function(row){ return '<itemName:'+row.item+'>'; }
                  },
                  translate_realtime: {
                    target: GameData.parseLinkName,
                    item: GameData.parseLinkName
                  }
                });

                if( !arrQuestItem.length ) $tQuestItem.hide();

                var $tEtc = $adm.verticalTable([[
                  quest_giver, quest_rewarder
                ]], {
                  width: 600,
                  head: ['퀘스트 수락지','퀘스트 종료지']
                });

                return $content.append(
                  $tInfo, $tDesc, $tObjective, $tQuestItem, $tAcceptCondition, $tRelateAcceptCondition, $tEtc
                );

              }
            },
            {
              name: '기타 정보',
              select: function(tab){

                var arrFixItems = [],
                    arrSelectiveItems = [];

                // 고정 보상 아이템
                $(questInfo.node).find('reward_fix').each(function(idx, node){
                  arrFixItems.push( GameData.getAttributes(node) );
                });

                // 선택 보상 아이템
                $(questInfo.node).find('reward_selective').each(function(idx, node){
                  arrSelectiveItems.push( GameData.getAttributes(node) );
                });

                $E('div').clientTable([questInfo], {
                  width: 600,
                  title: '수행 난이도',
                  field: ['level_min','level_max','level_recommended','recommended_pc_number'],
                  head: DESC.QuestInfo,
                  translate: DESC.QuestInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([questInfo], {
                  width: '100%',
                  title: '보상',
                  field: ['reward_money','reward_experience','bonus_reward_money','bonus_reward_experience'],
                  head: DESC.QuestInfo,
                  translate: DESC.QuestInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable(arrFixItems, {
                  width: '100%',
                  title: '고정 보상 아이템',
                  field: ['pcclass','item','count'],
                  head: {
                    pcclass: '클래스',
                    item: '아이템 이름',
                    count: '수량'
                  },
                  column_width: [null, null, 50],
                  add_column: {
                    item: function(row){ return '<itemName:'+row.item+'>'; }
                  },
                  translate: {
                    pcclass: DESC.infoClassType2,
                    item: GameData.parseLinkName
                  },
                  sort: false,
                  footer: false
                })
                .clientTable(arrSelectiveItems, {
                  width: '100%',
                  title: '선택 보상 아이템',
                  field: ['pcclass','item','count'],
                  head: {
                    pcclass: '클래스',
                    item: '아이템 이름',
                    count: '수량'
                  },
                  column_width: [null, null, 50],
                  add_column: {
                    item: function(row){ return '<itemName:'+row.item+'>'; }
                  },
                  translate: {
                    pcclass: DESC.infoClassType2,
                    item: GameData.parseLinkName
                  },
                  sort: false,
                  footer: false
                })
                .clientTable([questInfo], {
                  width: '100%',
                  title: '기타',
                  field: ['repeatable','repeatcount','max_repeatcount','abandon_possible','sequential_objective','selective_count'],
                  head: DESC.QuestInfo,
                  translate: DESC.QuestInfo_TYPES,
                  sort: false,
                  footer: false
                }).appendTo( tab.empty() );

              }
            }
          ]);
        }

      }
    };

  };

});

})(jQuery, this, this.document);
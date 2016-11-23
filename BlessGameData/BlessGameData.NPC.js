/**
 * BlessGameData.Item
 * 블레스 게임데이터 뷰어 - NPC
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
     * NPC 정보
     */
    DataKey.NPC = {
      filename: 'NPCInfo',
      nodename: 'npcInfo',
      id: 'npc_id',
      code: 'code_name',
      name: 'local_name',
      tag: {npcname:'code_name', npcid:'npc_id'},
      detail: function(search, keyword){

        switch(search){
          case 'code_name':
          case 'npc_id':
            return GameData.getGameData(DataKey.NPC.filename, DataKey.NPC.nodename, search, keyword, '=').then( makeTab );

        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var npcInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: 'NPC 기본 정보',
              contents: function(){
                return $E('div').clientTable([npcInfo], {
                  width: 600,
                  title: '기본 정보',
                  field: ['npc_id','code_name','local_name','npc_category','faction','society','level'],
                  head: DESC.NPCInfo,
                  translate: DESC.NPCInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([npcInfo], {
                  width: '100%',
                  title: '습득',
                  field: ['exp_acquired','drop_money','drop_money_ratio','drop_money_range'],
                  head: DESC.NPCInfo,
                  translate: DESC.NPCInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([npcInfo], {
                  width: '100%',
                  title: '유져 식별',
                  field: ['can_recognize','visible_range','visible_fov_angle','audible_range'],
                  head: DESC.NPCInfo,
                  translate: DESC.NPCInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([npcInfo], {
                  width: '100%',
                  title: '공격 관련',
                  field: ['aggressive_type','attack_judge_type','attack_damage_type'],
                  head: DESC.NPCInfo,
                  translate: DESC.NPCInfo_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([npcInfo], {
                  width: '100%',
                  title: '사용 스킬',
                  field: ['skill_list'],
                  head: DESC.NPCInfo,
                  translate_realtime: {
                    skill_list: function(v){
                      var tag = '';
                      (v||'').split(' ').forEach(function(code_name){ tag += '<pcskillName:'+code_name+'> '; });
                      return GameData.parseLinkName(tag);
                    }
                  },
                  sort: false,
                  footer: false
                });
              }
            },
            {
              name: '스테이터스',
              select: function( tab ){

                var status = GameData.getAttributes( $(npcInfo.node).children('paramInfo')[0] );

                tab.empty().clientTable([status], {
                  width: 600,
                  title: '기본 정보',
                  field: ['max_hp','max_mp','hp_regen','mp_regen','haste'],
                  //head: DESC.NPCInfoStatus,
                  //translate: DESC.NPCInfoStatus_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([status], {
                  width: '100%',
                  title: '공격 정보',
                  field: ['attack_power','critical_chance','hit_chance','weapon_attackperiod','weapon_damage'],
                  //head: DESC.NPCInfoStatus,
                  //translate: DESC.NPCInfoStatus_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([status], {
                  width: '100%',
                  title: '방어 정보',
                  field: ['armor','block_chance','block_reduce','dodge_chance','parry_amount','parry_chance','resist'],
                  //head: DESC.NPCInfoStatus,
                  //translate: DESC.NPCInfoStatus_TYPES,
                  sort: false,
                  footer: false
                }).clientTable([status], {
                  width: '100%',
                  title: '스펠 정보',
                  field: ['spell_critical_chance','spell_hit_chance','spell_power','spell_resist_chance'],
                  //head: DESC.NPCInfoStatus,
                  //translate: DESC.NPCInfoStatus_TYPES,
                  sort: false,
                  footer: false
                });

              }
            },
            {
              name: '아이템 드랍',
              select: function( tab ){

                var dropTable      = [],
                    dropList       = [],
                    $dropTableArea = $E('div').css({
                      width: '100%',
                      'max-height': 300,
                      'overflow-y': 'auto'
                    }),
                    $loading       = $E('loading').appendTo( $dropTableArea );

                $(npcInfo.node).find('drop_item').each(function(idx, node){

                  dropList.push( GameData.getAttributes(node) );

                });

                tab.empty().clientTable(dropList, {
                  title: '드랍 아이템',
                  width: 1000,
                  field: ['item_name','rate','min_count','max_count'],
                  head: DESC.NPCInfoDropItem,
                  translate: {
                    rate: function(v){ return v + '%'; }
                  },
                  add_column: {
                    item_name: function(row){ return '<itemName:'+row.item_name+'>'; }
                  },
                  translate_realtime: {
                    item_name: GameData.parseLinkName
                  }
                }).append( $dropTableArea );

                $adm(npcInfo.node).find('drop_table').isEmpty(function(){
                  $loading.remove();
                }).each(function(idx, node){

                  var npcDropTable = GameData.getAttributes(node);

                  DataKey.ItemDropTable.getDropItemTable( npcDropTable.table_name ).then(function($table){

                    $loading.remove();

                    $table
                      .clientTable('setOptions', {
                        pagesize: 0,
                        caption: GameData.parseLinkName( $adm.sprintf('드랍 테이블 : <itemDropTableName:%s>, 드랍 테이블 확률 : %f%', npcDropTable.table_name, npcDropTable.rate) )
                      })
                      .clientTable('drawTableContents')
                      .appendTo( $dropTableArea );

                  });

                });

              }
            },
            {
              name: '연관 퀘스트',
              select: function( tab ){

                var questList = [],
                    questMap  = {};

                GameData.getGameData(DataKey.Quest.filename, '[npc_type=":codename"], [npc=":codename"], [npc1=":codename"], [npc2=":codename"], [npc3=":codename"]'.replace(/\:codename/g, npcInfo.code_name)).then(function(list){

                  list.forEach(function(o){

                    var quest, relation, detail, summary;

                    switch( true ){

                      case o.node.parentNode.nodeName == 'quest_giver' || o.node.parentNode.nodeName == 'quest_rewarder':
                        quest    = GameData.getAttributes(o.node.parentNode.parentNode);
                        relation = o.node.parentNode.nodeName == 'quest_giver' ? '퀘스트 수락지' : '퀘스트 종료지';
                        summary  = '';
                        detail   = '';
                        break;

                      case o.node.nodeName == 'drop_item_list':
                        quest    = GameData.getAttributes(o.node.parentNode);
                        relation = '퀘스트 아이템 드랍';
                        summary  = '';
                        detail   = $adm.sprintf('<itemName:%s> %d% * %d개', o.item, o.rate, o.count);
                        break;

                      case o.node.parentNode.nodeName == 'essencial_objective' || o.node.parentNode.nodeName == 'bonus_objective' :
                        quest    = GameData.getAttributes(o.node.parentNode.parentNode);
                        relation = o.node.parentNode.nodeName == 'essencial_objective' ? '퀘스트 필수 조건' : '퀘스트 보너스 조건';
                        summary  = o.summary;
                        detail   = '';
                        break;

                    }

                    if( !quest ) return;

                    questList.push({
                      quest_id: quest.quest_id,
                      name: quest.name,
                      localname: quest.localname,
                      relation: relation,
                      summary: summary,
                      detail: detail
                    });

                  });

                  tab.empty().clientTable(questList, {
                    width: 600,
                    field: ['quest_id','name','localname','relation','summary','detail'],
                    translate: {
                      quest_id: function(v, cname, row){
                        return GameData.getDetailLink('Quest', v, 'quest_id', v);
                      }
                    },
                    translate_realtime: {
                      summary : GameData.parseLinkName,
                      detail  : GameData.parseLinkName
                    }
                  });

                });

              }
            },

            {
              name: '대화',
              select: function( tab ){

                GameData.getGameData(DataKey.Dialog.filename, DataKey.Dialog.nodename, 'npc_codename', npcInfo.code_name).then(function(list){

                  tab.empty().append( makeDialogInfo(list) );

                });

                function makeDialogInfo( list ){

                  return $adm.clientTable(list, {
                    title: 'NPC 대화 목록',
                    width: 600,
                    field: ['dialog_id','code_name','category','priority','show_questtype','show_questid','condition'],
                    head: $.extend(true, {
                      condition: '노출 조건'
                    }, DESC.DialogInfo),
                    use_html: true,
                    add_column: {
                      condition: function(row){

                        var ret = '';

                        $(row.node).find('condition').children().each(function(idx, cond){

                          var attr     = GameData.getAttributes(cond) || {},
                              nodeName = cond.nodeName,
                              relative = DESC.DialogInfo_Condition[nodeName];

                          if( attr.quest )     relative += ' <questName:'+attr.quest+'>';
                          else if( attr.item ) relative += ' <itemName:'+attr.item+'>';

                          ret += relative ? relative+'<br/>' : '';

                        });

                        return ret;

                      }
                    },
                    translate: {
                      dialog_id: function(v, cname, row){
                        return GameData.getDetailLink('Dialog', v, 'dialog_id', v);
                      }
                    },
                    translate_realtime: {
                      condition : GameData.parseLinkName
                    }
                  });

                }

              }
            }

          ]);

        }

      }
    };

  };

});

})(jQuery, this, this.document);
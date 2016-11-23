/**
 * BlessGameDataViewer
 * ADM 4.0 JavaScript Menu
 * @author bitofsky@neowiz.com 2013.06.05
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
define(['beans/Bless/BlessGameData','beans/Bless/BlessDesc'], function(GameData, DESC){

  /**
   * BlessGameDataViewer Menu
   * @param {mixed} arg1
   * @param {mixed} arg2
   */
  return function BlessGameDataViewer( arg1, arg2 ){

    var menu = this;

    menu.buttonTab([

      {
        name: 'Item',
        select: function( tab ){

          GameData.getGameDataList('Item').then(function( result ){

            tab.empty().clientTable(result, {
              pagesize: 20,
              field: ['item_id','name','name_k','description_k','icon_index','effect_charges','bondingtype','equip_cat1','equip_cat2','equip_cat3','grade','usable_class','usable_minlv','usable_maxlv','enable_sale','buy_price','sell_price','destroyable','stackable','max_holding_count','min_wp_damage','max_wp_damage','min_wp_spell_damage','max_wp_spell_damage','wp_attackperiod','parry_amount','armor','resist','attack_power','spell_power','hit_rating','dodge_rating','parry_rating','block_rating','block_reduce_rating','critical_rating','haste_rating','resist_rating','strength','agility','intelligence','wisdom','stamina','energy','valor','technique','concentration','will','domination','conviction','insight','disappear_on_exhaust'],
              head: DESC.ItemInfo,
              translate: DESC.ItemInfo_TYPES,
              translate_realtime: {
                item_id: function(v, cname, row){

                  return GameData.getDetailLink('Item', v, 'item_id', v);

                }
              },
              width: '100%',
              filter_view: true
            });

          });

        }
      },

      {
        name: 'NPC',
        select: function( tab ){

          GameData.getGameDataList('NPC').then(function( result ){

            tab.empty().clientTable(result, {
              pagesize: 20,
              field: ['npc_id','code_name','local_name','npc_category','faction','society','level',/*'skill_list',*/'can_recognize','visible_range','visible_fov_angle','audible_range','exp_acquired','drop_money','drop_money_ratio','drop_money_range','aggressive_type','attack_judge_type','attack_damage_type'],
              head: DESC.NPCInfo,
              translate: DESC.NPCInfo_TYPES,
              translate_realtime: {
                skill_list: function(v){
                  return GameData.parseLinkName( GameData.getDataTagSplit('skillName',v, ' ') );
                },
                npc_id: function(v, cname, row){

                  return GameData.getDetailLink('NPC', v, 'npc_id', v);

                }
              },
              width: '100%',
              filter_view: true
            });

          });

        }
      },

      {
        name: 'ItemDropTable',
        select: function( tab ){

          $.when(
            GameData.getGameDataList('ItemDropTable'),
            GameData.getGameDataNameMap('Item','name')
          ).then(function( result, itemNameMap ){

            result.forEach(function(table){

              table.item_list = '';

              var itemKeys = {};

              $(table.node).children().each(function(){
                var item_name = $(this).attr('drop_item');
                if( !itemKeys[item_name] ){
                  table.item_list += '<itemName:'+item_name+':'+itemNameMap[item_name]+'><br/>';
                  itemKeys[item_name] = true;
                }
              });

            });

            tab.empty().clientTable(result, {
              pagesize: 5,
              field: ['table_id','name','item_list'],
              sort_field: 'name',
              head: DESC.ItemDropTable,
              translate: DESC.ItemDropTable_TYPES,
              translate_realtime: {
                table_id: function(v, cname, row){

                  return GameData.getDetailLink('ItemDropTable', v, 'table_id', v);

                },
                item_list: GameData.parseLink
              },
              width: '100%',
              filter_view: true
            });

          });

        }
      },

      {
        name: 'QUEST',
        select: function( tab ){

          GameData.getGameDataList('Quest').then(function( result ){

            tab.empty().clientTable(result, {
              pagesize: 20,
              field: ['quest_id','name','local_name','text_objective_summary','level_min','level_max','level_recommended','recommended_pc_number','quest_type','time_limit','acceptable_race_list','reward_money','reward_experience','bonus_reward_money','bonus_reward_experience','repeatable','repeatcount','max_repeatcount','abandon_possible','sequential_objective','selective_count'],
              head: DESC.QuestInfo,
              translate: DESC.QuestInfo_TYPES,
              translate_realtime: {
                quest_id: function(v, cname, row){

                  return GameData.getDetailLink('Quest', v, 'quest_id', v);

                },
                name: GameData.parseLinkName
              },
              width: '100%',
              filter_view: true
            });

          });

        }
      },

      {
        name: 'PCSkill',
        select: function( tab ){

          GameData.getGameDataList('PCSkill').then(function( result ){

            debug( result );

            tab.empty().clientTable(result, {
              pagesize: 20,
              field: ['skill_id','code_name', 'local_name', 'skill_group', 'skill_grade', 'description', 'pc_level', 'class_type', 'invokable_item_type', 'miss_chance', 'invokable_target_rc_state', 'mobilitytype', 'cooltime', 'applygcd', 'cooldowngroup', 'aggropoint', 'begin_normal_auto_attack', 'interact_prop', 'category_type', 'passivemastery', 'skillcharge', 'auto_firable', 'move_cast', 'move_firing'],
              sort_field: ['local_name'],
              head: DESC.SkillInfo,
              translate: DESC.SkillInfo_TYPES,
              translate_realtime: {
                skill_id: function(v, cname, row){

                  return GameData.getDetailLink('PCSkill', v, 'skill_id', v);

                }
              },
              width: '100%',
              filter_view: true
            });

          });

        }
      },

      {
        name: 'MonsterBook',
        select: function( tab ){

          GameData.getGameDataList('MonsterBook').then(function( result ){

            debug( result );

            tab.empty().clientTable(result, {
              pagesize: 20,
              field: ['id', 'name', 'local_name', 'location', 'open_quest_name'],
              sort_field: ['id'],
              head: DESC.MonsterBookInfo,
              translate_realtime: {
                local_name: function(v, cname, row){

                  return GameData.getDetailLink('MonsterBook', v, 'id', row.id);

                },
                open_quest_name: function(v, cname, row){
                  if( !v ) return '';
                  return $adm.joinElements.apply(this, v.split(' ').map(function( questname ){
                    return GameData.parseLinkName('<questName:'+questname+'><br/>');
                  }));
                }
              },
              width: '100%',
              filter_view: true
            });

          });

        }
      },

      {
        name: 'DestinationPointReference',
        select: function( tab ){

          GameData.getGameDataList('DestinationPointReference').then(function(result){
            tab.empty().clientTable(result, {
              field: ['id', 'name', 'localname', 'x','y','z','worldtype','worldmapwrappercid','worldmapcid'],
              translate: {
                id: function(v, cname, row){
                  return GameData.parseLinkName('<destinationpoint_id:'+v+'>');
                }
              }
            });
          });
        }
      },

      {
        name: 'Mount',
        select: function( tab ){
          GameData.getGameDataList('Mount').then(function(result){
            tab.empty().clientTable(result, {
              field: ['mount_id', 'code_name', 'local_name'],
              translate: {
                mount_id: function(v, cname, row){
                  return GameData.parseLinkName('<mount_id:'+v+'>');
                }
              }
            });
          });
        }
      },
      {
        name: 'Pet',
        select: function( tab ){
          GameData.getGameDataList('Pet').then(function(result){
            tab.empty().clientTable(result, {
              field: ['pet_id', 'code_name', 'local_name'],
              translate: {
                mount_id: function(v, cname, row){
                  return GameData.parseLinkName('<pet_id:'+v+'>');
                }
              }
            });
          });
        }
      },
      {
        name: 'Fellow',
        select: function( tab ){
          GameData.getGameDataList('Fellow').then(function(result){
            tab.empty().clientTable(result, {
              field: ['fellow_id', 'code_name', 'local_name'],
              translate: {
                mount_id: function(v, cname, row){
                  return GameData.parseLinkName('<fellow_id:'+v+'>');
                }
              }
            });
          });
        }
      },

    ],{active:0});



  };

});

})(jQuery, this, this.document);
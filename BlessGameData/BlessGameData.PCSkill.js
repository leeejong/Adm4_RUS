/**
 * BlessGameData.Item
 * 블레스 게임데이터 뷰어 - PC스킬
 * @author bitofsky@neowiz.com 2014.01.23
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
     * Skill 정보
     */
    DataKey.PCSkill = {
      filename: 'PCSkillInfo',
      nodename: 'pcSkillInfo',
      id: 'skill_id',
      code: 'code_name',
      name: 'local_name',
      tag: {pcskillname:'code_name', pcskillid:'skill_id'},
      detail: function(search, keyword){

        switch(search){
          case 'code_name':
          case 'skill_id':
            return GameData.getGameData(DataKey.PCSkill.filename, DataKey.PCSkill.nodename, search, keyword, '=').then( makeTab );

        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var skillInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '스킬 기본 정보',
              contents: function(){

                var tab = $E('div');

                return tab.clientTable([skillInfo], {
                  width: 1000,
                  sort: false,
                  footer: false,
                  title: '스킬 정보',
                  field: ['skill_id','code_name','local_name','skill_level','pc_level','icon_index','tooltip_template'],
                  head: DESC.SkillInfo,
                  translate: DESC.SkillInfo_TYPES
                }).clientTable([skillInfo], {
                  width: '100%',
                  sort: false,
                  footer: false,
                  field: ['description'],
                  head: DESC.SkillInfo,
                  nowrap: false,
                  translate: {
                    description: function( v ){
                      if (v != undefined)
                        return GameData.parseLinkName(v.replace(/skillname/g, 'pcskillname')).css({'max-height':100, display:'block', 'overflow-y':'auto'});
                    }
                  }
                }).clientTable([skillInfo], {
                  width: '100%',
                  sort: false,
                  footer: false,
                  title: '스킬 유형',
                  field: ['prepare_type','need_acquire','firing_type','targeting_type','judge_type','damage_type','distance_type','projectile_type','proj_velocity','miss_chance'],
                  head: DESC.SkillInfo,
                  translate: DESC.SkillInfo_TYPES
                }).clientTable([skillInfo], {
                  width: '100%',
                  sort: false,
                  footer: false,
                  title: '사용 대상',
                  field: ['invokable_relationship_type','approach_distance','invokable_distance_lower_limit','invokable_distance_upper_limit','invokable_angle','invoke_alive_condition','invokable_target_rc_state','applyingareatargetmax'],
                  head: DESC.SkillInfo,
                  translate: DESC.SkillInfo_TYPES
                }).clientTable([skillInfo], {
                  width: '100%',
                  sort: false,
                  footer: false,
                  title: '시전 정보',
                  field: ['usable_in_combat','move_cast','move_firing','target_select_with_judge','prepare_time','firing_time','applymoment','cooltime','applygcd','cooldowngroup','applyingtype'],
                  head: DESC.SkillInfo,
                  translate: DESC.SkillInfo_TYPES
                }).clientTable([skillInfo], {
                  width: '100%',
                  sort: false,
                  footer: false,
                  title: '사용 효력',
                  field: ['n_sw','n_sws','n_sa','n_sps','aggropoint','dealingamount','healingamount'],
                  head: DESC.SkillInfo,
                  translate: DESC.SkillInfo_TYPES
                }).clientTable([skillInfo], {
                  width: '100%',
                  sort: false,
                  footer: false,
                  title: '기타',
                  field: ['begin_normal_auto_attack'],
                  head: DESC.SkillInfo,
                  translate: DESC.SkillInfo_TYPES
                });

              }
            },
            {
              name: '스킬사용 NPC',
              select: function(tab){

                var $pRelativeNPC = $E('div');

                // NPC.skill_list의 Text중 Skll.code_name을 포함(*=)하고 있는 NPC를 찾는다.
                GameData.getGameData(DataKey.NPC.filename,'npcInfo','skill_list',skillInfo.code_name,'*=').then(function(list){

                  var arrRelativeNPC = [];

                  list.forEach(function(item){

                    var npc = GameData.getAttributes( item.node );

                    arrRelativeNPC.push({
                      npc_id     : npc.npc_id,
                      code_name  : npc.code_name,
                      local_name : npc.local_name
                    });

                  });

                  $pRelativeNPC.clientTable(arrRelativeNPC, {
                    title: '이 스킬을 사용하는 NPC 목록',
                    width: 600,
                    field: ['npc_id','code_name','local_name'],
                    head: DESC.NPCInfo,
                    translate_realtime: {
                      npc_id: function(v, cname, row){

                        return GameData.getDetailLink('NPC', v, 'npc_id', v);

                      }
                    }
                  });

                });

                tab.empty().append( $pRelativeNPC );

              }
            }
          ]);
        }
      }
    };

  };

});

})(jQuery, this, this.document);
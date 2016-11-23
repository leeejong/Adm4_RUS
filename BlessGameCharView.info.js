/**
 * BlessGameCharView.info
 * ADM 4.0 JavaScript Menu
 * @modified leeejong@neowiz.com 2015.12.16
 * @package
 * @subpackage
 * @encoding UTF-8
 */

// http://glat.info/jscheck/
/*global $, jQuery, $adm, $E, confirm, console, alert, JSON, HTMLInputElement define, parseInt */

// 명료한 Javascript 문법을 사용 한다.
"use strict";

(function($, window, document){

/**
 * @param {type} Desc - Description
 * @param {type} GameData - GameData Edit Script
 * @returns {BlessGameCharView.info_L27.BlessGameCharView.infoAnonym$3}
 */
define(['beans/Bless/BlessDesc','beans/Bless/BlessGameData'], function(Desc, GameData){

  $adm.loadCss('common/css/themes/leeejong/styler.css?t=' + (new Date().getTime()));

  function getResultWindow( menu, title, width, height, top, left ){
    return $E('div').win({
      title         : 'Result :: '+title,
      parent        : menu,
      top           : top    || 130,
      left          : left   || 410,
      width         : width  || 'auto',
      height        : height || 'auto',
      buttonpane    : false,
      screen_toggle : true,
      minimum       : true,
      status        : true,
      resizable     : true,
      draggable     : true,
      'extends'     : false
    });
  }

  function getWindow( menu, title, top, left, width, height ){
    return $E('div').win({
      title         : title,
      parent        : menu,
      top           : top    || 0,
      left          : left   || 0,
      width         : width  || 'auto',
      height        : height || 'auto',
      buttonpane    : false,
      close         : false,
      status        : false,
      'extends'     : false
    });
  }

  return {

    'CharacterInfo': function( parentMenu, userInfo, charInfo, formData ){

      var panelty_list = charInfo.panelty_list;

      var menu = getResultWindow( parentMenu, 'CharacterInfo'+'('+charInfo.player_name+')', 1200, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);
      menu.clientTable([charInfo], {
        title: 'Base Info',
        field: ['server_name', 'player_name', 'player_db_id','realm_type', 'race_type', 'gender_type', 'class_type', 'guild_db_name', 'player_level', 'unreg_flag', 'unreg_date'],
        head: Desc.DBPlayer,
        sort: false,
        footer: false,
        column_width: [70, 150, 150, 80, 70, 80, 100, 70, 80, 150],
        width: '95%',
        translate: {
          race_type: Desc.raceTypeHud,
          gender_type: Desc.genderTypeHud,
          class_type: Desc.classTypeHud,
          realm_type: Desc.realm
        },
        translate_realtime: {
          player_name : function(v, cname, row) {
            return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 6, row.player_name, 0, 0);
          },
          unreg_flag : function(v, cname, row) {
            debug(v===1);
            debug((Date.parse(row.unreg_date) > Date.parse('2016-02-05 10:00:00.0')));
            if(v===0) return 'Active';
            else if(v===1 && (Date.parse(row.unreg_date) > Date.parse('2016-02-05 10:00:00.0'))){
              return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 3, row.unreg_flag, 0, 0);
            }
            else return 'Removed';
          }
        },
        cell_modify_after : function( bef, aft, cname, row ){}
      });
      if(charInfo.unreg_flag===1) return;
      menu.clientTable([charInfo], {
        field: ['exp', 'hp', 'mp', 'gold','cinis', 'cp', 'bp', 'dp','lumena_p','lumena','acting_point','acting_point_max','charge_acting_point_count'],
        column_width: [100, 100, 100, 110, 110, 110, 110, 110, 110,'100',100, 100, 100,100],
        head: Desc.DBPlayer,
        sort: false,
        footer: false,
        width: '95%',
        translate: {
          race_type: Desc.raceTypeHud,
          gender_type: Desc.genderTypeHud,
          class_type: Desc.classTypeHud
        },
        translate_realtime: {
          gold : function(v, cname, row) {
            return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 9, row.gold, 0, 0);
          },
          cp : function(v, cname, row) {
            return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 13, row.cp, 0, 0);
          },
          bp : function(v, cname, row) {
            return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 15, row.bp, 0, 0);
          },
          cinis : function(v, cname, row) {
            return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 111, row.cinis, 0, 0);
          },
          dp : function(v, cname, row) {
            return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 19, row.dp, 0, 0);
          },
          lumena : function(v, cname, row) {
            return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 93, row.lumena, 0, 0);
          },
          lumena_p : function(v, cname, row) {
            return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 95, row.lumena_p, 0, 0);
          },
          acting_point_max : function(v, cname, row){
            switch(userInfo.grade_num){
              case 0 : case 1:
                return 360; break;
              case 2: case 3: case 4:
                return 420; break;
              case 5: case 6: case 7:
                return 480; break;
              case 8: case 9: case 10:
                return 540; break;
              case 11: case 12: case 13: case 14: case 15:
                return 600; break;
              default:
                return 360; break;
            }
          }
        }
      });

      menu.clientTable([charInfo], {
        field: ['pet_dbid', 'pet_last_fatigue_update_date', 'rxp', 'rxpGrade', 'nextbaserxp', 'craftLevel','craft_exp','gatherLevel', 'gather_exp' ],
        column_width: [100, 160, 100, 160, 140, 100, 100,100,100],
        head: Desc.DBPlayer,
        sort: false,
        footer: false,
        width: '95%',
        translate_realtime: {
          craft_exp : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 98, row.craft_exp, 0, 0); },
          gather_exp : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 100, row.gather_exp, 0, 0); },
          rxpGrade: function(v, cname, row){
            if(row.rxp>=17963) return Desc.rxpGrade[16];
            else if(row.rxp>=15266) return Desc.rxpGrade[15];
            else if(row.rxp>=12974) return Desc.rxpGrade[14];
            else if(row.rxp>=11026) return Desc.rxpGrade[13];
            else if(row.rxp>=9180) return Desc.rxpGrade[12];
            else if(row.rxp>=7100) return Desc.rxpGrade[11];
            else if(row.rxp>=6092) return Desc.rxpGrade[10];
            else if(row.rxp>=4392) return Desc.rxpGrade[9];
            else if(row.rxp>=3599) return Desc.rxpGrade[8];
            else if(row.rxp>=2905) return Desc.rxpGrade[7];
            else if(row.rxp>=1989) return Desc.rxpGrade[6];
            else if(row.rxp>=1418) return Desc.rxpGrade[5];
            else if(row.rxp>=1012) return Desc.rxpGrade[4];
            else if(row.rxp>=807) return Desc.rxpGrade[3];
            else if(row.rxp>=600) return Desc.rxpGrade[2];
            else if(row.rxp>=306) return Desc.rxpGrade[1];
            else return Desc.rxpGrade[0];
          },
          craftLevel : function(v,cname,row){
            if(row.craft_exp>=29151) return 'CraftLev13';
            else if(row.craft_exp>=16911) return 'CraftLev13';
            else if(row.craft_exp>=9747) return 'CraftLev12';
            else if(row.craft_exp>=5614) return 'CraftLev11';
            else if(row.craft_exp>=3229) return 'CraftLev10';
            else if(row.craft_exp>=1853) return 'CraftLev9';
            else if(row.craft_exp>=1059) return 'CraftLev8';
            else if(row.craft_exp>=600) return 'CraftLev7';
            else if(row.craft_exp>=337) return 'CraftLev6';
            else if(row.craft_exp>=185) return 'CraftLev5';
            else if(row.craft_exp>=97) return 'CraftLev4';
            else if(row.craft_exp>=46) return 'CraftLev3';
            else if(row.craft_exp>=17) return 'CraftLev2';
            else return 'CraftLev1';
          },
          gatherLevel : function(v,cname,row){
            if(row.gather_exp>=41166) return 'GatherLev7';
            else if(row.gather_exp>=16626) return 'GatherLev6';
            else if(row.gather_exp>=6649) return 'GatherLev5';
            else if(row.gather_exp>=2593) return 'GatherLev4';
            else if(row.gather_exp>=944) return 'GatherLev3';
            else if(row.gather_exp>=273) return 'GatherLev2';
            else return 'GatherLev1';
          }
        }
      });

      menu.clientTable([charInfo], {
        field: ['stacked_kill', 'stacked_death', 'tutorial_state_type', 'login_count', 'logout_date', 'last_condition_phase', 'unlock_skill_deck_size' ],
        column_width: [100, 100, 100, 100, 140, 100, 160],
        head: Desc.DBPlayer,
        sort: false,
        footer: false,
        width: '95%',
        translate: {
          race_type: Desc.raceTypeHud,
          gender_type: Desc.genderTypeHud,
          class_type: Desc.classTypeHud
        }
      });

      menu.append( $E('P').text(' ') );

      GameData.getGameData( 'DestinationPointReference', 'DestinationPointInfo', 'Id', [charInfo.destination_cid], '=' ).then(function(home){
        debug(home);
        menu.clientTable([charInfo], {
          title: 'Position Info',
          field: ['home','destination_cid','last_location_cid', 'last_location_x', 'last_location_y', 'last_location_z', 'last_rotation_yaw', 'last_world_instance_sid', 'last_worldmap_type', 'last_worldmap_cid', 'last_worldmap_wrapper_cid','move_point','move_home'],
          column_width: [140, 80, 80, 100, 100, 100, 80, 80, 80],
          head: Desc.DBPlayer,
          sort: false,
          footer: false,
          width: '95%',
          translate_realtime: {
            home : function(v, cname, row){return (home[0] ? home[0].localname : v );},
            last_location_x : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 71, row.last_location_x, 0, 0); },
            last_location_y : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 72, row.last_location_y, 0, 0); },
            last_location_z : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 73, row.last_location_z, 0, 0); },
            last_rotation_yaw : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 74, row.last_rotation_yaw, 0, 0); },
            last_world_instance_sid : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 75, row.last_world_instance_sid, 0, 0); },
            last_worldmap_type : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 76, row.last_worldmap_type, 0, 0); },
            last_worldmap_cid : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 77, row.last_worldmap_cid, 0, 0); },
            last_worldmap_wrapper_cid : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 78, row.last_worldmap_wrapper_cid, 0, 0); },
            move_point  : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 79, '', 0, 0); },
            move_home   : function(v, cname, row) {
              return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 80, row.destination_cid, home, 0);
            },
            destination_cid: function( v, cname, row ){
              return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, row.server_id, userInfo['usn'], row.player_name, 85, row.destination_cid, 0, 0);
            }
          }

        });

        menu.append( $E('P').text(' ') );

        menu.clientTable(panelty_list, {
          pagesize: 15,
          title: 'Penelty Info',
          field: ['panelty_type','panelty_date','panelty_reason'],
          column_width: [200, 200, 200],
          head: Desc.DBPlayer,
          width: '95%',
          translate_realtime: {
            panelty_date: function( v, cname, row ){
              //수정기능은 비상탈출 종료시간에만 제공한다, (값이 있는경우)
              if(row.panelty_no===3 ){
                if (row.panelty_edit_date !== '') {
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 25, row.panelty_date, 0, 0);
                } else { return row.panelty_date; }
              }
              else{ return row.panelty_date; }
            },
            panelty_reason: function( v, cname, row ){
              if (row.panelty_edit_reason) {
                var select_options;
                if (row.panelty_edit_reason === '24') select_options = Desc.DBPenaltyInfo_BlockMailType;
                if (row.panelty_edit_reason === '28' || row.panelty_edit_reason === '30') select_options = Desc.DBPenaltyInfo_GuildPenaltyType;
                return select_options[row.panelty_reason];
              } else { return ''; }
            }
          },
          sort: false,
          footer: false
        });
      });

      menu.append( $E('P').text(' ') );
      menu.ajaxAsync('getInvenSlot', userInfo.usn, charInfo.server_id).then(function( result ){
        menu.clientTable(result, {
          width: '95%',
          field: ['inventory_expansion_cid', 'permanent_open', 'expiretime'],
          head : Desc.DBPlayer,
          sort_field: 'inventory_expansion_cid',
          sort_asc: true,
          translate_realtime : {
            permanent_open : function(v, cname, row){
              if(v !== null){
                return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 103, row.permanent_open, {0:'기간제',1:'영구제'}, row.db_id);
              }
              else return '';
            },
            expiretime : function(v, cname, row){
              if(v !== null){
                return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 104, row.expiretime, 0, row.db_id);
              }
              else return '';
            }
          }
        });
      });
    }, // 케릭터 정보
//    '2차비밀번호': function( parentMenu, userInfo, charInfo, formData ){
//      //todo
//      var menu = getResultWindow( parentMenu, '2차 비밀번호'+'('+charInfo.player_name+')', 1200, 600 );
//      var adminGmlevel = GameData.getAdminGMLevel(menu);
//
//      menu.ajaxAsync('getSecondPw', userInfo.usn, charInfo.server_id).then(function( result ){
//
//        var lockButton = $E('button').button().text('2차비밀번호 잠금').css({'width':590,'height':30}).click(function(){
//          if(adminGmlevel===null || adminGmlevel>4){
//            alert('수정권한이 없습니다. GmLevel-> '+adminGmlevel);
//            return;
//          }
//          menu.ajaxAsync('callSecondPw', userInfo.usn, 6).then(alert('완료되었습니다. 다시 검색해주세요.'));
//        });
//        var resetButton = $E('button').button().text('2차비밀번호 초기화').css({'width':590,'height':30}).click(function(){
//          if(adminGmlevel===null || adminGmlevel>3){
//            alert('수정권한이 없습니다. GmLevel-> '+adminGmlevel);
//            return;
//          }
//          menu.ajaxAsync('callSecondPw', userInfo.usn, 7).then(alert('완료되었습니다. 다시 검색해주세요.'));
//        });
//
//        menu.clientTable(result, {
//          width: '100%',
//          field: ['usn', 'status','fail_cnt','upd_date','reg_date'],
//          head : ['USN', '상태','실패회수','Update_date','Reg_date'],
//          translate : {
//            'status' : {
//              '0' : '초기화상태',
//              '1' : '운영자에 의한 비밀번호 초기화 상태',
//              '2' : '비밀번호 등록 상태',
//              '3' : '비밀번호 5회 실패로 잠금',
//              '4' : '운영자에 의한 잠김',
//              '5' : '사용자 스스로 잠금'
//            }
//          }
//
//        }).append(lockButton, resetButton);
//
//      });
//    },// 2차비번 관련메뉴
    'MonsterBook': function( parentMenu, userInfo, charInfo, formData ){

      var menu = getResultWindow( parentMenu, 'MonsterBook'+'('+charInfo.player_name+')', 1200, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);
      menu.ajaxAsync('getMonsterBook', charInfo.player_db_id, charInfo.server_id).then(function( result ){

        menu.clientTable(result, {
          width: '100%',
          field: ['monsterbook_cid','local_name', 'stage_index', 'count1', 'count2', 'count3', 'count4', 'count5', 'count6','is_repeat_stage','last_repeat_time'],
          head: Desc.DBMonsterBook,
          translate_realtime: {
            local_name: function( v, cname, row ){
              return GameData.getLocalname( menu, 'MonsterBookInfo', row.monsterbook_cid);
            }
            ,stage_index : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 55, v, '', row.monsterbook_uid); }
            ,count1      : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 56, v, '', row.monsterbook_uid); }
            ,count2      : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 57, v, '', row.monsterbook_uid); }
            ,count3      : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 58, v, '', row.monsterbook_uid); }
            ,count4      : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 59, v, '', row.monsterbook_uid); }
            ,count5      : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 60, v, '', row.monsterbook_uid); }
            ,count6      : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 61, v, '', row.monsterbook_uid); }
          }
        }).append($E('button').text('Remain Reward').button().click(function(){
          var remain = getResultWindow( menu, 'Remain Reward'+'('+charInfo.player_name+')', 300, 250 );
          menu.ajaxAsync('getRemainMonsterbookReward', charInfo.player_db_id, charInfo.server_id).then(function( r ){
            remain.clientTable(r,{
              width:'100%',
              pagesize: 5
            });
          });
        }));

      });

    }, // 몬스터북

    'Item': function( parentMenu, userInfo, charInfo, formData ){

      var menu = getResultWindow( parentMenu, 'Item'+'('+charInfo.player_name+')', 1300, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);

      menu.ajaxAsync('getItem', charInfo.player_db_id, charInfo.server_id).then(function( result ){

        var equip = [], inven = [], sell  = [], deleted  = [], costume=[], wearing_costume=[], warehouse=[];

        result.forEach(function( item ){
          if( item.unreg_flag>0 ) deleted.push( item );
          else {
            switch( item.having_slot_type ){
              case 1 :
                debug(item);
                if(item.equip_slot<14){
                  debug('a');
                  equip.push( item );
                }
                else{
                  debug('b');
                  wearing_costume.push( item );
                }
                break;
              case 2 :
                if(item.inventory_tab_index===0){
                  inven.push( item );
                }
                else{
                  costume.push( item );
                }
                break;
              case 3 : sell.push( item ); break;
              case 4 : warehouse.push( item ); break;
            }
          }
        });

        menu.buttonTab([
          {
            name: 'Wear Item',
            contents: $adm.clientTable(equip, {
              pagesize: 12,
              width: '100%',
              field: ['item_cid', 'local_name', 'item_uid', 'amount', 'remain_effect_charges', 'bonding', 'equip_slot','custom_count','potential_level','having_slot_change_date','unreg_date','duration_date','rune','detail', 'item_send', 'item_delete'],
              head: Desc.DBItem_equip,
              sort_field: 'equip_slot',
              translate : {
                equip_slot : Desc.EquipSlot,
                potential_level : Desc.Potential_level
              },
              translate_realtime: {
                bonding: function(v, cname, row) {
                   return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 35, v, '', row.item_uid); },
                item_cid: function( v ){
                  return GameData.parseLinkName('<item_id:'+v+'>');
                },
                local_name: function( v, cname, row ){
                  return GameData.getLocalname(menu, 'ItemInfo', row.item_cid);
                },
                item_delete : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 31, 0, '', row.item_uid);
                  else
                    return '';
                },
                item_send : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 82, 0, '', row.item_uid);
                  else
                    return '';
                },
                detail : function(v, cname, row){return $E('button').text('Detail').button().click(function(){GameData.itemdetail(menu, charInfo.server_id, row.db_id);});},
                rune : function(v, cname, row){return $E('button').text('Rune').button().click(function(){getRune(menu, charInfo.server_id, row.db_id);});}
              }
            })
          },
          {
            name: 'Having Item',
            contents: $adm.clientTable(inven, {
              pagesize: 12,
              width: '100%',
              field: ['item_cid', 'local_name', 'item_uid', 'amount', 'remain_effect_charges', 'bonding', 'inventory_slot_index', 'inventory_tab_index','custom_count','potential_level', 'having_slot_change_date','unreg_date','duration_date','rune', 'detail', 'item_send', 'item_delete'],
              head: Desc.DBItem_equip,
              sort_field: 'inventory_slot_index',
              translate_realtime: {
                item_cid: function( v ){
                  return GameData.parseLinkName('<item_id:'+v+'>');
                },
                local_name: function( v, cname, row ){
                  return GameData.getLocalname(menu, 'ItemInfo', row.item_cid);
                },
                amount : function(v, cname, row) {
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 33, v, '', row.item_uid);
                },
                remain_effect_charges : function(v, cname, row) {
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 34, v, '', row.item_uid);
                },
                bonding : function(v, cname, row) {
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 35, v, '', row.item_uid);
                },
                item_delete : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 36, 0, '', row.item_uid);
                  else
                    return '';
                },
                item_send : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 82, 0, '', row.item_uid);
                  else
                    return '';
                },
                detail : function(v, cname, row){return $E('button').text('Detail').button().click(function(){GameData.itemdetail(menu, charInfo.server_id, row.db_id);});},
                rune : function(v, cname, row){return $E('button').text('Rune').button().click(function(){getRune(menu, charInfo.server_id, row.db_id);});}
              },
              translate : {
                potential_level : Desc.Potential_level
              }
            })
          },
          {
            name: 'Wearing Costume',
            contents: $adm.clientTable(wearing_costume, {
              pagesize: 12,
              width: '100%',
              field: ['item_cid', 'local_name', 'item_uid', 'amount', 'remain_effect_charges', 'bonding', 'equip_slot','custom_count','having_slot_change_date','unreg_date','duration_date','detail', 'item_send', 'item_delete'],
              head: Desc.DBItem_equip,
              sort_field: 'equip_slot',
              translate : {
                equip_slot : Desc.EquipSlot
              },
              translate_realtime: {
                bonding: function(v, cname, row) {
                   return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 35, v, '', row.item_uid); },
                local_name: function( v, cname, row ){
                  return GameData.getLocalname(menu, 'ItemInfo', row.item_cid);
                },
                cid: function( v, cname, row ){
                  return row.item_cid;
                },
                item_delete : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 31, 0, '', row.item_uid);
                  else
                    return '';
                },
                item_send : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 82, 0, '', row.item_uid);
                  else
                    return '';
                },
                detail : function(v, cname, row){return $E('button').text('Detail').button().click(function(){GameData.itemdetail(menu, charInfo.server_id, row.db_id);});}
              }
            })
          },
          {
            name: 'Having Costume',
            contents: $adm.clientTable(costume, {
              pagesize: 12,
              width: '100%',
              field: ['item_cid', 'local_name', 'item_uid', 'amount', 'remain_effect_charges', 'bonding', 'inventory_slot_index', 'inventory_tab_index','custom_count', 'having_slot_change_date','unreg_date','duration_date', 'detail', 'item_send', 'item_delete'],
              head: Desc.DBItem_equip,
              sort_field: 'inventory_slot_index',
              translate_realtime: {
                item_cid: function( v ){
                  return GameData.parseLinkName('<item_id:'+v+'>');
                },
                local_name: function( v, cname, row ){
                  return GameData.getLocalname(menu, 'ItemInfo', row.item_cid);
                },
                amount : function(v, cname, row) {
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 33, v, '', row.item_uid);
                },
                remain_effect_charges : function(v, cname, row) {
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 34, v, '', row.item_uid);
                },
                bonding : function(v, cname, row) {
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 35, v, '', row.item_uid);
                },
                item_delete : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 36, 0, '', row.item_uid);
                  else
                    return '';
                },
                item_send : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 82, 0, '', row.item_uid);
                  else
                    return '';
                },
                detail : function(v, cname, row){return $E('button').text('Detail').button().click(function(){GameData.itemdetail(menu, charInfo.server_id, row.db_id);});}
              }
            })
          },
          {
            name: 'Selled Item',
            contents: $adm.clientTable(sell, {
              pagesize: 12,
              width: '100%',
              field: ['item_cid','local_name', 'item_uid', 'amount', 'remain_effect_charges', 'bonding','custom_count','potential_level', 'having_slot_change_date','unreg_date','duration_date','item_restore','rune' ,'detail'],
              head: Desc.DBItem,
              translate_realtime: {
                item_cid: function( v ){
                  return GameData.parseLinkName('<item_id:'+v+'>');
                },
                local_name: function( v, cname, row ){
                  return GameData.getLocalname(menu, 'ItemInfo', row.item_cid);
                },
                item_restore : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 102, 0, '', row.item_uid);
                  else
                    return '';
                },
                detail : function(v, cname, row){return $E('button').text('Detail').button().click(function(){GameData.itemdetail(menu, charInfo.server_id, row.db_id);});},
                rune : function(v, cname, row){return $E('button').text('Rune').button().click(function(){getRune(menu, charInfo.server_id, row.db_id);});}
              },
              translate : {
                potential_level : Desc.Potential_level
              }
            })
          },
          {
            name: 'Removed Item',
            contents: $adm.clientTable(deleted, {
              pagesize: 12,
              width: '100%',
              field: ['item_cid', 'local_name', 'item_uid', 'amount', 'remain_effect_charges', 'bonding', 'having_slot_type','custom_count','potential_level','having_slot_change_date', 'unreg_date','duration_date','rune','detail', 'item_restore','item_send'],
              head: Desc.DBItem,
              translate_realtime: {
                item_cid: function( v ){
                  return GameData.parseLinkName('<item_id:'+v+'>');
                },
                local_name: function( v, cname, row ){
                  return GameData.getLocalname(menu, 'ItemInfo', row.item_cid);
                },
                item_restore : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 37, 0, '', row.item_uid);
                  else
                    return '';
                },
                item_send : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 38, 0, '', row.item_uid);
                  else
                    return '';
                },
                detail : function(v, cname, row){return $E('button').text('Detail').button().click(function(){GameData.itemdetail(menu, charInfo.server_id, row.db_id);});},
                rune : function(v, cname, row){return $E('button').text('Rune').button().click(function(){getRune(menu, charInfo.server_id, row.db_id);});}
              },
              translate : {
                potential_level : Desc.Potential_level
              }
            })
          },
          {
            name: 'Warehouse',
            contents: $adm.clientTable(warehouse, {
              pagesize: 12,
              width: '100%',
              field: ['item_cid', 'local_name', 'item_uid', 'amount', 'remain_effect_charges', 'bonding', 'inventory_slot_index', 'inventory_tab_index','custom_count','potential_level', 'having_slot_change_date','unreg_date','duration_date','rune', 'detail', 'item_send', 'item_delete'],
              head: Desc.DBItem_equip,
              sort_field: 'inventory_slot_index',
              translate_realtime: {
                item_cid: function( v ){
                  return GameData.parseLinkName('<item_id:'+v+'>');
                },
                local_name: function( v, cname, row ){
                  return GameData.getLocalname(menu, 'ItemInfo', row.item_cid);
                },
                amount : function(v, cname, row) {
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 33, v, '', row.item_uid);
                },
                remain_effect_charges : function(v, cname, row) {
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 34, v, '', row.item_uid);
                },
                bonding : function(v, cname, row) {
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 35, v, '', row.item_uid);
                },
                item_delete : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 36, 0, '', row.item_uid);
                  else
                    return '';
                },
                item_send : function(v, cname, row) {
                  if (row.item_uid)
                    return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 82, 0, '', row.item_uid);
                  else
                    return '';
                },
                detail : function(v, cname, row){return $E('button').text('Detail').button().click(function(){GameData.itemdetail(menu, charInfo.server_id, row.db_id);});},
                rune : function(v, cname, row){return $E('button').text('Rune').button().click(function(){getRune(menu, charInfo.server_id, row.db_id);});}
              },
              translate : {
                potential_level : Desc.Potential_level
              }
            })
          }
        ]);

      });

      function getRune(menu, server, uid){
        var statWin = $E('div').win({ title : 'Item Rune '+uid, parent : menu, top : 150, left : 400, width : 'auto', height : 'auto',
          buttonpane : false, close : true, screen_toggle : true, minimum : true, status : true, resizable : true, draggable : true, 'extends' : false });
        statWin.ajax({
          methodcall : ['getItemRune'],
          data       : [ server, uid ],
          success    : function( r ){
            statWin.clientTable(r,{
              field : ['item_uid', 'rune_item_cid_1','rune_name_1', 'rune_item_cid_2','rune_name_2', 'del_rune1', 'del_rune2'],
              translate_realtime : {
                rune_name_1: function( v, cname, row ){
                  if(row.rune_item_cid_1===-1) return 'None';
                  return GameData.getLocalname(menu, 'ItemInfo', row.rune_item_cid_1);
                },
                rune_name_2: function( v, cname, row ){
                  if(row.rune_item_cid_2===-1) return 'None';
                  return GameData.getLocalname(menu, 'ItemInfo', row.rune_item_cid_2);
                },
                del_rune1 : function(r, cname, row){
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 112, 0, 0, row.item_uid);
                },
                del_rune2 : function(r, cname, row){
                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 113, 0, 0, row.item_uid);
                },
//                'del_rune3' : function(r, cname, row){
//                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 114, 0, 0, row.item_uid);
//                },
//                'del_rune4' : function(r, cname, row){
//                  return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 115, 0, 0, row.item_uid);
//                }
              }
            });
          }
        })
      };

    }, // 아이템

    'Quest': function( parentMenu, userInfo, charInfo, formData ){

      var menu = getResultWindow( parentMenu, 'Quest'+'('+charInfo.player_name+')', 1200, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);

      $.when(
        menu.ajaxAsync('getQuest', charInfo.player_db_id, charInfo.server_id),
        menu.ajaxAsync('getRepeatQuest', charInfo.player_db_id, charInfo.server_id),
        menu.ajaxAsync('getResolvedQuest', charInfo.player_db_id, charInfo.server_id)
      ).then(function( quest, repeat, resolved ){

        var inprogress = [],
            fail = [],
            complete = [];

        quest.forEach(function( q ){
          switch( true ){
            case !!+q.is_failed  : fail.push( q );     break;
            case !!+q.unreg_flag : complete.push( q ); break;
            default              : inprogress.push( q );
          }
        });

        menu.buttonTab([
          {
            name: 'Live Quest',
            contents: $adm.clientTable(inprogress, {
              pagesize: 15,
              width: '100%',
              field: ['quest_cid','local_name','start_date','flag1','count1','flag2','count2','flag3','count3','flag4','count4','flag5','count5','flag6','count6','extendeddata'],
              head: Desc.DBQuest,
              sort_field: 'start_date',
              translate_realtime: {
                local_name: function( v, cname, row ){ return GameData.getLocalname( menu, 'QuestInfo', row.quest_cid); }
                ,flag1  : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 41, v, Desc.QuestFlag, row.quest_uid); }
                ,flag2  : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 43, v, Desc.QuestFlag, row.quest_uid); }
                ,flag3  : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 45, v, Desc.QuestFlag, row.quest_uid); }
                ,flag4  : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 47, v, Desc.QuestFlag, row.quest_uid); }
                ,flag5  : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 49, v, Desc.QuestFlag, row.quest_uid); }
                ,flag6  : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 51, v, Desc.QuestFlag, row.quest_uid); }
                ,count1 : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 42, v, '', row.quest_uid); }
                ,count2 : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 44, v, '', row.quest_uid); }
                ,count3 : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 46, v, '', row.quest_uid); }
                ,count4 : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 48, v, '', row.quest_uid); }
                ,count5 : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 50, v, '', row.quest_uid); }
                ,count6 : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 52, v, '', row.quest_uid); }
              }
            })
          },
          {
            name: 'Failed Quest',
            contents: $adm.clientTable(fail, {
              pagesize: 15,
              width: '100%',
              field: ['quest_cid','local_name','start_date','unreg_date','flag1','count1','flag2','count2','flag3','count3','flag4','count4','flag5','count5','flag6','count6','extendeddata'],
              head: $.extend({unreg_date:'Fail_date'}, Desc.DBQuest),
              sort_field: 'start_date',
              translate_realtime: {
                local_name: function( v, cname, row ){ return GameData.getLocalname( menu, 'QuestInfo', row.quest_cid); }
              }
            })
          },
          {
            name: 'Completed Quest',
            contents: $adm.clientTable(resolved, {
              pagesize: 15,
              width: '400',
              field: ['conv_resolved_quest_list'],
              head: $.extend({unreg_date:'Complete'}, Desc.DBQuest),
              translate_realtime: {
                conv_resolved_quest_list: function( v, cname, row ){
                  var questStatus = '', questStatus16 = '', questStatus2 = '';
                  var resolvedQuestList = new Array();
                  for(var i=0; i< v.length; i+=2 ) {
                    // 1. 대상 퀘스트 가져옴
                    questStatus16 = v.substr(i, 2);
                    // 2. 16진수 -> 2진수 변환
                    if (questStatus16 !== '0') {
                      questStatus2 = parseInt(questStatus16,16).toString(2);

                      for(var j=questStatus2.length; j< 8; j++ ) {
                        questStatus2 = '0' + questStatus2;
                      }
                      questStatus2 = questStatus2.split("").reverse().join("");   // 순서 반대로 뒤집기(맨왼쪽이 처음으로 인식하도록)

                      for(var j=0; j< 8; j++ ) {
                        questStatus = questStatus2.substr(j, 1);
                        if (questStatus !== '0') {
                          //console.log('quest_cid : ' + (10000+(i*4)+j) + ', questStatus : ' + parseInt(questStatus16,16) + ',' + questStatus2);
                          resolvedQuestList.push({quest_cid_num:(10000+(i*4)+j), quest_cid:(10000+(i*4)+j), quest_status:questStatus});
                        }
                      }
                    }
                  }

                  var result = $adm.clientTable(resolvedQuestList, {
                    field : ['quest_cid','local_name','quest_status'],
                    width: '100%',
                    sort: true,
                    footer: true,
                    head: Desc.DBQuest,
                    translate: {
                      quest_status:{0:'0:Progress',1:'1:Completed'}
                    },
                    translate_realtime: {
                      local_name: function( v, cname, row ){ return GameData.getLocalname( menu, 'QuestInfo', row.quest_cid); }
                    }
                  });
                  return result;
                }
              }
            })
          },
          {
            name: 'Repeat Quest',
            contents: $adm.clientTable(repeat, {
              pagesize: 15,
              width: '100%',
              field: ['quest_cid','local_name','resolved_date','total_repeat_count','repeat_count','resolved_level'],
              head: Desc.DBRepeatQuestInfo,
              sort_field: 'resolved_date',
              sort_asc: false,
              translate_realtime: {
                local_name: function( v, cname, row ){ return GameData.getLocalname( menu, 'QuestInfo', row.quest_cid); },
              }
            })
          }
        ]);

        menu.append('   ', GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 53, 0, 0, 0) );

      });

    }, // 퀘스트

    'Skill': function( parentMenu, userInfo, charInfo, formData ){

      var menu = getResultWindow( parentMenu, 'Skill'+'('+charInfo.player_name+')', 1200, 600 );

      menu.ajaxAsync('getSkill', charInfo.player_db_id, charInfo.server_id).then(function( skill ){

        menu.clientTable(skill, {
          pagesize: 15,
          width: '100%',
          field: ['skill_cid','local_name'],
          head: Desc.DBSkill,
          sort_field: 'skill_cid',
          translate_realtime: {
            local_name : function(v, cname, row){
              return GameData.getLocalname(menu, 'PCSkillInfo', row.skill_cid);
            },
          }
        });

      });

    }, // 스킬

    'Dungeon': function( parentMenu, userInfo, charInfo, formData ){

      var menu = getResultWindow( parentMenu, 'Dungeon'+'('+charInfo.player_name+')', 1200, 600 );

      menu.ajaxAsync('getInstanceDungeon', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
        menu.clientTable(idgs, {
          pagesize: 20,
          width: '100%',
          field: ['player_db_id', 'dungeon_cid', 'dungeon_stage_index', 'cooltime_expire_date','use_limit_count','reset'],
          head: {player_db_id:'CSN', dungeon_cid:'ID', cooltime_start_date:'cooltime Expiretime', dungeon_stage_index:'Stage'},
          translate_realtime: {
            reset  : function(v, cname, row) { return GameData.getDataEditButton(
                GameData.getAdminGMLevel(menu), menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 81, '', 0, 0); }
          },
          sort_field: 'cooltime_expire_date'
        });

      });

    }, // 던전귀속정보

    'Post': function( parentMenu, userInfo, charInfo, formData ){

      var menu = getResultWindow( parentMenu, 'Post'+'('+charInfo.player_name+')', 1200, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);

      menu.buttonTab([
        {
          name: 'Inbox',
          contents: function(){
            var content = $E('div');
            menu.ajaxAsync('getMail', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
              content.append( $E('div').clientTable(idgs, {
                pagesize: 10,
                width: '100%',
                field: ['send_time', 'expire_time', 'db_id', 'sender_name', 'sender_player_db_id', 'mail_type', 'state_type', 'returnflag', 'keepflag', 'gold', 'details', 'mail_delete', 'mail_return'],
                head : Desc.DBMail,
                translate:{
                  mail_type: Desc.mail_type,
                  state_type: Desc.state_type,
                  details:function(v, cname, row){
                    return $E('button').text('Detail').button().click(function(){
                      var items = $E('div').win({ title : 'Detail', parent : menu, top : 150, left : 400, width : 'auto', height : 'auto',
                                  buttonpane : false, close : true, screen_toggle : true, minimum : true, status : true, resizable : true,
                                  draggable : true, 'extends' : false });
                      var tmp = [];
                      menu.ajax({
                       methodcall : ['getItemDesc'],
                       data       : [ row.item_db_id_1, row.item_db_id_2, row.item_db_id_3, row.item_db_id_4, row.item_db_id_5, charInfo.server_id],
                       success    : function( r ){
                         items.empty()
                          .append( $E('label').text('ID') ).append( $E('input:text').text(row.db_id ) ).append('<hr>')
                          .append( $E('label').text('Title') ).append( $E('input:text').text(row.title ) ).append('<hr>')
                          .append( $E('label').text('Attached').css('float','left') ).append( $E('div').clientTable(r, {
                            title:'Items',
                            pagesize: 15,
                            width: 450,
                            field: ['db_id', 'item_cid', 'amount', 'must_set_property','duration_date','potential_level', 'detail'],
                            translate : { potential_level : Desc.Potential_level },
                            translate_realtime : {
                              item_cid : function(v){ return GameData.parseLinkName('<item_id:'+v+'>'); },
                              detail : function(v, cname, row){return $E('button').text('Detail').button().click(function(){GameData.itemdetail(menu, charInfo.server_id, row.db_id);});}
                            },
                            head: Desc.DBItem
                          } ) );
                       }
                      });
                     });
                  }
                },
                sort_field: 'send_time',
                sort_order:'desc',
                translate_realtime: {
                  mail_delete : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 66, 0, '', row.db_id); },
                  mail_return : function(v, cname, row) {
                    if (row.returnflag === '1') {
                      return null;
                    } else {
                      return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 67, 0, '', row.db_id);
                    }
                  }
                }
              }) );
            });
            return content;
          }
        },
        {
          name: 'Outbox',
          contents: function(){
            var content = $E('div');
            menu.ajaxAsync('getSendMail', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
              content.append( $E('div').clientTable(idgs, {
                pagesize: 10,
                width: '100%',
                field: ['send_time', 'expire_time', 'db_id', 'player_db_id', 'mail_type', 'state_type', 'returnflag', 'keepflag', 'gold', 'details', 'mail_return'],
                head: Desc.DBMail,
                translate:{
                  mail_type: Desc.mail_type,
                  state_type: Desc.state_type,
                  details:function(v, cname, row){
                     return $E('button').text('Detail').button().click(function(){
                       var items = $E('div').win({ title : 'Detail', parent : menu, top : 150, left : 400, width : 'auto', height : 'auto',
                                  buttonpane : false, close : true, screen_toggle : true, minimum : true, status : true, resizable : true,
                                  draggable : true, 'extends' : false });
                       var tmp = [];
                       menu.ajax({
                        methodcall : ['getItemDesc'],
                        data       : [ row.item_db_id_1, row.item_db_id_2, row.item_db_id_3, row.item_db_id_4, row.item_db_id_5, charInfo.server_id],
                        success    : function( r ){
                          items.empty()
                           .append( $E('label').text('ID') ).append( $E('input:text').text(row.db_id ) ).append('<hr>')
                          .append( $E('label').text('Title') ).append( $E('input:text').text(row.title ) ).append('<hr>')
                          .append( $E('label').text('Attached').css('float','left') ).append( $E('div').clientTable(r, {
                            title:'Items',
                             pagesize: 15,
                             width: 450,
                             field: ['db_id', 'item_cid', 'amount', 'must_set_property','duration_date','potential_level', 'detail'],
                             head: Desc.DBItem,
                             translate : { potential_level : Desc.Potential_level },
                             translate_realtime : {
                              item_cid : function(v){ return GameData.parseLinkName('<item_id:'+v+'>'); },
                              detail : function(v, cname, row){return $E('button').text('Detail').button().click(function(){GameData.itemdetail(menu, charInfo.server_id, row.db_id);});}
                             }
                           } ) );
                        }
                       });
                     });
                  }
                },
                sort_field: 'send_time',
                sort_order:'desc',
                translate_realtime: {
                  mail_return : function(v, cname, row) {
                    if (row.returnflag === '1') {
                      return $E('button').text('Return').button().click(function(){ alert('Error. Already Returned'); });
                    } else if (row.state_type === '2') {
                      return $E('button').text('Return').button().click(function(){ alert('Error. Already got attached Items.'); });
                    } else {
                      return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 68, 0, '', row.db_id);
                    }
                  }
                }
              }) );
            });
            return content;
          }
        },
        {
          name: 'Removed',
          contents: function(){
            var content = $E('div');
            menu.ajaxAsync('getDeletedMail', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
              content.append( $E('div').clientTable(idgs, {
                pagesize: 10,
                width: '100%',
                field: ['send_time', 'unreg_date', 'db_id', 'sender_player_db_id', 'player_db_id', 'mail_type', 'state_type', 'returnflag', 'delete_type', 'gold', 'details', 'mail_restore'],
                head: Desc.DBMail,
                translate:{
                  mail_type: Desc.mail_type,
                  state_type: Desc.state_type,
                  delete_type: Desc.delete_type,
                  details:function(v, cname, row){
                     return $E('button').text('Detail').button().click(function(){
                       var items = $E('div').win({ title : 'Detail', parent : menu, top : 150, left : 400, width : 'auto', height : 'auto',
                                  buttonpane : false, close : true, screen_toggle : true, minimum : true, status : true, resizable : true,
                                  draggable : true, 'extends' : false });
                       var tmp = [];
                       menu.ajax({
                        methodcall : ['getItemDesc'],
                        data       : [ row.item_db_id_1, row.item_db_id_2, row.item_db_id_3, row.item_db_id_4, row.item_db_id_5, charInfo.server_id],
                        success    : function( r ){
                          items.empty()
                           .append( $E('label').text('ID') ).append( $E('input:text').text(row.db_id ) ).append('<hr>')
                          .append( $E('label').text('Title') ).append( $E('input:text').text(row.title ) ).append('<hr>')
                          .append( $E('label').text('Attached').css('float','left') ).append( $E('div').clientTable(r, {
                            title:'Items',
                             pagesize: 15,
                             width: 450,
                             field: ['db_id', 'item_cid', 'amount', 'must_set_property','duration_date','potential_level', 'detail'],
                             head: Desc.DBItem,
                             translate : { potential_level : Desc.Potential_level },
                             translate_realtime : {
                              item_cid : function(v){ return GameData.parseLinkName('<item_id:'+v+'>'); },
                              detail : function(v, cname, row){return $E('button').text('Detail').button().click(function(){GameData.itemdetail(menu, charInfo.server_id, row.db_id);});}
                             }
                           } ) );
                        }
                       });
                     });
                  }
                },
                sort_field: 'send_time',
                sort_order:'desc',
                translate_realtime: {
                  mail_restore : function(v, cname, row) { return GameData.getDataEditButton(adminGmlevel, menu, charInfo.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 69, 1, '', row.db_id); }
                }
              }) );
            });
            return content;
          }
        }
      ]);
    },  // 우편함
    'Guild': function( parentMenu, userInfo, charInfo, formData ){

      var menu = getResultWindow( parentMenu, 'Guild'+'('+charInfo.guild_db_name+')', 1200, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);
      var guildItems1 = $E('div').addClass( 'Search_Form' ).empty();
      var guildItems2 = $E('div').addClass( 'Search_Form' ).empty();
      menu.ajaxAsync('getGuildInfo', charInfo.guild_db_id, charInfo.server_id).then(function( result ){

        menu.clientTable(result, {
          title: 'Guild Info',
          field: ['db_id', 'name', 'level', 'exp', 'influence_amount', 'reg_date', 'gold', 'reusable_name_date', 'unreg_flag', 'unreg_date'],
          head: Desc.DBGuildInfo,
          sort: false,
          footer: false,
          column_width: [120, 120, 60, 100, 100, 130, 100, 100, 60, 130]
        });
        menu.clientTable(result, {
          field: ['accumulated_co_rp','rpdate1','accumulated_ro_rp','rpdate2','calculate_influence_date','rp'],
          head: Desc.DBGuildInfo,
          sort: false,
          footer: false,
          column_width: [120, 120, 60, 100, 100, 130, 100, 100, 60, 130],
          translate_realtime: {
          }
        });

        menu.clientTable(result, {
          field: ['message'],
          head: Desc.DBGuildInfo,
          sort: false,
          footer: false,
          column_width: [1000]
        });

        menu.clientTable(result, {
          field: ['notice', 'notice_date'],
          head: Desc.DBGuildInfo,
          sort: false,
          footer: false,
          column_width: [850, 145]
        });

        var guild_grade_button = $E('button').text('Grade_Info').button();
        menu.ajaxAsync('getGuildGradeInfo', charInfo.guild_db_id, charInfo.server_id).then(function( guildGradeResult ){
          guild_grade_button.click(function(){
            guildItems1.empty().clientTable(guildGradeResult, {
               pagesize: 15,
               width: 450,
               field: ['name', 'type', 'authority', 'priority'],
               head: Desc.DBGuildGradeInfo
            })
              .dialog({
                title: 'Grade_Info',
                stick: {
                    right: guild_grade_button
                }
            });
          });
        });
        var guild_member_button = $E('button').text('Member_Info').button();
        menu.ajaxAsync('getGuildMemberInfo', charInfo.guild_db_id, charInfo.server_id).then(function( guildMemberResult ){
          guild_member_button.click(function(){
            guildItems2.empty().clientTable(guildMemberResult, {
               pagesize: 15,
               width: 450,
               field: ['player_db_id', 'player_name', 'real_name', 'grade_type', 'player_level','level','influence','join_date', 'logout_date', 'unreg_flag'],
               head: Desc.DBGuildMemberInfo
            })
              .dialog({
                title: 'Member_info',
                stick: {
                    right: guild_member_button
                }
            });
          });
        });

        menu.append( $E('div').css({'width':'150'}).append($E('P').text(' '), guild_grade_button, $E('P').text(' '), guild_member_button, $E('P').text(' ')));
      });

    }, // 스킬덱 정보
    'SkillDeck': function( parentMenu, userInfo, charInfo, formData ){

      var menu = getResultWindow( parentMenu, 'SkillDeck'+'('+charInfo.player_name+')', 1200, 600 );

      $.when(
        menu.ajaxAsync('getSkillDeckInfo', charInfo.player_db_id, charInfo.server_id),
        menu.ajaxAsync('getActionBarInfo', charInfo.player_db_id, charInfo.server_id)
      ).then(function( skilldeck, actionbar ){

        menu.clientTable(skilldeck, {
          title: 'SkillDeck',
          field: ['deck_idx', 'deck_name', 'conv_skill_cid_list'],
          head: Desc.DBSkillDeckInfo,
          translate_realtime: {
            conv_skill_cid_list: function( v, cname, row ){

              var skillid16 = '', skillid16reverse = '', skillid = '';
              var skillList = new Array();

              function reverseSkillStr(strSkill) {  // 2문자씩 되어 있는 예를 들어 4ADD0A00 -> 000ADD4A 으로 변환함
                var result = '';
                for(var i=strSkill.length; i> 0; i-=2 ) {
                  result += strSkill.substr(i-2, 2);
                }
                return result;
              }

              for(var i=0; i< v.length; i+=8 ) {
                // 1. 대상 스킬 가져옴
                if (i+8 > v.length) {
                  skillid16 = v.substr(i, (i+8-v.length));
                } else {
                  skillid16 = v.substr(i, 8);
                }

                // 2. 스킬ID 10진수 변환
                skillid16reverse = reverseSkillStr(skillid16);
                skillid = parseInt(skillid16reverse,16);
                //console.log('skillid16 : ' + skillid16 + ', skillid16reverse1 : ' + skillid16reverse + ', skillid : ' + skillid + ', ' + i + ', ' + (i+8));
                if ( skillid16reverse !== 'FFFFFFFF') {
                  skillList.push([skillid]);
                }
              }

              var result = $adm.clientTable( [skillList], {
                width: '100%',
                sort: false,
                footer: true,
                head: {0:'Skill0',1:'Skill1',2:'Skill2',3:'Skill3',4:'Skill4',5:'Skill5',6:'Skill6',7:'Skill7',8:'Skill8',9:'Skill9',10:'Skill10',11:'Skill11',12:'Skill12',13:'Skill13',14:'Skill14'},
                translate_realtime: {
                  0 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  1 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  2 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  3 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  4 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  5 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  6 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  7 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  8 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  9 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  10 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  11 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  12 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  13 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); },
                  14 : function(v) { return GameData.getLocalname(menu, 'PCSkillInfo', v[0]); }
                }
              });

              return result;
            }
          },
          sort: false,
          footer: false,
          column_width: [120, 200],
          width : '100%'
        });
        menu.append( $E('P').text(' ') );

        menu.clientTable(actionbar, {
          title: 'ActionBar',
          field: ['slot_idx', 'actionbar_type', 'actionbar_id'],
          head: Desc.DBActionBarInfo,
          translate:{
            actionbar_type:{1:'Skill',2:'Item'}
          },
          translate_realtime: {
            actionbar_id: function( v, cname, row ){
              if (row.actionbar_type === 1) {
                return GameData.getLocalname(menu, 'PCSkillInfo', v);
              } else {
                return GameData.getLocalname(menu, 'ItemInfo', v);
              }
            }
          },
          sort: false,
          footer: false,
          column_width: [120, 200, 300]
        });
      });
    }, // 스킬덱 정보
    'Collection Book': function( parentMenu, userInfo, charInfo, formData ){

      var menu = getResultWindow( parentMenu, 'Collection Book'+'('+charInfo.player_name+')', 1200, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);

      menu.buttonTab([
        {
          name: 'Mount',
          contents: function(){
            var content = $E('div');
            menu.ajaxAsync('getMount', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
              content.append( $E('div').clientTable(idgs, {
                pagesize: 10,
                width: '100%',
                field: ['db_id','mount_cid','local_name','grade','exp','level','preset_cid','c_skill_cid','ww_skill_cid','passive_skill_cid_list','skill_ratio_1','skill_ratio_2','ispermanent','expiretime','deleteColumn'],
                head : Desc.DBMount,
                sort_field: 'db_id',
                sort_order:'asc',
                translate_realtime: {
                  local_name : function(v, cname, row){
                    return GameData.getLocalname(menu, 'MountInfo', row.mount_cid);
                  },
                  deleteColumn : function(v, cname, row) {
                    return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 86, 0, 0, row.db_id);
                  },
                  expiretime : function(v, cname, row){
                    if(row.ispermanent === 0){
                      return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 105, v, 0, row.db_id);
                    }
                    else return v;
                  }
                },
                translate : {
                  ispermanent : Desc.ispermanent
                }
              }) );
            });
            return content;
          }
        },
        {
          name: 'Pet',
          contents: function(){
            var content = $E('div');
            menu.ajaxAsync('getPet', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
              content.append( $E('div').clientTable(idgs, {
                pagesize: 10,
                width: '100%',
                field: ['db_id','pet_cid','local_name','grade','exp','level','preset_cid','fatigue','cooltime_expire_date','skill_cid_1','skill_cid_2','skill_ratio_1','skill_ratio_2','ispermanent','expiretime','deleteColumn'],
                head : Desc.DBPet,
                sort_field: 'db_id',
                sort_order:'asc',
                translate_realtime: {
                  local_name : function(v, cname, row){
                    return GameData.getLocalname(menu, 'PetInfo', row.pet_cid);
                  },
                  deleteColumn : function(v, cname, row) {
                    return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 87, row.db_id, 0, row.db_id);
                  },
                  expiretime : function(v, cname, row){
                    if(row.ispermanent === 0){
                      return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 106, v, 0, row.db_id);
                    }
                    else return v;
                  }
                },
                translate : {
                  ispermanent : Desc.ispermanent
                }
              }) );
            });
            return content;
          }
        },
        {
          name: 'Fellow',
          contents: function(){
            var content = $E('div');
            menu.ajaxAsync('getFellow', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
              content.append( $E('div').clientTable(idgs, {
                pagesize: 10,
                width: '100%',
                field: ['db_id','fellow_cid','local_name','grade','exp','level','skill_cid_1','skill_cid_2','mission_cid','skill_ratio_1','skill_ratio_2','ispermanent','expiretime','deleteColumn'],
                head : Desc.DBFellow,
                sort_field: 'db_id',
                sort_order:'asc',
                add_column : {
                  mission_cid : function(row){
                    return $E('button').button().text('Detail').click(function(){getFellowMission(charInfo.player_db_id, row.db_id, charInfo.server_id);});
                  }
                },
                translate_realtime: {
                  local_name : function(v, cname, row){
                    return GameData.getLocalname(menu, 'FellowInfo', row.fellow_cid);
                  },
                  deleteColumn : function(v, cname, row) {
                    return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, charInfo.server_id, userInfo.usn, charInfo.player_name, 88, row.db_id, 0, row.db_id);
                  },
                  expiretime : function(v, cname, row){
                    if(row.ispermanent === 0){
                      return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 106, v, 0, row.db_id);
                    }
                    else return v;
                  }
                },
                translate : {
                  ispermanent : Desc.ispermanent
                }
              }) );
            });
            return content;
          }
        },
        {
          name: 'Deleted Mount',
          contents: function(){
            var content = $E('div');
            menu.ajaxAsync('getMountDeleted', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
              content.append( $E('div').clientTable(idgs, {
                pagesize: 10,
                width: '100%',
                field: ['db_id','mount_cid','local_name','grade','exp','level','c_skill_cid','ww_skill_cid','passive_skill_cid_list','unreg_date','skill_ratio_1','skill_ratio_2','ispermanent','expiretime','restoreColumn'],
                head : Desc.DBMount,
                sort_field: 'db_id',
                sort_order:'asc',
                translate_realtime: {
                  restoreColumn : function(v, cname, row) {
                    return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 89, row.db_id, 0, row.db_id);
                  },
                  local_name : function(v, cname, row){
                    return GameData.getLocalname(menu, 'MountInfo', row.mount_cid);
                  },
                },
                translate : {
                  ispermanent : Desc.ispermanent
                }
              }) );
            });
            return content;
          }
        },
        {
          name: 'Deleted Pet',
          contents: function(){
            var content = $E('div');
            var items = $E('div').addClass( 'Search_Form' );
            menu.ajaxAsync('getPetDeleted', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
              content.append( $E('div').clientTable(idgs, {
                pagesize: 10,
                width: '100%',
                field: ['db_id','pet_cid','local_name','grade','exp','level','preset_cid','fatigue','cooltime_expire_date','skill_cid_1','skill_cid_2','unreg_date','skill_ratio_1','skill_ratio_2','ispermanent','expiretime','restoreColumn'],
                head : Desc.DBPet,
                sort_field: 'db_id',
                sort_order:'asc',
                translate_realtime: {
                  restoreColumn : function(v, cname, row) {
                    return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 90, row.db_id, 0, row.db_id);
                  },
                  local_name : function(v, cname, row){
                    return GameData.getLocalname(menu, 'PettInfo', row.pet_cid);
                  },
                },
                translate : {
                  ispermanent : Desc.ispermanent
                }
              }) );
            });
            return content;
          }
        },
        {
          name: 'Deleted Fellow',
          contents: function(){
            var content = $E('div');
            var items = $E('div').addClass( 'Search_Form' );
            menu.ajaxAsync('getFellowDeleted', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
              content.append( $E('div').clientTable(idgs, {
                pagesize: 10,
                width: '100%',
                field: ['db_id','fellow_cid','local_name','grade','exp','level','skill_cid_1','skill_cid_2','mission_cid','time_to_complete','unreg_date','skill_ratio_1','skill_ratio_2','ispermanent','expiretime','restoreColumn'],
                head : Desc.DBFellow,
                sort_field: 'db_id',
                sort_order:'asc',
                add_column : {
                  mission_cid : function(row){
                    return $E('button').button().text('Detail').click(function(){getFellowMission(charInfo.csn, row.db_id, charInfo.server_id);});
                  }
                },
                translate_realtime: {
                  restoreColumn : function(v, cname, row) {
                    return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 91, row.db_id, 0, row.db_id);
                  },
                  local_name : function(v, cname, row){
                    return GameData.getLocalname(menu, 'FellowInfo', row.fellow_cid);
                  },
                },
                translate : {
                  ispermanent : Desc.ispermanent
                }
              }) );
            });
            return content;
          }
        }
      ]);
      function getFellowMission(csn, fellow, server){

        var subWindow = $E('div').win({
          title         : 'Fellow Mission',
          parent        : menu,
          top           : 200,
          left          : 400,
          width         : 'auto',
          height        : 'auto',
          buttonpane    : false,
          close         : true,
          screen_toggle : true,
          minimum       : true,
          status        : true,
          resizable     : true,
          draggable     : true,
          'extends'     : false
        });
        menu.ajaxAsync('getFellowMission', csn, fellow, server).then(function(r){
          subWindow.clientTable(r);
        });
      }
    },  // 컬렉션 북 - 마운트,펫,펠로우
    'Mission': function( parentMenu, userInfo, charInfo, formData ){
      var menu = getResultWindow( parentMenu, 'Mission'+'('+charInfo.player_name+')', 1200, 600 );
      menu.ajaxAsync('getMission', charInfo.player_db_id, charInfo.server_id).then(function( idgs ){
        menu.clientTable(idgs, {
          pagesize: 10,
          width: 950,
          field: ['mission_cid','mission_level','mission_option_cid','mission_slot','mission_state','register_fellow_db_id_1','register_fellow_db_id_2','register_fellow_db_id_3','success_ratio','time_to_complete','total_minute_to_complete'],
          head : Desc.DBMission,
          sort_field: 'mission_cid',
          sort_order:'asc',
          cell_modify : [ 'mission_state' ],
          cell_modify_after : function( bef, aft, cname, row ){
            return menu.ajaxAsync( 'setMissionState', charInfo.csn, row.mission_cid, row.server_id, aft );
          },
          translate :  {
            mission_state : Desc.mission_state
          }
        });
      });
    },  // 미션정보
    'CustomWaypoint': function( parentMenu, userInfo, charInfo, formData ){
      var menu = getResultWindow( parentMenu, 'CustomWaypoint'+'('+charInfo.player_name+')', 1200, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);
      menu.ajaxAsync('getCustomWaypoint', charInfo.player_db_id, charInfo.server_id).then(function( waypoint ){
        menu.clientTable( waypoint , {
          field : ['db_id','location_cid','location_x','location_y','location_z','worldmap_cid','delete'],
          head  : ['DB_ID','Location_CID','X','Y','Z','Worldmap_CID','Delete'],
          pagesize: 10,
          width: 950,
          translate_realtime : {
            'delete' : function(v, cname, row){
              return GameData.getDataEditButton(adminGmlevel, menu, row.player_db_id, charInfo.server_id, userInfo['usn'], charInfo.player_name, 96, row.db_id, 0, row.db_id);
            }
          }
        } );
      });
    },  // Waypoint
    'Friends': function( parentMenu, userInfo, charInfo, formData ){
      var menu = getResultWindow( parentMenu, 'Friends'+'('+charInfo.player_name+')', 1200, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);
      menu.ajaxAsync('getFriend', charInfo.player_db_id, charInfo.server_id).then(function( friend ){
        menu.clientTable( friend , {
          field : ['db_id','friend_db_id'],
          head  : ['DB_ID','Friend_DB_ID'],
          pagesize: 10,
          width: 950
        } );
      });
    },  // FriendList
    '1:1 Battle': function( parentMenu, userInfo, charInfo, formData ){
      var menu = getResultWindow( parentMenu, '1:1 Battle'+'('+charInfo.player_name+')', 1200, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);
      menu.ajaxAsync('getBattleHistory', charInfo.player_db_id, charInfo.server_id).then(function( history ){
        menu.clientTable( history , {
          field : ['class_type','win'],
          head  : ['Class','Win'],
          pagesize: 10,
          width: 950,
          translate : {
            class_type : Desc.classTypeHud
          }
        } );
      });
    },  // Battle History
    'Order': function( parentMenu, userInfo, charInfo, formData ){
      var menu = getResultWindow( parentMenu, 'Order'+'('+charInfo.player_name+')', 1200, 600 );
      var adminGmlevel = GameData.getAdminGMLevel(menu);
//      menu.ajaxAsync('getOrderSchedule', charInfo.player_db_id, charInfo.server_id).then(function( history ){
//        menu.clientTable( history , {
////          field : ['class_type','win'],
////          head  : ['Class','Win'],
//          pagesize: 10,
//          width: 950,
//          translate : {
//            //class_type : Desc.classTypeHud
//          }
//        } );
//      });
      menu.ajaxAsync('getOrderGoal', charInfo.player_db_id, charInfo.server_id).then(function( history ){
        menu.clientTable( history , {
//          field : ['class_type','win'],
//          head  : ['Class','Win'],
          pagesize: 10,
          width: 950,
          translate : {
            //class_type : Desc.classTypeHud
          }
        } );
      });
      menu.ajaxAsync('getOrder', charInfo.player_db_id, charInfo.server_id).then(function( history ){
        menu.clientTable( history , {
//          field : ['class_type','win'],
//          head  : ['Class','Win'],
          pagesize: 10,
          width: 950,
          translate : {
            //class_type : Desc.classTypeHud
          }
        } );
      });
    }  // 지령
  };

});

})(jQuery, this, this.document);
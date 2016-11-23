/**
 * BlessGameData.Item
 * 블레스 게임데이터 뷰어 - 아이템 드랍테이블
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
     * ItemDropTable 정보
     */
    DataKey.ItemDropTable = {
      filename: 'ItemDropTableInfo',
      nodename: 'itemDropTableInfo',
      id: 'table_id',
      code: 'name',
      name: 'name',
      tag: {itemdroptablename:'name'},
      getDropItemTable: function(table_name){

        return GameData.getGameData(DataKey.ItemDropTable.filename, DataKey.ItemDropTable.nodename, 'name', table_name).then(function(list){

          var tableInfo  = list[0],
              tableItems = [];

          $(tableInfo.node).children().each(function(idx, itemAndCondition){
            var item = GameData.getAttributes( itemAndCondition );
            tableItems.push( item );
          });

          return $adm.clientTable(tableItems, {
            title: '획득 가능한 아이템 (랜덤 1개)',
            width: '100%',
            field: ['drop_item','weight','min_count','max_count','condition_class','condition_gender','condition_race','condition_pcfaction','condition_equip_item','condition_inventory_item'],
            head: DESC.ItemDropTableInfoItems,
            sort_field: 'drop_item',
            translate: {
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

      },
      detail: function(search, keyword){

        switch(search){
          case 'name':
          case 'table_id':
            return GameData.getGameData(DataKey.ItemDropTable.filename, DataKey.ItemDropTable.nodename, search, keyword, '=').then( makeTab );

        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var tableInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '아이템 드랍 테이블 정보',
              contents: function(){

                var $tab = $E('div');

                $tab.clientTable([tableInfo],{
                  title: '기본 정보',
                  width: '100%',
                  sort: false,
                  footer: false,
                  field: ['table_id','name'],
                  head: DESC.ItemDropTableInfo
                });

                DataKey.ItemDropTable.getDropItemTable(tableInfo.name).then(function($table){
                  $table.appendTo( $tab );
                });

                // NPC의 drop_table을 찾는다.
                $.when(
                  GameData.getGameData(DataKey.NPC.filename,'drop_table','table_name',tableInfo.name),
                  GameData.getGameDataNameMap('NPC','code_name')
                ).then(function(list, npcNameMap){

                  var arrRelativeNPC = [];

                  list.forEach(function(npcDropTable){

                    var npc = GameData.getAttributes( npcDropTable.node.parentNode );

                    arrRelativeNPC.push({
                      npc_id    : npc.npc_id,
                      code_name : npc.code_name,
                      npc_name  : npc.code_name,
                      rate      : GameData.getAttributes( npcDropTable.node ).rate + '%'
                    });

                  });

                  $tab.clientTable(arrRelativeNPC, {
                    title: '이 테이블을 공유하는 NPC 목록',
                    width: '100%',
                    field: ['npc_id','code_name','npc_name','rate'],
                    head: {npc_name:'NPC 이름', rate:'테이블 확률'},
                    translate: {
                      npc_name: npcNameMap
                    },
                    translate_realtime: {
                      npc_id: function(v, cname, row){

                        return GameData.getDetailLink('NPC', v, 'npc_id', v);

                      }
                    }
                  });

                });

                return $tab;

              }
            }
          ]);
        }
      }
    };

  };

});

})(jQuery, this, this.document);
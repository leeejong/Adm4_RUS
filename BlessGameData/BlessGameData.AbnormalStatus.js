/**
 * BlessGameData.AbnormalStatus
 * 블레스 게임데이터 뷰어 - 상태효과
 * @author bitofsky@neowiz.com 2014.02.13
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

    var DataName = 'AbnormalStatus';

    /**
     * 상태효과 정보
     */
    var DataConfig = DataKey[DataName] = {
      filename: 'AbnormalStatusInfo',
      nodename: 'abnormalStatusInfo',
      id: 'abnormal_status_id',
      code: 'name',
      name: 'name_k',
      tag: {abnormal_status_id:'abnormal_status_id', 'abnormal_name': 'name'},
      detail: function(search, keyword){

        switch( search ){
          case 'abnormal_status_id':
          case 'name':
            return GameData.getGameData(DataConfig.filename, DataConfig.nodename, search, keyword, '=').then( makeTab );

        }

        function makeTab(){

          if( !arguments[0][0] ) return alert('대상을 찾을 수 없습니다.');

          var dataInfo = arguments[0][0];

          return $adm.buttonTab([
            {
              name: '기본 정보',
              contents: function(){

                var tab = $E('div');

                tab.clientTable([dataInfo], {
                  width: 800,
                  sort: false,
                  footer: false,
                  title: '상태효과 정보',
                  field: ['abnormal_status_id', 'name', 'name_k', 'icon_index', 'level', 'level_group_id'],
                  head: DESC.VoluntaryActionInfo
                }).clientTable([dataInfo], {
                  width: '100%',
                  sort: false,
                  footer: false,
                  column_width: [600],
                  field: ['description_k'],
                  head: DESC.VoluntaryActionInfo
                }).clientTable([dataInfo], {
                  width: '100%',
                  sort: false,
                  footer: false,
                  title: '속성',
                  field: ['buff_debuff_type', 'cool_time', 'damage_type', 'detach_upon_death', 'diminish_type', 'dispel_type'],
                  head: DESC.VoluntaryActionInfo
                }).clientTable([dataInfo], {
                  width: '100%',
                  sort: false,
                  footer: false,
                  title: '속성',
                  field: ['duration', 'expire_amount', 'expire_count', 'ignore_if_exist', 'is_target_unconscious', 'judge_type', 'need_to_save'],
                  head: DESC.VoluntaryActionInfo
                }).clientTable([dataInfo], {
                  width: '100%',
                  sort: false,
                  footer: false,
                  title: '속성',
                  field: ['overlap_type', 'pause_upon_disconnect', 'period', 'period_dealing_amount', 'period_healing_amount', 'stack_count', 'stack_type'],
                  head: DESC.VoluntaryActionInfo
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
<?php

/**
 * BlessGameCharView Class
 * @author bitofsky@neowiz.com 2013.06.03
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessGameCharView {

  use GameCharView;

  protected $bo;
  protected $allowMethod = [
    'getUserInfo',
    'getCharList',

    'getServerInfo',
    'getMonsterBook',
    'getItem',
    'getQuest',
    'getRepeatQuest',
    'getResolvedQuest',
    'getSkill',
    'getInstanceDungeon',
    'getMail',
    'getSendMail',
    'getDeletedMail',

    'getGuildName',
    'getGuildInfo',
    'getGuildGradeInfo',
    'getGuildMemberInfo',
    'getSkillDeckInfo',
    'getActionBarInfo',

    'getCOList',
    'getCOBidList',

    'getMission',
    'getWaypoint',
    'getCustomWaypoint',
    'getFriend',

    'getROList',
    'getROGuildReservations',

    'getConquestSetup',
    'getCOAuctionList',
    'getROReservations',

    'getTradeInfo',
    'getTradeDeny',
    'getBanInfo',
    'getVipInfo',
    'getConnectInfo',
    'getConnectInfoMiddle',

    'getMount',
    'getMountDeleted',
    'getPet',
    'getPetDeleted',
    'getFellow',
    'getFellowDeleted',

    'getInvenSlot',
    'getFellowMission',
    'getItemDesc',
    'getItemRune',
    'getRemainMonsterbookReward',
    'getItemStat',
    'getGradeBaseInfo',
    'getSecondPw',
    'getBattleHistory',

    'getOrderSchedule',
    'getOrderGoal',
    'getOrder',
    'getLocalname',

      // 수정 기능
    'setGmlevel' ,
    'setPlayerName' ,
    'setBlockChatDate',
    'kickAccount',
    'resetBan',
    'setMissionState',
    'setTradeRestrict',
    'modifyGradePoint',
    'callSecondPw',
    'removeTradeDeny',
    'insertTradeDeny',
    'deleteRune'

  ];

  function __construct(){

    $this->bo = new BlessBO();
    $this->gamedata = new BlessGameData();
  }

  function getModifyInfo( string $modify_code ){
    //debug('[php] getModifyInfo___sss : ' + $result);
    return $this->gamedata->getModifyInfo($modify_code);
  }

  function getAdmGMLevel(){
    debug('[php] getAdmGMLevel');
    return $this->gamedata->getAdmGMLevel();
  }

  function modifyGameDataItem( string $modify_code, $csn, $server_id, $usn, string $character_name, string $before_data, string $modify_data, string $memo_data, $extra_id, string $reference_url ){
    return $this->gamedata->modifyGameDataItem($modify_code, $csn, $server_id, $usn, $character_name, $before_data, $modify_data, $memo_data, $extra_id, $reference_url);
  }

  function confirmModifyGameDataItem($log_seq) {
    return $this->gamedata->confirmModifyGameDataItem($log_seq);
  }
}

?>
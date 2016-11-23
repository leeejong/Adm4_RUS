<?php

/**
 * BlessGameDataModifyMemo Class
 * @author sungje@neowiz.com 2015.03.17
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessGameDataModifyMemo {

  protected $bo;
  protected $gamedata;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
    $this->gamedata = new BlessGameData();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }


  function getGameDataModifyList( string $searchtype, string $serverId, string $sdate, string $edate, string $regMsn, string $approveMsn ){

    debug('getGameDataModifyList... searchtype : '.$searchtype.',serverId : '.$serverId.',date : '.$sdate.'~'.$edate);
    debug('getGameDataModifyList... regMsn : '.$regMsn.',approveMsn : '.$approveMsn);
    $sql = 'SELECT *  ';
    $sql .= ' FROM adm_local.bl_gamedata_edit_log ';
    $sql .= ' WHERE server_id in (:server_id, 0) AND edit_status=:searchtype ';

    if ($searchtype == '2') {
      $sql .= ' AND reg_date BETWEEN :sdate AND :edate ';

      if ($regMsn != '') $sql .= ' AND msn=:regMsn ';
      if ($approveMsn != '') $sql .= ' AND approve_msn=:approveMsn ';
    }

    $dbProcess = DB::instance('adm_local')->prepare( $sql )
      ->bindParam( 'server_id', $serverId )
      ->bindParam( 'searchtype', $searchtype );

    if ($searchtype == '2') {
      $dbProcess->bindParam( 'sdate', $sdate.'000000' )
                ->bindParam( 'edate', $edate.'235959' );
      if ($regMsn != '') $dbProcess->bindParam( 'regMsn', $regMsn );
      if ($approveMsn != '') $dbProcess->bindParam( 'approveMsn', $approveMsn );
    }

    $result =  $dbProcess->get();
    if (empty($result)) return $result;

    // msn의 이름/id정보를 가져옴
    $arrMsn = array();
    foreach( $result as $row ){
      if ($row['msn'] != '') array_push($arrMsn, $row['msn']);
      if ($row['approve_msn'] != '') array_push($arrMsn, $row['approve_msn']);
    }
    $arrMsn_unique = explode(",", implode(",", array_unique($arrMsn)));

    if ($arrMsn_unique) {
      $memberInfo = DB::instance('adm_common')
        ->prepare( sprintf('select msn,id,name from adm_auth.au_member where msn in (%s)', implode(",",$arrMsn_unique)) )
        ->get();

      $mapMemberInfo = array();
      foreach( $memberInfo as $member ){
        $mapMemberInfo[$member['msn']] = $member;
      }

      foreach( $result as &$row ){
        $row['msn_id'] = $mapMemberInfo[$row['msn']]['id'];
        $row['msn_name'] = $mapMemberInfo[$row['msn']]['name'];
        $row['approve_msn_id'] = $mapMemberInfo[$row['approve_msn']]['id'];
        $row['approve_msn_name'] = $mapMemberInfo[$row['approve_msn']]['name'];
      }
    }

    foreach( $result as &$row ){

      // 코드이름 가져옴
      $row['modify_code_name'] = ($row['modify_code'] != '') ? $this->gamedata->getModifyInfo($row['modify_code'])['name'] : '';

      // edit_db명 생성
      $row['edit_db'] = $row['edit_table_name'].' / '.$row['edit_column_name'];

      if ($row['edit_table_name']) {
        $addDBInfo = $this->gamedata->getModifyInfoAddDBInfo($row['edit_table_name'], $row['edit_column_name']);
      } else $addDBInfo = '';
      if ($addDBInfo != '') $row['edit_db'] .= ', '.$addDBInfo;

      // Extra_id -> CID 교체 처리
      if ($row['edit_table_name'] == 'DBQuest') {
        debug('getGameDataModifyList... DBQuest....  '.$row['extra_id']);
        $QuestInfo = $this->bo->getQuestInfo($row['extra_id'], $serverId);
        debug($QuestInfo);

        if ($QuestInfo[0]) $row['extra_cid'] = $QuestInfo[0]['quest_cid'];
      } else if ($row['edit_table_name'] == 'DBMonsterBook') {
        $MonsterBookInfo = $this->bo->getMonsterBookInfo($row['extra_id'], $serverId);
        if ($MonsterBookInfo[0]) $row['extra_cid'] = $MonsterBookInfo[0]['monsterbook_cid'];
      }
    }

    return $result;
  }

  function confirmModifyGameDataItem($log_seq) {
    return $this->gamedata->confirmModifyGameDataItem($log_seq);
  }

  function rejectModifyGameDataItem($log_seq, string $memo_data) {
    return $this->gamedata->rejectModifyGameDataItem($log_seq, $memo_data);
  }

  function getQuestInfo($db_id, string $serverId){
    return $this->bo->getQuestInfo($db_id, $serverId);
  }

}

?>
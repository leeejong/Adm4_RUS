<?php

/**
 * BlessMerge Class
 * @author leeejong@neowiz.com 2015.12.18
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessMerge {
  private $bo;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function searchUser($server, $type, $key, $func){
    $usn = $type=='id' ? $this->bo->getUsn( $key ) : $key;
    if ( $usn ){
      if($func == 1){
        $query =  "SELECT * FROM dbo.DBAccountData WHERE usn=:usn";
      }
      else if($func == 2){
        $query =  "SELECT * FROM dbo.DBPlayer WHERE usn=:usn";
      }

      else{
        return 'error';
      }
      return $this->bo->getDB( 'game', $server )->prepare( $query )
        ->bindParam( 'usn', $usn )
        ->get();

    }
    else {
      error( 'Error. No user exists.' );
    }
  }

  function changeUser($server, $usn, $csn, $func){
    if ( $usn ){
      if($func == 1){ //하이란으로
        $query =  "UPDATE dbo.DBAccountData SET realm=0 WHERE usn=:usn";
        return $this->bo->getDB( 'game', $server )->prepare( $query )
        ->bindParam( 'usn', $usn )
        ->set(true);
      }
      else if($func == 2){ //우니온으로
        $query =  "UPDATE dbo.DBAccountData SET realm=1 WHERE usn=:usn";
        return $this->bo->getDB( 'game', $server )->prepare( $query )
        ->bindParam( 'usn', $usn )
        ->set(true);
      }
      if($func == 3){ // 삭제하기 unreg->1
        $query =  "UPDATE dbo.DBPlayer SET UNREG_FLAG=1, UNREG_DATE =:edit_date  WHERE usn=:usn and db_id=:dbid";
        return $this->bo->getDB( 'game', $server )->prepare( $query )
          ->bindParam('edit_date', date('Y-m-d H:i:s', strtotime('20100101000000')))
          ->bindParam( 'usn', $usn )
          ->bindParam( 'dbid', $csn )
          ->set(true);
      }
      else if($func == 4){ //복구하기 unreg->0
        $db = $this->bo->getDB( 'game', $server );
        $db->prepare( 'EXEC BLSP_Native_RestorePlayer :player_db_id, :max_player_slot_count, :ret' )
          ->bindParam('player_db_id', $csn)
          ->bindParam('max_player_slot_count', 10)
          ->bindInOutParam('ret', $spResult)
          ->set(true);

        return $spResult;
      }
      else if($func == 5){ //복구하기 +이름변경
        $db = $this->bo->getDB( 'game', $server );
        $db->beginTransaction();
        $db->prepare('UPDATE dbo.DBPlayer SET player_name =:name, must_change_name=1 WHERE db_id=:csn')
          ->bindParam('name', $usn)
          ->bindParam('csn', $csn)
          ->set();
        $db->prepare( 'EXEC BLSP_Native_RestorePlayer :player_db_id, :max_player_slot_count, :ret' )
          ->bindParam('player_db_id', $csn)
          ->bindParam('max_player_slot_count', 10)
          ->bindInOutParam('ret', $spResult)
          ->set(true);
        if($spResult!=0) $db->rollback();
        $db->commit();

        return $spResult;
      }

      else{
        return 'error';
      }

    }
    else {
      error( 'Error. No user exists' );
    }
  }

  function getAdmGMLevel(){
    return $this->bo->getAdmGMLevel();
  }

}

?>
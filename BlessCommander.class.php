<?php

/**
 * BlessCommander Class
 * @author leeejong@neowiz.com 2016.5.11
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessCommander {
  private $bo;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function searchCommander($server, $realm, $week){
    $query =  "
        SELECT rank.*, player.usn, player.player_name
        FROM dbo.DBLimitedRankRegister rank JOIN dbo.DBPlayer player ON rank.player_db_id = player.db_id
        WHERE rank.realm_type=:realm and rank.lastsettletime>=:stime and rank.lastsettletime<=:etime ";

    if($week == 0){ //이번주
      $stime = date('Y-m-d H:i:s', strtotime('-2 week')); $etime = date('Y-m-d H:i:s', strtotime('-1 week'));
    }
    else if($week==-1){ //지난주
      $stime = date('Y-m-d H:i:s', strtotime('-3 week')); $etime = date('Y-m-d H:i:s', strtotime('-2 week'));
    }
    else if($week==1){ //미정산
      $stime = date('Y-m-d H:i:s', strtotime('-1 week')); $etime = date('Y-m-d H:i:s');
    }
    else error('Error.');

    return $this->bo->getDB( 'game', $server )->prepare( $query )
      ->bindParam( 'realm', $realm )
      ->bindParam( 'stime', $stime )
      ->bindParam( 'etime', $etime )
      ->get();

  }

  function getAdmGMLevel(){
    return $this->bo->getAdmGMLevel();
  }

}

?>
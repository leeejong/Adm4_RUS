<?php

/**
 * BlessEventManager Class
 * @author leeejong@neowiz.com 2016.1.19
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessEventManager {
  private $bo;
  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function getLatestEvent(){
    $subResult = $this->bo->getDB('middle')->prepare("SELECT event_id FROM dbo.BL_BT_LOG_EVENT ORDER BY event_id desc" )->getTop();
    return $subResult['event_id'];
  }

  function insertEvent($eventName, $title, $event, $type, $start, $end, $proc_log, $proc_middle, $table,
    $condition1, $condition2, $server, $reward){

    $middleDB =  $this->bo->getDB('middle');

    if(Util::is_dev()){
      $logDB = $this->bo->getDB('logw','01');
      $logDB->prepare("
        INSERT INTO BL_BT_LOG_EVENT
          (event_id, event_name, event_type, ref_proc, ref_table, str_date, end_date)
        VALUES
          (:event, :title, :type, :procedure, :table, :start, :end )" )
        ->bindParam('event',$event)
        ->bindParam('title', $eventName)
        ->bindParam('type', $type)
        ->bindParam('procedure', $proc_log)
        ->bindParam('table', $table)
        ->bindParam('start', $start)
        ->bindParam('end', $end)
        ->set();
    }
    else{
      $logDB1 = $this->bo->getDB('logw','01');
      $logDB1->prepare("
        INSERT INTO BL_BT_LOG_EVENT
          (event_id, event_name, event_type, ref_proc, ref_table, str_date, end_date)
        VALUES
          (:event, :title, :type, :procedure, :table, :start, :end )" )
        ->bindParam('event',$event)
        ->bindParam('title', $eventName)
        ->bindParam('type', $type)
        ->bindParam('procedure', $proc_log)
        ->bindParam('table', $table)
        ->bindParam('start', $start)
        ->bindParam('end', $end)
        ->set();
    }

    $middleDB->prepare("
      INSERT INTO dbo.BL_BT_LOG_EVENT
        (event_id, ref_proc, reg_name)
      VALUES
        (:event, :procedure, :name )" )
      ->bindParam('event',$event)
      ->bindParam('procedure', $proc_middle)
      ->bindParam('name', $_SESSION['user']['name'])
      ->set();

    $middleDB->prepare("
      INSERT INTO dbo.BL_PT_ADM_LOG_SCHEDULE
        (event_id, title, world_list, condition_1, condition_2, cash_item_id, str_date, end_date, adm_name)
      VALUES
        (:event, :title, :server, :condition1, :condition2, :reward, :start, :end, :name )" )
      ->bindParam('event',$event)
      ->bindParam('title', $title)
      ->bindParam('procedure', $proc_middle)
      ->bindParam('server',$server)
      ->bindParam('condition1', $condition1)
      ->bindParam('condition2', $condition2)
      ->bindParam('reward', $reward)
      ->bindParam('start', $start)
      ->bindParam('end', $end)
      ->bindParam('name', $_SESSION['user']['name'])
      ->set();

    return true;
  }

  function deleteEvent($event){
    if(Util::is_dev()){
      $logDB = $this->bo->getDB('logw','01');
      $middleDB =  $this->bo->getDB('middle');

      $logDB->beginTransaction();
      $middleDB->beginTransaction();

      $logDB->prepare("DELETE FROM BL_BT_LOG_EVENT WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->set();

      $logDB->prepare("DELETE FROM BL_BT_LOG_EVENT_TYPE WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->set();

      $middleDB->prepare("DELETE FROM dbo.BL_BT_LOG_EVENT WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->set();

      $middleDB->prepare("DELETE FROM dbo.BL_PT_ADM_LOG_SCHEDULE WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->set();

      $logDB->commit();
      $middleDB->commit();
    }
    else{
      $logDB1 = $this->bo->getDB('logw','01');
      $middleDB =  $this->bo->getDB('middle');

      $logDB1->beginTransaction();
      $middleDB->beginTransaction();

      $logDB1->prepare("DELETE FROM BL_BT_LOG_EVENT WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->set();
      $logDB1->prepare("DELETE FROM BL_BT_LOG_EVENT_TYPE WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->set();

      $middleDB->prepare("DELETE FROM dbo.BL_BT_LOG_EVENT WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->set();

      $middleDB->prepare("DELETE FROM dbo.BL_PT_ADM_LOG_SCHEDULE WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->set();

      $logDB1->commit();
      $middleDB->commit();
    }
    return true;
  }

  function syncEvent( $event ) {
      $logDB = $this->bo->getDB('logw','01');
      $middleDB =  $this->bo->getDB('middle');

      $logEvent = $logDB->prepare("SELECT * FROM BL_BT_LOG_EVENT WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->get();

      $logType = $logDB->prepare("SELECT * FROM BL_BT_LOG_EVENT_TYPE WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->get();

      $middleEvent = $middleDB->prepare("SELECT * FROM dbo.BL_BT_LOG_EVENT WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->get();

      $middleSchedule = $middleDB->prepare("SELECT * FROM dbo.BL_PT_ADM_LOG_SCHEDULE WHERE event_id=:event" )
        ->bindParam('event',$event)
        ->get();

    $oClass = new EnvRemoteProcessCall( 'http://adm.nwz.kr/ajax_gateway.php' );
    $result = $oClass->execSync( $event, $logEvent, $logType, $middleEvent, $middleSchedule );
    return $result;
  }

  function execSync( $target, $logEvent, $logType, $middleEvent, $middleSchedule ) {
    $logDB1   = $this->bo->getDB( 'logw', '01' );
    $middleDB = $this->bo->getDB( 'middle' );

    $logDB1->beginTransaction();
    $middleDB->beginTransaction();

    //LogDB -> BL_BT_LOG_EVENT (장비3대)
    $logDB1->prepare( "
      INSERT INTO BL_BT_LOG_EVENT
        (event_id, event_name, event_type, ref_proc, ref_table, str_date, end_date)
      VALUES
        (:event_id, :event_name, :event_type, :ref_proc, :ref_table, :str_date, :end_date)" );
    foreach ( (array) $logEvent as $k => $v ) {
      foreach ( $v as $key => $value ){
        $logDB1->bindparam( $key, $value );
      }
      $logDB1->set();
    }

    //logDB- > BL_BT_LOG_EVENT_TYPE (장비3대)
    $logDB1->prepare( "
      INSERT INTO BL_BT_LOG_EVENT_TYPE
        (event_id, log_type)
      VALUES
        (:event_id, :log_type)" );
    foreach ( (array) $logType as $k => $v ) {
      foreach ( $v as $key => $value ){
        $logDB1->bindparam( $key, $value );
      }
      $logDB1->set();
    }

    //MiddleDB -> BL_BT_LOG_EVENT
    $middleDB->prepare( "
      INSERT INTO dbo.BL_BT_LOG_EVENT
        (event_id, ref_proc, reg_name)
      VALUES
        (:event_id, :ref_proc, :reg_name)" );
      foreach ( (array) $middleEvent as $k => $v ) {
        foreach ( $v as $key => $value ){
          $middleDB->bindparam( $key, $value );
        }
        $middleDB->set();
      }

    //MiddleDB -> BL_PT_ADM_LOG_SCHEDULE
    $middleDB->prepare( "
      INSERT INTO dbo.BL_PT_ADM_LOG_SCHEDULE
        (event_id, title, world_list, condition_1, condition_2, cash_item_id, str_date, end_date, adm_name)
      VALUES
        (:event_id, :title, :world_list, :condition_1, :condition_2, :cash_item_id, :str_date, :end_date, :adm_name)" );
      foreach ( (array) $middleSchedule as $k => $v ) {
        foreach ( $v as $key => $value ){
          $middleDB->bindparam( $key, $value );
        }
        $middleDB->set();
      }

    $logDB1->commit();
    $middleDB->commit();

    ActionLog::write2(array(
      'act_type'    => 'BlessEventManager::execSync',
      'target'      => $target,
      'value'       => $_SESSION['user']['name']
    ));

    return true;
  }

}

?>
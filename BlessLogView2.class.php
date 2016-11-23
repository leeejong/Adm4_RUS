<?php

/**
 * BlessLogView Class
 * @author bitofsky@neowiz.com 2014.02.07
 * @modified leeejong@neowiz.com  2015.12.22
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessLogView2 {

  private $bo;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  /**
   * 현재 사용자의 프리셋 조회
   * @return array
   */
  function getPreset(){

    return DB::instance('adm_common')->prepare('SELECT * FROM bl_logview_preset WHERE msn = :msn')->bindParam('msn', $msn=AuthBO::get()['msn'])->get();

  }

  /**
   * 프리셋 저장
   * @param string $name
   * @param string $actions
   * @return bool
   */
  function addPreset( string $name, string $actions ){
    return DB::instance('adm_common')->prepare('REPLACE INTO bl_logview_preset (msn, name, actions) VALUES (:msn, :name, :actions)')
      ->bindParam('msn', $msn=AuthBO::get()['msn'])
      ->bindParam('name', $name)
      ->bindParam('actions', $actions)
      ->set();
  }

  /**
   * 프리셋 삭제
   * @param string $name
   * @return type
   */
  function delPreset( string $name ){
    return DB::instance('adm_common')->prepare('DELETE FROM bl_logview_preset WHERE msn = :msn AND name = :name')
      ->bindParam('msn', $msn=AuthBO::get()['msn'])
      ->bindParam('name', $name)
      ->set();
  }

  /**
   * @param $action
   * @param string $starttime YmdHis
   * @param string $endtime YmdHis
   * @param array $forms
   * @return array
   */
  function getLogData( $action, string $starttime, string $endtime, array $forms ){

    if(Util::is_dev()){
      $arrLogDB = [1];
    }
    else{
      $arrLogDB = [1,2,3];
    }
    $days     = [];
    $bind     = [
      'action'    => $action,
      'starttime' => date('Y-m-d H:i:s.000', strtotime($starttime)),
      'endtime'   => date('Y-m-d H:i:s.999', strtotime($endtime))
    ];
    $arrWhere = [];
    $where    = '';
    $arrQuery = [];
    $query    = '';
    $result   = [];

    for( $s=strtotime($starttime), $e=strtotime($endtime); $s<=$e; $s+=60*60*24)
      $days[] = date('Ymd', $s);

    if( count($days) > 3 ) error('Error. Maximum size is 3 days..');
    if( substr($endtime,0,8) > date('Ymd') ) error('Error. Invalid date');

    $limit = date('Ymd', strtotime('-42days'));
    if( substr($starttime,0,8)< $limit || substr($endtime,0,8)<$limit) error('Error. Search limit is 42 day.');

    foreach($forms as $cname => $value){

      switch( $cname ){
        case 'account'   : $value = $this->bo->getUsn( $value ); break;
        case 'character' :
          if( !is_numeric( $value ) ){

            if( !$forms['world_id'] ) error('error. Please insert World_ID.');

            $value = $this->bo->getNameToCsn($value, $forms['world_id']); break;

          }
      }

      $arrWhere[]   = $cname.' = :'.$cname;
      $bind[$cname] = $value;

    }

    //if( !count($arrWhere) ) error('검색 항목을 입력해주세요.');

    $where = join(' AND ', $arrWhere);

    foreach($days as $day){

      $query = sprintf('SELECT * FROM bl_lt_tbl_%d WHERE log_type = :action AND log_time BETWEEN :starttime AND :endtime'.($where ? ' AND '.$where : ''), $day);

      foreach($arrLogDB as $logdb)
        $result = array_merge($result, $this->bo->getDB('log', $logdb)->query($query, $bind)->get());

    }

    return $result;

  }

  function getUSN($pmangID){
    return $this->bo->getUsn($pmangID);
  }

  function getCSN($server, $charname){
    $serverInfo =  $this->getServerInfo();
    foreach($serverInfo as $key => $value){
      if( intval($value['server_id']) == intval($server) ){
        return $this->bo->getNameToCsn($charname, intval($server));
      }
    }
    return "Error. Server doesn't exist";  
  }

  function getLogtype(){
    return $this->bo->getLogtype();
  }
}
?>
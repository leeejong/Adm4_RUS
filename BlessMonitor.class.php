<?php

/**
 * BlessMonitor Class
 * @author bitofsky@neowiz.com 2015.12.03
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessMonitor {

  use ClientTable;

  function isValidDB( $db ){
    return strpos($db, 'bless_log') !== false;
  }

  function isWritableTable( string $table, string $order, string $column=null, string $db=null ){

    switch( true ){
      case $table == 'bl_monitor_stand_01' && $order == 'update' :
      case $table == 'bl_monitor_05_01' :
        return true;
    }

    return false;

  }

  protected $bo;

  /**
   * 추후 로그 서버가 분리되면 로그 서버 번호를 여기에 리스트를 추가합니다. bless_log_01은 1, 02는 2 이런식.
   * @var array
   */
  protected $logServerList = [1];
  protected $logServerListDev = [1];

  function __construct($arg1 = null, $arg2 = null){
    $this->bo = new BlessBO();

    if( Util::is_dev() )
      $this->logServerList = $this->logServerListDev;
  }

  function getLogServerList(){
    return $this->logServerList;
  }

  function getLogServerMapping(){

    $ret = [];

    foreach($this->logServerList as $logserver){

      $this->bo->getDB('log', $logserver)->query('SELECT world_id FROM bl_bt_world_info')->each(function($row) use(&$ret, $logserver){

        foreach( explode(',', $row['world_id']) as $world_id )
          $ret[$logserver][] = $world_id;

      });

    }

    return $ret;

  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function getLogMonitor( int $table, array $server, int $type=null, array $dateRange=null ){

    $ret     = [];
    $queries = [];
    $bind    = [];
    $timeQuery;
    $typeQuery;

    foreach($dateRange as $i => $range){
      $queries[]  = sprintf('log_time BETWEEN :s%d AND :e%d', $i, $i);
      $bind['s'.$i] = $range[0];
      $bind['e'.$i] = $range[1];
    }

    $timeQuery = join(' OR ', $queries);

    if( $type ){
      $typeQuery = 'AND log_type = :log_type';
      $bind['log_type'] = $type;
    }

    foreach($this->logServerList as $logserver){

      $r = $this->bo->getDB('log', $logserver)->query( sprintf('
        SELECT * FROM bl_monitor_%02d WHERE ( %s ) AND world_id IN ( %s ) %s
      ', $table, $timeQuery, join(', ', $server), $typeQuery ), $bind )->get();

      $ret = array_merge($ret, $r);

    }

    return $ret;

  }

  function getLogMonitor6( int $table, int $item_cid, int $type, int $sdate, int $edate ){

    $ret  = [];
    $bind = [
      'item_cid'=>$item_cid,
      'sdate' => $sdate,
      'edate' => $edate,
      'log_type' => $type
    ];

    foreach($this->logServerList as $logserver){

      $r = $this->bo->getDB('log', $logserver)->query( sprintf('
        SELECT * FROM bl_monitor_%02d WHERE log_time BETWEEN :sdate AND :edate AND item_cid = :item_cid AND log_type = :log_type
      ', $table ), $bind )->get();

      $ret = array_merge($ret, $r);

    }

    return $ret;

  }

  /**
   * 정보분석 DB 조회
   * @param int $type
   * @param int $sdate
   * @param int $edate
   * @return array
   */
  function getAbuseDetecting( int $type, int $sdate, int $edate){

    $rank = [];

    return DB::instance('adm_common')->query('
      SELECT
        *
      FROM
        bl_dm_abuse_result
      WHERE
        ref_log_start_time BETWEEN :sdate AND :edate
      AND
        ref_log_type = :type
      ORDER BY lof DESC
    ', [
      'sdate' => date('Y-m-d H:i:s', strtotime($sdate)),
      'edate' => date('Y-m-d H:i:s', strtotime($edate)),
      'type'  => $type
    ])->each(function( $row ) use( &$rank ){

      $row['rank'] = ++$rank[$row['world_id']];

      return $row;

    });

  }

  /**
   * 정보분석 DB 어뷰징 판단 세팅
   * @param string $ref_log_start_time
   * @param int $csn
   * @param int $ref_log_type
   * @param int $log_type
   * @param bool $value
   * @return bool
   */
  function setAbuseDetecting( string $ref_log_start_time, int $csn, int $ref_log_type, int $log_type, bool $value ){

    $bind = [
      'ref_log_start_time' => $ref_log_start_time,
      'csn' => $csn,
      'ref_log_type' => $ref_log_type,
      'value' => $value ? 'Y' : 'N'
    ];

    DB::instance('adm_common')->query('
      UPDATE bl_dm_abuse_result SET admin_check_yn = :value WHERE ref_log_start_time = :ref_log_start_time AND ref_log_type = :ref_log_type AND csn = :csn
    ', $bind)->set();

    ActionLog::write('setAbuseDetecting', $csn, $bind, 'CSN', null, $bind['value']);

    return true;

  }

}

?>
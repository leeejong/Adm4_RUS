<?php

/**
 * BlessSchedule Class
 * @author leeejong@neowiz.com 2016.11.17
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessSchedule {
  private $bo;
  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function getFunctionInfo(){
    return $this->bo->getFunctionInfo();
  }

  function getJorbiResult( $admtid ){
    return $this->bo->getJorbiResult($admtid);
  }

  function insertSchedule($id, $startday, $server, $count, $param1, $param2, $param3, $param4, $param5, $param6, $memo){

    debug($id);
    debug($startday);
    debug($server);
    debug($count);
    debug($param1);
    debug($param2);
    debug($param3);
    debug($param4);
    debug($param5);
    debug($param6);
    debug($memo);

    $DB =  DB::instance('adm_local');
    $DB->prepare("
      INSERT INTO bl_schedule
        (function_id, time, server, server_count, param1, param2, param3, param4, param5, param6, author, memo)
      VALUES
        (:function_id, :time, :server, :server_count, :param1, :param2, :param3, :param4, :param5, :param6, :author, :memo )" )
      ->bindParam('function_id',$id)
      ->bindParam('time', $startday)
      ->bindParam('server', $server)
      ->bindParam('server_count',$count)
      ->bindParam('param1', $param1)
      ->bindParam('param2', $param2)
      ->bindParam('param3', $param3)
      ->bindParam('param4', $param4)
      ->bindParam('param5', $param5)
      ->bindParam('param6', $param6)
      ->bindParam('author', $_SESSION['user']['name'])
      ->bindParam('memo', $memo)
      ->set();

    return true;
  }

  function deleteSchedule($id){
    $DB =  DB::instance('adm_local');

    return $DB->prepare("DELETE FROM bl_schedule WHERE id=:id" )
      ->bindParam('id',$id)
      ->set();
  }

  function getSchedule(){
    return DB::instance('adm_local')->prepare("SELECT * FROM bl_schedule")->get();
  }

}

?>
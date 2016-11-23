<?php

/**
 * BlessEvent Class
 * @author leeejong@neowiz.com 2015.09.07
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessEvent {
  private $bo;
  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function insertEvent($server, $start, $end, $title, $reward){
    $query =
      "INSERT INTO dbo.BL_PT_ADM_001_01
        (str_date, end_date, world_list, title, cash_item_id, adm_name)
      VALUES
        (:start, :end, :server, :title, :reward, :usn )";
    $this->bo->getDB('middle')->prepare($query)
      ->bindParam('start', $start)
      ->bindParam('end', $end)
      ->bindParam('server', $server)
      ->bindParam('title', $title)
      ->bindParam('reward', $reward)
      ->bindParam('usn', $_SESSION['user']['name'])
      ->set();

    return true;
  }

}

?>
<?php

/**
 * BlessGuild BlessGuildCreature
 * @author leeejong@neowiz.com 2016.1.7
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessGuildCreature {
  private $bo;
  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function getGuildCreature($server){
    return $this->bo->getDB('game', $server)->prepare(sprintf("SELECT *, %s as server FROM dbo.DBRPProduct", $server ))->get();
  }

  function removeGuildCreature($svr, $uid){
    return $this->bo->removeGuildCreature($svr, $uid);
  }

}

?>
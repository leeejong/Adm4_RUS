<?php

/**
 * BlessRxrSetter Class
 * @author leeejong@neowiz.com
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessRxrSetter {
  private $bo;
  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function getBuffList(){
    return $this->bo->getBuffList();
  }

  function getJorbiResult( $admtid ){
    sleep(3);
    return $this->bo->getJorbiResult($admtid);
  }

  function setSpecialWar($svr, $count, $icon, $wait, $play, $session ){
    return $this->bo->startSpecialWar($svr, $count, $icon, $wait, $play, $session);
  }

  function setCoAuction($svr, $count, $hh, $mm, $play){
    return $this->bo->startCoAuction($svr, $count, $hh, $mm, $play);
  }

  function setRoWar($svr, $count, $realm, $applystart, $applyend, $rostart){
    return $this->bo->startRoWar($svr, $count, $realm, $applystart, $applyend, $rostart);
  }

  function setFieldRaid( $svr, $count, $id){
    return $this->bo->startFieldRaid($svr, $count, $id);
  }

  function setServerBuff( $svr, $count, $buff){
    $arrTmp = explode( ",", $svr );
    $resultArr = array();
    foreach($arrTmp as $key => $value){
      $resultArr[] = $this->bo->setServerBuff((int)$value, (int)$buff);
    }

    return $resultArr;
  }

  function endServerBuff( $svr, $count ){
    return $this->bo->setServerBuff( $svr, '-1' );
  }

  function endSpecialWar($svr, $count, $session){
    return $this->bo->endSpecialWar($svr, $count, (int)$session);
  }

  function endCoAuction($svr, $count){
    return $this->bo->endCoAuction($svr, $count);
  }

  function endRoWar($svr, $count, $realm){
    return $this->bo->endRoWar($svr, $count, $realm);
  }

  function endFieldRaid($svr, $count, $id){
    return $this->bo->endFieldRaid($svr, $count, $id);
  }

}

?>
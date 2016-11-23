<?php

/**
 * BlessEventLevel Class
 * @author leeejong@neowiz.com 2015.09.07
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessEventLevel {
  private $bo;
  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getLastLevelcareEvent(){
    $middleDB =$this->bo->getDB('middle');
    $eventID = $middleDB->prepare("SELECT event_id FROM dbo.BL_BT_LOG_EVENT WHERE ref_proc='USP_BL_PT_ADM_002' ORDER BY event_id ASC")->get();
    foreach($eventID as $key => $value){
      $subResult = $middleDB->prepare("SELECT event_id, cash_item_id FROM dbo.BL_PT_ADM_002_03 WHERE event_id=:event")
        ->bindParam('event', $value['event_id'])
        ->getTop();
      if($subResult['cash_item_id']>0){
        continue;
      }else{
        return $value['event_id'];
      }
    }
    return 'Error. Please make Event First.';
  }

  function insertEvent($event, $guardian, $berserker, $striker, $ranger, $mage, $warlock, $paladin, $mystic, $assassin, $a2mage){
    $this->deleteEvent($event);
    $query =
      "INSERT INTO dbo.BL_PT_ADM_002_03
        (event_id, class_type, cash_item_id)
      VALUES ";

    $query.="(".$event.",0,".$guardian.")";
    $query.=",(".$event.",1,".$berserker.")";
    $query.=",(".$event.",2,".$striker.")";
    $query.=",(".$event.",3,".$ranger.")";
    $query.=",(".$event.",4,".$mage.")";
    $query.=",(".$event.",5,".$warlock.")";
    $query.=",(".$event.",6,".$paladin.")";
    $query.=",(".$event.",7,".$mystic.")";
    $query.=",(".$event.",8,".$assassin.")";
    $query.=",(".$event.",9,".$a2mage.")";

    $this->bo->getDB('middle')->prepare($query)->set();

    ActionLog::write2(array(
      'act_type'    => 'BlessEventLevel::Insert',
      'target'      => $event,
      'value'       => array( $guardian, $berserker, $striker, $ranger, $mage, $warlock, $paladin, $mystic, $assassin, $a2mage),
      'extra1'      => $_SESSION['user']['name']
    ));

    return true;
  }

  function deleteEvent($event){
    $query = "DELETE FROM dbo.BL_PT_ADM_002_03 WHERE event_id=:event";
    $this->bo->getDB('middle')->prepare($query)->bindParam('event', $event)->set();

    ActionLog::write2(array(
      'act_type'    => 'BlessEventLevel::DELETE',
      'target'      => $event,
      'extra1'      => $_SESSION['user']['name']
    ));
  }

}

?>
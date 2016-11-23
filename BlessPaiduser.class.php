<?php

/**
 * BlessPaiduser Class
 * @author leeejong@neowiz.com 2015.12.18
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessPaiduser {
  private $bo;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function searchUser($type, $key, $func){
    $usn = $type=='id' ? $this->bo->getUsn( $key ) : $key;
    if ( $usn ){
      if($func == 1){
        $query =  "SELECT * FROM dbo.BL_GT_GIFTBOX WHERE usn=:usn and expire_date>=:today";
      }
      else if($func == 2){
        $query =  "SELECT * FROM dbo.BL_GT_GIFTBOX WHERE usn=:usn and expire_date<:today";
      }
      else if($func == 3){
        $query =  "SELECT * FROM dbo.BL_GT_GIFTBOX WHERE usn=:usn and status='N' and expire_date<:today";
      }
      else{
        return 'error';
      }
      return $this->bo->getDB( 'middle' )->prepare( $query )
        ->bindParam( 'usn', $usn )
        ->bindParam( 'today' , Date('Y-m-d H:i:s'))
        ->get();


    }
    else {
      error( 'No user' );
    }
  }

  function searchLog($type, $server, $key){
    $usn = $type=='id' ? $this->bo->getUsn( $key ) : $key;
    if ( $usn ){
      $query =  "SELECT * FROM dbo.DBAccountOpenedGiftBox WHERE usn=:usn";
      return $this->bo->getDB( 'game', $server )->prepare( $query )
        ->bindParam( 'usn', $usn )
        ->get();
    }
    else {
      error( 'No user' );
    }
  }

  function searchHistory($type, $key, $start, $end){
    // Todo ::기간 1달로 수정해야함

    $usn = $type=='id' ? $this->bo->getUsn( $key ) : $key;
    if ( $usn ){
      return $this->bo->getDB( 'middle' )->prepare( "SELECT * FROM dbo.BL_LT_GIFTBOX WHERE usn=:usn and reg_date>=:start and reg_date<=:end" )
        ->bindParam( 'usn', $usn )
        ->bindParam( 'start', $start )
        ->bindParam( 'end', $end )
        ->get();
    }
    else {
      error( '존재하지 않는 유저입니다' );
    }
  }

  function modifyGiftbox($type, $id){
    $query = "EXEC dbo.USP_BL_NW_GIFTBOX_STATUS :id, :type, 'Y', :result";
    $this->bo->getDB('middle')->prepare($query)->bindParam('id',$id)->bindParam('type', $type)->bindInOutParam('result',$result)->set();
    return $result;
  }

  function getAdmGMLevel(){
    return $this->bo->getAdmGMLevel();
  }

}

?>
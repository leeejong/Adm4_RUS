<?php

/**
 * BlessLogtype Class
 * @author leeejong@neowiz.com 2016.3.8
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessLogtype {
  private $bo;
  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  //logtype.val(), upload.val(), codename.val(), desc.val()
  function insertLogtype($logtype, $upload, $codename, $desc){
    $logdb = $this->bo->getDB('logw','01');
    $logdb->prepare("
      INSERT INTO BL_BT_UPLOAD_LOGTYPE
        (log_type, upload_yn, code_name, code_desc)
      VALUES
        (:logtype, :upload, :codename, :desc) ")
      ->bindParam('logtype',$logtype)
      ->bindParam('upload',$upload)
      ->bindParam('codename',$codename)
      ->bindParam('desc',$desc)
      ->set();
    return true;
  }

  function syncEvent() {
    $logtype = $this->bo->getDB('logw','01')
      ->prepare("SELECT * FROM BL_BT_UPLOAD_LOGTYPE" )->get();

    $oClass = new EnvRemoteProcessCall( 'http://adm.nwz.kr/ajax_gateway.php' );
    $result = $oClass->execSync( $logtype );
    return $result;
  }

  function execSync( $logtype ) {
    $logDB1   = $this->bo->getDB( 'logw', '01' );

    $logDB1->beginTransaction();

    $logDB1->prepare("DELETE FROM BL_BT_UPLOAD_LOGTYPE")->set();

    $query = "INSERT INTO BL_BT_UPLOAD_LOGTYPE
        (log_type, upload_yn, code_name, code_desc)
      VALUES
        (:log_type, :upload_yn, :code_name, :code_desc)";

    //LogDB -> BL_BT_LOG_EVENT (장비3대)
    $logDB1->prepare( $query );
    foreach ( (array) $logtype as $k => $v ) {
      foreach ( $v as $key => $value ){
        $logDB1->bindparam( $key, $value );
      }
      $logDB1->set();
    }

    $logDB1->commit();

    ActionLog::write2(array(
      'act_type'    => 'BlessLogtype::execSync',
      'value'       => $_SESSION['user']['name']
    ));

    return true;
  }

}

?>
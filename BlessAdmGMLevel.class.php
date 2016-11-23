<?php

/**
 * BlessAdmGMLevel Class
 * @author sungje@neowiz.com 2015.03.13
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessAdmGMLevel {

  use ClientTable;

  function __construct($arg1 = null, $arg2 = null) {
    $this->gamedata = new BlessGameData();
  }

  /**
   * 어드민 계정 정보 조회
   * @param  $level
   * @return array
   */
  function getAdminMemberInfo( string $searchtype, string $keyword ){

    $sql = 'SELECT A.msn, B.gm_level, B.reg_date, B.reg_msn, A.id, A.name, C.teamname, D.id as reg_id, D.name as reg_name    ';
    $sql .= ' FROM adm_auth.au_member A LEFT OUTER JOIN adm_common.bl_gm_level B ON A.msn=B.msn';
    $sql .= '   	LEFT OUTER JOIN adm_auth.au_team C ON A.teamsrl=C.teamsrl';
    $sql .= '       LEFT OUTER JOIN adm_auth.au_member D ON B.reg_msn=D.msn';

    switch( $searchtype ){
      case 'admid' :    $sql .= ' WHERE A.id like :keyword';
                        $keyword = $keyword . '%';
                        break;
      case 'admname' :  $sql .= ' WHERE A.name like :keyword';
                        $keyword = $keyword . '%';
                        break;
      case 'msn' :      $sql .= ' WHERE A.msn = :keyword'; break;
    }

    return DB::instance('adm_common')->prepare( $sql )
      ->bindParam( 'keyword', $keyword )
      ->get();
  }


  /**
   * 사용자 MSN 검색
   * @param string $searchtype
   * @param string $keyword
   * @return  USN
   */
  function getMsn( string $searchtype, string $keyword ){

    switch( $searchtype ){
      case 'admid' : return DB::instance('adm_common')->prepare( 'SELECT msn FROM adm_auth.au_member WHERE id = :id' )
                              ->bindParam( 'id', $keyword )->getTop()['msn'];
      case 'admname' : return DB::instance('adm_common')->prepare( 'SELECT msn FROM adm_auth.au_member WHERE name = :name' )
                              ->bindParam( 'name', $keyword )->getTop()['msn'];
    }

    error('잘못된 검색');

  }

  /**
   * 사용자 웹 캐쉬 갱신
   * @param  $usn
   */
  function refreshUserCache(  $usn ){

    $args = array($usn);

    Pmang::callPmangClass('GameBlessBO', 'clearSessionDB', $args);

  }

  /**
   * GM 등급별 어드민 계정 조회
   * @param  $level
   * @return array
   */
  function getAdminList(  $level ){

    $sql = 'SELECT A.msn, B.gm_level, B.reg_date, B.reg_msn, A.id, A.name, C.teamname, D.id as reg_id, D.name as reg_name    ';
    $sql .= ' FROM adm_common.bl_gm_level B LEFT OUTER JOIN adm_auth.au_member A ON A.msn=B.msn';
    $sql .= '   	LEFT OUTER JOIN adm_auth.au_team C ON A.teamsrl=C.teamsrl';
    $sql .= '       LEFT OUTER JOIN adm_auth.au_member D ON B.reg_msn=D.msn';
    $sql .= ' WHERE B.gm_level = :gm_level';

    return DB::instance('adm_common')->prepare( $sql )
      ->bindParam( 'gm_level', $level )
      ->get();
  }

  /**
   * GM 등급별 어드민 계정 조회
   * @param  $level
   * @return array
   */
  function setGMLevel(  $msn,  $level ){
    debug('setGMLevel... msn : '.$msn.',level : '.$level);
    $admGMLevel = $this->gamedata->getAdmGMLevel();

    if ($admGMLevel != 1) {
      debug('setGMLevel... 권한 부족 GMLevel: '.$admGMLevel);
      ActionLog::write( 'fail GM Level', $msn, array(
        'msn'      => $msn,
        'gm_level' => $level,
        'reg_msn'  => $_SESSION['user']['msn'],
      ));
      error('권한이 부족합니다.');
      return;
    }

    $sql = 'INSERT INTO adm_common.bl_gm_level(msn, gm_level, reg_date, reg_msn)';
    $sql .= ' VALUES (:msn, :gm_level, :reg_date, :reg_msn)';
    $sql .= ' ON DUPLICATE KEY ';
    $sql .= ' UPDATE gm_level=:gm_level';

    DB::instance('adm_common')->prepare( $sql )
              ->bindParam('msn', $msn)
              ->bindParam('gm_level', $level)
              ->bindParam('reg_date', date('YmdHis'))
              ->bindParam('reg_msn', $_SESSION['user']['msn'])
              ->set();

    ActionLog::write( 'set GM Level', $msn, array(
      'msn'      => $msn,
      'gm_level' => $level,
      'reg_msn'  => $_SESSION['user']['msn'],
    ));
  }

  function getAdmGMLevel(){
    return $this->gamedata->getAdmGMLevel();
  }
}

?>
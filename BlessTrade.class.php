<?php

/**
 * BlessTrade Class
 * @author leeejong@neowiz.com
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessTrade {
  private $bo;
  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function getTradeInfo($type, $server_id, $keyword){
    debug($type.'+'.$server_id.'+'.$keyword);

    // 거래번호, USN, CSN
    // 찾을수 있는 정보가 있는지 찾아준다.
    // 1. 거래번호의 경우 테이블 네개를뒤져서 어느테이블에 정보가있는지 표시해준다.
    // 2. User의 경우 유효한 유저인지 찾아, 유저정보를 리턴한다
    // 3. Character의 경우 유효한 Character인지 찾아 캐릭터정보를 리턴한다. 이때 서버정보가 필요하다.

    if($type=='id'){
      if(!is_numeric($keyword)) error('올바르지 않은 거래번호입니다');
      $query = "
          DECLARE @id int
          SET @id = :id
          (SELECT auction_id, 'GT_AUICTION(등록정보)' as tablename FROM BL_GT_AUCTION WHERE auction_id=@id)
            UNION
          (SELECT auction_id, 'LT_AUCTION(거래내역)' as tablename FROM BL_LT_AUCTION WHERE auction_id=@id)
            UNION
          (SELECT auction_id, 'GT_AUCTION_OUTBOX(수령탭정보)' as tablename FROM BL_GT_AUCTION_OUTBOX WHERE auction_id=@id)
            UNION
          (SELECT auction_id, 'LT_AUCTION_OUTBOX(수령내역)' as tablename FROM BL_LT_AUCTION_OUTBOX WHERE auction_id=@id)
        ";
      $auctionInfo = $this->bo->getDB('middle')->prepare($query)->bindParam('id', $keyword)->get();
      $result = array();
      $result['auction_id'] = $auctionInfo[0]['auction_id'];
      foreach($auctionInfo as $key => $value){ $result['Table'.$key] = $value['tablename']; }
      return [$result];
    }
    else{
      if($type=='user'){
        $account_id = $this->bo->getUsn( $keyword );
      }
      else{
        if( !is_numeric($keyword) && !$keyword = $this->bo->getNameToCsn($keyword, $server_id) )
          error('케릭터가 없거나 삭제되어 찾을 수 없습니다. - '.$keyword);
        $account_id = $this->bo->getCsnToUsn($keyword, $server_id);
      }

      if( !$account_id || !$user = $this->bo->getUsnToAccountInfo($account_id) )
        error(msg('게임 이용자가 아닙니다. - ','Bless').$keyword);

      if( getAdmConfig('EnvName') == 'adm' )
        $user['userid'] = Pmang::getPmangID($user['usn']);
      else
        $user['userid'] = '';
      if($type=='character') $user['csn']=$keyword;
      unset($user['lastaccessserverid']);
      unset($user['gmlevel']);
      unset($user['regdate']);
      return [$user];
    }
  }

  function getAuction( $type, $server, $key){
    switch($type){
      case 'id':
        $query = "SELECT * FROM BL_GT_AUCTION WHERE auction_id =:target";
        break;
      case 'user':
        $query = "SELECT * FROM BL_GT_AUCTION WHERE usn =:target";
        break;
      case 'character':
        $query = "SELECT * FROM BL_GT_AUCTION WHERE csn =:target";
        break;
    }
    return $this->bo->getDB('middle')->prepare($query)->bindParam('target', $key)->get();
  }

  function getAuctionLog( $type, $server, $key, $start, $end){
    debug($start);
    debug($end);
    switch($type){
      case 'id':
        $query = "SELECT * FROM BL_LT_AUCTION WHERE auction_id =:target and reg_date>=:start and reg_date<=:end";
        break;
      case 'user':
        $query = "
          DECLARE @usn int
          SET @usn = :target
          SELECT * FROM BL_LT_AUCTION WHERE (usn=@usn or buy_usn=@usn)
           and reg_date>=:start and reg_date<=:end
          ";
        break;
      case 'character':
        $query = sprintf( "SELECT * FROM BL_LT_AUCTION WHERE world_id=%s and csn =:target
          and reg_date>=:start and reg_date<=:end", $server );
        break;
    }
    return $this->bo->getDB('middle')->prepare($query)
      ->bindParam('target', $key)
      ->bindParam('start', $start)
      ->bindParam('end', $end)
      ->get();
  }

  function getOutbox( $type, $server, $key){
    switch($type){
      case 'id':
        $query = "SELECT * FROM BL_GT_AUCTION_OUTBOX WHERE auction_id =:target";
        break;
      case 'user':
        $query = "SELECT * FROM BL_GT_AUCTION_OUTBOX WHERE usn =:target";
        break;
      case 'character':
        $query = sprintf( "SELECT * FROM BL_GT_AUCTION_OUTBOX WHERE active_world=%s and active_csn =:target", $server);
        break;
    }
    return $this->bo->getDB('middle')->prepare($query)->bindParam('target', $key)->get();
  }

  function getOutboxLog( $type, $server, $key, $start, $end){
    switch($type){
      case 'id':
        $query = "SELECT * FROM BL_LT_AUCTION_OUTBOX WHERE auction_id =:target and reg_date>=:start and reg_date<=:end";
        break;
      case 'user':
        $query = "SELECT * FROM BL_LT_AUCTION_OUTBOX WHERE usn =:target and reg_date>=:start and reg_date<=:end";
        break;
      case 'character':
        $query = sprintf( "SELECT * FROM BL_LT_AUCTION_OUTBOX WHERE active_world=%s and active_csn =:target
           and reg_date>=:start and reg_date<=:end ", $server);
        break;
    }
    return $this->bo->getDB('middle')->prepare($query)
      ->bindParam('target', $key)
      ->bindParam('start', $start)
      ->bindParam('end', $end)
      ->get();
  }

  function cancelAuction($id, $usn){
    $this->bo->getDB('middle')->prepare("EXEC USP_BL_NW_AUCTION_DEL  :id, :usn, 2, 'N', :ret")
      ->bindParam('id',$id)
      ->bindParam('usn',$usn)
      ->bindInOutParam('ret', $spResult)
      ->set(true);
    debug('**************2****');
    debug($spResult);
    debug('******************');
    return $spResult;

  }

  function removeOutbox($id, $usn){
    $this->bo->getDB('middle')->prepare("EXEC USP_BL_NW_AUCTION_OUTBOX_OPEN  :id, :usn, 0,0,0,0,2, 'N', :ret")
      ->bindParam('id',$id)
      ->bindParam('usn',$usn)
      ->bindInOutParam('ret', $spResult)
      ->set(true);
    debug('****************3**');
    debug($spResult);
    debug('******************');
    return $spResult;

  }

  function restoreOutbox($id, $usn){
    $this->bo->getDB('middle')->prepare("EXEC USP_BL_NW_AUCTION_OUTBOX_RESTORE  :id, :usn, 'N', :ret")
      ->bindParam('id',$id)
      ->bindParam('usn',$usn)
      ->bindInOutParam('ret', $spResult)
      ->set(true);
    debug('******************');
    debug($spResult);
    debug('******************');
    return $spResult;

  }

  function setNormal($id){
    return $this->bo->getDB('middle')->prepare("UPDATE BL_GT_AUCTION_OUTBOX SET in_type = 5 WHERE outbox_id=:id")
      ->bindParam('id',$id)
      ->set();
  }

  function setEnddate($id){
    return $this->bo->getDB('middle')->prepare("UPDATE BL_GT_AUCTION_OUTBOX SET expire_date = DATEADD(D, 10, GETDATE()) WHERE outbox_id=:id")
      ->bindParam('id',$id)
      ->set();
  }

  function searchDetail( $id ) {
    $query = "SELECT tool_tip FROM BL_GT_AUCTION WHERE auction_id =:target";
    $result = $this->bo->getDB( 'middle' )->prepare($query)->bindParam('target',$id)->getTop();
    $detailJson = json_decode($result['tool_tip']);
    $all_label_list = array(
      8 => '평균 무기 공격력',
      9 => '무기 공격력',
      10 => '평균 무기 주문 공격력',
      11 => '무기 주문 공격력',
      12 => '물리 방어도',
      13 => '마법 방어도',
      14 => '힘',
      15 => '민첩',
      16 => '지능',
      17 => '지혜',
      18 => '체력',
      19 => '기교',
      20 => '균형',
      21 => '신속',
      22 => '가속도',
      23 => '적중',
      24 => '치명타',
      25 => '회피',
      26 => '무기 막기',
      27 => '무기 피해 흡수',
      28 => '방패 막기',
      29 => '마법저항',
      30 => '굳건함',
      31 => '방패 피해 흡수',
      32 => '밀쳐짐 감소',
      34 => '잠재력 단계',
      35 => '장비 개조 횟수',
      37 => '전설 옵션 이름',
      38 => '전설 옵션 효과',
      40 => '지속 효과 이름',
      41 => '지속 효과 내용',
    );
    $detailList = array();
    //debug($detailJson);

    foreach((array)$detailJson as $key=>$value){
      if($value->Label > 0){
        $value->name = $all_label_list[$value->Label];
        debug($value);
        $detailList[] = $value;
      }
    }
    return $detailList;
  }

}

?>
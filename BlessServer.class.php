<?php

/**
 * BlessServer Class
 * @author leeejong@neowiz.com 2015.09.01
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessServer {

  private $bo;
  use ClientTable;


  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }


  function getCU(){
    $jorbiDB = DB::instance('jorbi_bl');
    //return $jorbiDB->prepare("SELECT * FROM CU WHERE Chid=:chid ORDER BY idx desc LIMIT 1")->bindParam('chid',1)->get();
    $globalDB  = $this->bo->getDB('global');
    $result = array();
    $result[0] = array();
    $result[1] = array();
    $change = 0;
    $hTotal = 0;
    $uTotal = 0;

    $serverList = $globalDB->prepare('SELECT * FROM dbo.worldserver_info')->get();
    foreach( $serverList as $serverInfo ){
      $row = $jorbiDB->prepare("SELECT * FROM CU WHERE Chid=:chid ORDER BY idx desc LIMIT 2")->bindParam('chid',$serverInfo['server_id'])->get();
      $query = "
        DECLARE @hcount int;
        DECLARE @ucount int;
        EXEC BLSP_Native_GetRealmCountForRestrict 14, @hcount output, @ucount output;
        SELECT h = @hcount, u = @ucount;
      ";
      $usncount = $this->bo->getDB('game', $serverInfo['server_id'])->prepare($query)->get();

      $row[0]['hcount'] = $usncount[0]['h'];
      $row[0]['ucount'] = $usncount[0]['u'];
      $hTotal+=$usncount[0]['h'];
      $uTotal+=$usncount[0]['u'];

      foreach( $serverInfo as $key => $value){
        $row[0][$key] = $value;
      }

      //전서버정보
      $result[0][0]['totalcu'] += $row[0]['cu'];
      $result[0][0]['waiting'] += $row[0]['cu3'];
      $result[0][0]['lobby'] += $row[0]['cu4'];
      $result[0][0]['hiran'] += $row[0]['cu1'];
      $result[0][0]['union'] += $row[0]['cu2'];
      $result[0][0]['ingame'] += $row[0]['cu1'] + $row[0]['cu2'];
      $result[0][0]['regdate'] = $row[0]['regdate'];

      //모든서버 이전CU를 다 더한거에서 모든서버 현재CU를 뺀다.
      $change += $row[0]['cu'] - $row[1]['cu'];
      $row[0]['change'] = $row[0]['cu'] - $row[1]['cu'];

      //개별서버정보
      $row[1] = null;
      $result[1][] = $row[0];

    }

    $result[0][0]['change'] += $change;
    $result[0][0]['hcount'] += $hTotal;
    $result[0][0]['ucount'] += $uTotal;
    $result[0][0]['usncount'] = $hTotal + $uTotal;

    return $result;
  }

  function getServerInfo(){
    return $this->bo->getDB('global')->prepare("SELECT * FROM WorldServer_Info WHERE server_id<=100")->get();
  }

  function getAuctionRestrictInfo(){
    $AuthBO = new AuthBO();
    $senderInfo = $AuthBO->memberInfo($_SESSION['user']['msn']);
    return $this->bo->getDB('middle')->prepare("SELECT * FROM BL_GT_AUCTION_DENY_WORLD ORDER BY world_id asc")->get();
  }

  function insertAuctionRestrict($world_id){
    $AuthBO = new AuthBO();
    $senderInfo = $AuthBO->memberInfo($_SESSION['user']['msn']);
    return $this->bo->getDB('middle')->prepare("INSERT BL_GT_AUCTION_DENY_WORLD (world_id, reg_usn) VALUES (:world_id, :reg_usn)")
      ->bindParam('world_id', $world_id)
      ->bindParam('reg_usn', $senderInfo['msn'])
      ->set();
  }

  function removeAuctionRestrict($world_id){
    return $this->bo->getDB('middle')->prepare("DELETE FROM BL_GT_AUCTION_DENY_WORLD WHERE world_id=:world_id")
      ->bindParam('world_id', $world_id)->set();
  }

  function refreshCU(){
    //$this->bo->reloadServer();
    return $this->bo->refreshCU();
  }

  function deleteCache(){
    Cache::removeFileCache('BL_gameCU');
    return true;
  }

  function getRealTimeCU( ){
        $call = curl_init( "http://gms.pmang.com/gms_remote/cu_parameter.aspx?ssn=347" );
        curl_setopt($call, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($call, CURLOPT_HEADER, 0);
        $ret = curl_exec( $call) ;
        curl_close($call);
        $ret = explode("\n", $ret);
        $r = json_decode( substr($ret[0],1,strlen($ret[0])-3) );
        $r->token = sha1(session_name()+date('Ym'));
        return $r;
  }

  function getGameCU(){
    return Cache::useFileCache('BL_gameCU', 60, function(){

      $f = (int)strtotime( "-60minute", time());
      $t = (int)time();
      $from = date("Y-m-d H:i:s", $f);
      $to = date("Y-m-d H:i:s", $t);
      if(Util::is_dev()){
        $query = "select chid, substring(regdate, 12, 8) as regdate, cu, cu1, cu2, cu3, cu4 from CU where chid<=4 and gssn=:ssn and regdate>=:from and regdate<=:to order by regdate asc";
      }
      else{
        $query = "select chid, substring(regdate, 12, 8) as regdate, cu, cu1, cu2, cu3, cu4 from CU where chid<=100 and gssn=:ssn and regdate>=:from and regdate<=:to order by regdate asc";
      }

      return DB::instance( 'jorbi_bl' )
        ->prepare( $query )
        ->bindParam('ssn', 347)
        ->bindParam('from', $from)
        ->bindParam('to', $to)
        ->get();
    });
  }

  function getGameCUforGraphRange( $server, $start, $end ) {
    $query = "select chid, regdate, cu, cu1, cu2, cu3, cu4 from CU where chid=:chid and gssn=:ssn and regdate>=:from and regdate<=:to order by regdate asc";
    if($server==-1){
      $wholeResult = array();
      $wholeResultCount = array();
      $serverList = $this->bo->getDB('global')->prepare('SELECT * FROM dbo.worldserver_info')->get();
      foreach( $serverList as $serverInfo ){
        $subResult = DB::instance( 'jorbi_bl' )
          ->prepare( $query )
          ->bindParam( 'chid', $serverInfo['server_id'] )
          ->bindParam( 'ssn', 347 )
          ->bindParam( 'from', $start )
          ->bindParam( 'to', $end )
          ->get();

        foreach($subResult as $key => $value){
          $newKey = trim($value['regdate']);
          str_replace('-','',$newKey);
          str_replace(':','',$newKey);
          (int)str_replace(' ','', $newKey);
          $wholeResultCount[$newKey] += 1;
          $wholeResult[$newKey]+=$value['cu'];
        }
      }
      $finalResult = array();
      $serverCount = count($serverList);
      foreach($wholeResult as $key => $value){
        if($serverCount==$wholeResultCount[$key] || $serverCount==$wholeResultCount[$key]+1){
        //if($serverCount==$wholeResultCount[$key]){
          $sub = new stdClass();
          $sub->key = $key;
          $sub->regdate = (String)$key;
          $sub->cu = $value;
          $sub->count = $wholeResultCount[$key];
          $finalResult[] = $sub;
        }
      }
      function cmp($a, $b){
        if($a->key == $b->key) return 0;
        return ($a->key < $b->key) ? -1 : 1;
      }
      usort( $finalResult, "cmp" );
      return $finalResult;
    }
    else{
      $subResult =  DB::instance( 'jorbi_bl' )
          ->prepare( $query )
          ->bindParam( 'chid', $server )
          ->bindParam( 'ssn', 347 )
          ->bindParam( 'from', $start )
          ->bindParam( 'to', $end )
          ->get();
      return $subResult;
      }
    }



  function getGameCUforGraph( $server ){

    return Cache::useFileCache('BL_gameCUforGraph'.$server, 60*3, function() use($server){

      $f = (int)strtotime( "-12hour", time());
      $t = (int)time();
      $from = date("Y-m-d H:i:s", $f);
      $to = date("Y-m-d H:i:s", $t);

      $query = "select chid, regdate, cu, cu1, cu2, cu3, cu4 from CU where chid=:chid and gssn=:ssn and regdate>=:from and regdate<=:to order by regdate asc";

      return DB::instance( 'jorbi_bl' )
        ->prepare( $query )
        ->bindParam('chid', $server)
        ->bindParam('ssn', 347)
        ->bindParam('from', $from)
        ->bindParam('to', $to)
        ->get();
    });
  }

  function getGameCUforWholeGraph( $server ){

    return Cache::useFileCache('BL_gameCUforGraph'.$server, 60*3, function() use($server){

      $f = (int)strtotime( "-12minute", time());
      $t = (int)time();
      $from = date("Y-m-d H:i:s", $f);
      $to = date("Y-m-d H:i:s", $t);

      $query = "select chid, substring(regdate, 12, 8) as regdate, cu, cu1, cu2, cu3, cu4 from CU where chid<4 and gssn=:ssn and regdate>=:from and regdate<=:to order by regdate asc";

      $subResult = DB::instance( 'jorbi_bl' )
        ->prepare( $query )
        ->bindParam('ssn', 347)
        ->bindParam('from', $from)
        ->bindParam('to', $to)
        ->get();


      foreach($subResult as $key => $value){

      }

    });
  }

  function getHistory(){
    return DB::instance('adm_local')->prepare("SELECT * FROM adm_local.bl_serveredit_log ORDER BY log_seq desc")->get();
  }

  function getCU_stat($time, $number){

    return DB::instance('jorbi_bl')
      ->prepare(
        sprintf("SELECT * FROM CU WHERE regdate<=:time ORDER BY idx desc LIMIT %d",$number))
      ->bindParam('time',$time)
      ->get();
    //return 1;
  }
  function getCU_setting(){
    return DB::instance('jorbi_bl')->prepare("SELECT * FROM CU ORDER BY idx desc LIMIT 15")->get();
  }

  public function editServerTrade($server_id, $all, $auction, $post, $personal, $warehouse, $memo ){
    $this->bo->setServerTrade($server_id, $all, $auction, $post, $personal, $warehouse);
    $AuthBO = new AuthBO();
    $editor = $AuthBO->memberInfo($_SESSION['user']['msn']);

    $localDB = DB::instance('adm_local');
    $query  =  "
      INSERT INTO adm_local.bl_serveredit_log
        (server_id, target, beforeValue, afterValue, reason, editor, reg_date)
      VALUES
        (:server_id, :target, :before, :after, :reason, :editor, :reg_date)
      ";

    $localDB->prepare( $query )
      ->bindParam('server_id', $server_id)
      ->bindParam('target', '거래제한')
      ->bindParam('before', '')
      ->bindParam('after', $all.$auction.$post.$personal.$warehouse)
      ->bindParam('reason', $memo)
      ->bindParam('editor', $editor['name'])
      ->bindParam('reg_date', date('YmdHis'))
      ->set();

    ActionLog::write2(array(
      'act_type'    => 'BL Server Setting',
      'target'      => '거래제한',
      'server'      => $server_id,
      'value'       => $all.','.$auction.','.$post.','.$personal.','.$warehouse,
      'reason'      => $memo
    ));

    return true;
  }

  public function modifyServerInfo( $server_id, $c_name, $bef, $aft, $reason ){


    SWITCH($c_name){
      case 'max_cu':
        $this->bo->setMaxCU($server_id, $aft);
        break;

      case 'open_login':
        $this->bo->setServerOpen($server_id, $aft);
        break;

      default:
//        //'stop_all_trade','stop_auction','stop_mail','stop_personal_trade','stop_warehouse'
//        $this->bo->getDB('global')
//          ->prepare( sprintf( 'UPDATE %s SET %s =:value WHERE server_id=:server_id', 'WorldServer_Info', $c_name ) )
//          ->bindParam('value',$aft)->bindParam('server_id',$server_id)->set();
        break;
    }

    $AuthBO = new AuthBO();
    $editor = $AuthBO->memberInfo($_SESSION['user']['msn']);

    //bl_serveredit_log
    $localDB = DB::instance('adm_local');
    $query  =  "
      INSERT INTO adm_local.bl_serveredit_log
        (server_id, target, beforeValue, afterValue, reason, editor, reg_date)
      VALUES
        (:server_id, :target, :before, :after, :reason, :editor, :reg_date)
      ";

    $localDB->prepare( $query )
      ->bindParam('server_id', $server_id)
      ->bindParam('target', $c_name)
      ->bindParam('before', $bef)
      ->bindParam('after', $aft)
      ->bindParam('reason', $reason)
      ->bindParam('editor', $editor['name'])
      ->bindParam('reg_date', date('YmdHis'))
      ->set();


    ActionLog::write2(array(
      'act_type'    => 'BL Server Setting',
      'target'      => $c_name,
      'server'      => $server_id,
      'value'       => $aft,
      'reason'      => $reason
    ));

    return true;
  }

  function reloadServer(){
    return $this->bo->reloadServer();
  }

  function alertMail($server, $delta){
    $AuthBO = new AuthBO();
    $senderInfo = $AuthBO->memberInfo($_SESSION['user']['msn']);
    $receiverInfo = $senderInfo;
    //$receiverInfo = $AuthBO->memberInfo($result['msn']);
    $subject = "접속자 변화 감지 Alert Mail";
    $message = $server." 에 접속자 변화를 감지했습니다 \n 변동량 = ".$delta;
    Mail::send($senderInfo['email'], $receiverInfo['email'], $subject, $message);
  }
}
?>
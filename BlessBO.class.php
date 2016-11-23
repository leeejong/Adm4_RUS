<?php

/**  
 * BlessBO Class
 * @author bitofsky@neowiz.com 2013.06.03
 * @modified leeejong@neowiz.com 2016.1.25
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessBO {

  /**
   * BlessUserLink 연동용 유져 ID/Name 검색
   * @param  $server_id
   * @param string $search_type
   * @param string $keyword
   * @return string
   */
  public function getBlessUserLink(  $server_id, string $search_type,  $keyword ){
    if( $search_type == 'account' )
      return getAdmConfig('EnvName') == 'adm' ? Pmang::getPmangID($keyword) ?: $keyword : $keyword;
    elseif( $search_type == 'character' )
      return $this->getCsnToCharacterInfo( $keyword, $server_id )['player_name'] ?: $keyword;
    return $keyword;
  }

  /**
   * 사용자 계정 검색
   * @param string $search_type account / character
   * @param string $search_key
   * @param  $server_id
   * @return array
   */
  public function getUserInfo( string $search_type, string $search_key, $server_id ){

    if( !$keyword=trim($search_key) ) error(msg('Please insert keyword.','Bless'));

    $user = null;

    switch( $search_type ){

      case 'account':
        $account_id = $this->getUsn( $keyword );
        break;

      case 'character':
        if( !is_numeric($keyword) && !$keyword = $this->getNameToCsn($keyword, $server_id) )
          error('No Character. - '.$search_key);
        $account_id = $this->getCsnToUsn($keyword, $server_id);
        break;

      case 'guild':
        if( is_numeric($keyword)) {
          $guild_info = $this->getGuildInfo($keyword, $server_id);
        } else {
          $guild_info = $this->getGuildNameToGuildInfo($keyword, $server_id);
        }
        if (!$guild_info) {
          error('No Guild. - '.$search_key);
          return;
        }

        // 길드장으로 검색
        $csn = $this->getGuildIdToGuildTopCsn($guild_info[0]['db_id'], $server_id);
        $account_id = $this->getCsnToUsn($csn, $server_id);
        break;
    }

    if( !$account_id || !$user = $this->getUsnToAccountInfo($account_id) )
      error(msg('No Account. - ','Bless').$search_key);

    if( getAdmConfig('EnvName') == 'adm' )
      $user['userid'] = Pmang::getPmangID($user['usn']);
    else
      $user['userid'] = '';

    //유료화정보 추가
    $gradeInfo = $this->getDB('middle')->prepare("SELECT b.grade_name, b.grade, a.amount FROM dbo.BL_GT_GRADE a LEFT OUTER JOIN dbo.BL_BT_GRADE b ON a.grade=b.grade WHERE a.usn=:usn" )->bindParam('usn',$account_id)->getTop();
    $vipInfo   = $this->getDB('middle')->prepare("
       SELECT a.level, b.vip_name, a.eff_start_date, a.eff_end_date
       FROM dbo.BL_GT_VIP a LEFT OUTER JOIN dbo.BL_BT_VIP b ON a.level=b.level
       WHERE a.usn=:usn and a.eff_end_date>= GETDATE() and a.eff_start_date<=GETDATE()
       ORDER BY a.level DESC" )
      ->bindParam('usn',$account_id)
      ->getTop();
    $user['grade']      = $gradeInfo['grade_name'] ? $gradeInfo['grade_name'] : 'NoGrade';
    $user['grade_num']  = $gradeInfo['grade'] ? $gradeInfo['grade'] : 0;
    $user['gradePoint'] = $gradeInfo['amount'] ? $gradeInfo['amount'] : 0;
    $user['vip_level']     = $vipInfo['level'] ? $vipInfo['level'] : 0;
    $user['vip']        = $vipInfo['vip_name'] ? $vipInfo['vip_name'] : '-';
    $user['vipStart']   = $vipInfo['eff_start_date'] ? $vipInfo['eff_start_date'] : '';
    $user['vipEnd']     = $vipInfo['eff_end_date'] ?  $vipInfo['eff_end_date'] : '';

    return $user;

  }

  /**
   * 게임 서버 리스트 조회
   * @return array
   */
  public function getServerInfo(){
    return $this->getDB('global')->prepare('SELECT * FROM dbo.worldserver_info')->get();
  }

  public function getFunctionInfo(){
    return DB::instance('adm_local')->prepare('SELECT * FROM bl_schedule_job')->get();
  }

  /**
   * DB 인스턴스 반환
   * @param string $name global / game / log
   * @param  $server_id
   * @return DB
   */
  public function getDB( string $name,  $server_id=null ){

    if( $server_id )
      return DB::instance(sprintf('bless_%s_%02d', $name, $server_id));
    else
      return DB::instance('bless_'.$name);

  }

  /**
   * USN 조회
   * @param string $account_id USN 또는 UserID
   * @return  USN
   */
  public function getUsn( string $account_id ){

    if( getAdmConfig('EnvName') == 'adm' )
      return Pmang::getUsn( $account_id );
    else
      return intval( $account_id );

  }

  /**
   * 케릭터명으로 CSN 조회
   * @param string $name
   * @param  $server_id
   * @return  CSN
   */
  public function getNameToCsn( string $name,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT db_id as csn FROM dbo.dbplayer WHERE player_name = :name AND unreg_flag = 0')->bindParam('name', $name)->getTop()['csn'];
  }

  /**
   * CSN으로 케릭터정보 조회
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getCsnToCharacterInfo(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare(sprintf('SELECT *, %d as server_id FROM dbo.dbplayer WHERE db_id = :csn', $server_id))->bindParam('csn', $csn)->getTop();
  }

  /**
   * 길드명으로 길드정보 조회
   * @param string $guild_name
   * @param  $server_id
   * @return array
   */
  public function getGuildNameToGuildInfo( string $guild_name,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT * FROM dbo.dbguild WHERE name = :guild_name')->bindParam('guild_name', $guild_name)->get();
  }

  /**
   * 길드정보로 길드원(grade_type=0) 조회
   * @param  $guild_id
   * @param  $server_id
   * @return array
   */
  public function getGuildIdToGuildTopCsn(  $guild_id,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT player_db_id as csn FROM dbo.dbguildmember WHERE guild_db_id = :guild_id and grade_type=0')->bindParam('guild_id', $guild_id)->getTop()['csn'];
  }

  /**
   * CSN으로 USN조회
   * @param  $csn
   * @param  $server_id
   * @return  USN
   */
  public function getCsnToUsn(  $csn,  $server_id ){
    return $this->getCsnToCharacterInfo( $csn, $server_id )['usn'];
  }

  /**
   * USN으로 Account 정보 조회
   * @param  $account_db_id
   * @return array AccountInfo
   */
  public function getUsnToAccountInfo(  $usn ){
    return $this->getDB('global')->prepare('SELECT * FROM dbo.account WHERE usn = :usn')->bindParam('usn', $usn)->getTop();
  }

  public function getTradeInfo($usn){
    $tradeInfo = array();
    foreach($this->getServerInfo() as $key => $value){
      $tradeInfo[]=$this->getDB('game',$value['server_id'])->prepare(
        sprintf("SELECT *, %s as server_id, '%s' as server_name FROM dbo.DBAccountData WHERE usn=:usn",$value['server_id'], $value['name'] )
        )
        ->bindParam('usn',$usn)->getTop();
    }
    return $tradeInfo;
  }

  public function getTradeDeny($usn){
    return $this->getdb('middle')->prepare("SELECT * FROM BL_GT_AUCTION_DENY_USER WHERE usn=:usn")->bindParam('usn', $usn)->get();
  }

  public function getGradeBaseInfo(){
    return $this->getdb('middle')->prepare("SELECT grade, grade_name, str_value, end_value FROM BL_BT_GRADE")->get();
  }

  public function modifyGradePoint($usn, $point, $grade){

    $query = "DECLARE @usn int = :usn ;
      DECLARE @point int = :point;
      DECLARE @grade int = :grade;
      MERGE INTO BL_GT_GRADE USING (SELECT 'X' as DUAL) AS B ON ( usn =@usn )
        WHEN MATCHED THEN
          UPDATE set grade=@grade, amount=@point
        WHEN NOT MATCHED THEN
          INSERT ( usn, grade, amount )
          VALUES ( @usn, @grade, @point );";

     ActionLog::write2(array(
      'act_type'    => 'BlessBO::modifyGradePoint',
      'target'      => $usn,
      'target_type' => 'USN',
      'value'       => array($point, $grade),
      'extra1'      => $query,
      'extra2'     => $usn
    ));

    return $this->getdb('middle')->prepare($query)
      ->bindParam('usn', $usn)
      ->bindParam('grade', $grade)
      ->bindParam('point', $point)
      ->set();
  }

  public function getBanInfo($usn){
    return $this->getDB('global')->prepare('
      SELECT ban.*, world.name as server_name
      FROM dbo.banaccount ban LEFT OUTER JOIN dbo.worldserver_info world
        ON ban.serverchid = world.server_id
      WHERE usn = :usn' )
      ->bindParam('usn', $usn)->get();
  }

  public function getVipInfo($usn){
    return $this->getDB('middle')->prepare(' SELECT * FROM dbo.BL_GT_VIP WHERE usn = :usn' ) ->bindParam('usn', $usn)->get();
  }

  /**
   * 케릭터 리스트 조회
   * @param  $usn
   * @return type
   */
  public function getCharList(  $usn ){

    $serverList = $this->getServerInfo();
    $charList = array();

    foreach( $serverList as $serverInfo ){

      $blesserShip = $this->getDB('game', $serverInfo['server_id'])
        ->prepare( 'SELECT acting_point, charge_acting_point_count FROM dbo.DBAccountBlessership WHERE usn=:usn')
        ->bindParam('usn', $usn)
        ->getTop();

      $this->getDB('game', $serverInfo['server_id'])
        ->prepare(
          sprintf(
            "SELECT p.*, c.*, a.*, t.*, %d as server_id, '%s' as server_name, p.db_id as player_db_id
              FROM dbo.dbplayer p
                LEFT OUTER JOIN dbo.dbplayercontent c ON p.db_id = c.player_db_id
                LEFT OUTER JOIN dbo.DBAccountCurrency a ON p.usn = a.usn
                LEFT OUTER JOIN dbo.DBPlayerContentToken t ON p.db_id = t.player_db_id
              WHERE p.usn = :usn ORDER BY c.player_level DESC", $serverInfo['server_id'], $serverInfo['name'] )
        )
        ->bindParam('usn', $usn)
        ->each(function( $row ) use( &$charList, $serverInfo, $blesserShip ){

          $guild_info = $this->getDB('game', $serverInfo['server_id'])
            ->prepare( 'SELECT name, db_id FROM dbo.DBGuild WHERE db_id in (SELECT guild_db_id FROM dbo.DBGuildMember WHERE player_db_id=:db_id and unreg_flag=0) and unreg_flag=0')
            ->bindParam('db_id', $row['player_db_id'])
            ->get()[0];
          if ($guild_info) {
            $row['guild_db_name'] = $guild_info['name'];
            $row['guild_db_id'] = $guild_info['db_id'];
          } else {
            $row['guild_db_name'] = '';
            $row['guild_db_id'] = -1;
          }

          //행동력 추가
          $row['acting_point']=$blesserShip['acting_point'];
          $row['charge_acting_point_count']=$blesserShip['charge_acting_point_count'];


          $row['last_standalone_withoutspirit_date'] = $this->getDB('game', $serverInfo['server_id'])
            ->prepare( 'SELECT last_standalone_withoutspirit_date FROM dbo.DBDeathAndRevival WHERE player_db_id=:db_id')
            ->bindParam('db_id', $row['player_db_id'])
            ->get()[0]['last_standalone_withoutspirit_date'];
          $row['temp'] = '';

          // 패널티 정보 세로 형식으로 보여주기 위한 데이터 재설정
          $panelty_list = array();
          array_push($panelty_list, array(panelty_no=>1,panelty_type=>'Chatting', panelty_date=>$row['block_chat_date'], panelty_reason=>'', panelty_edit_date=>'22' ));
          array_push($panelty_list, array(panelty_no=>2,panelty_type=>'Post', panelty_date=>$row['block_mail_date'], panelty_reason=>$row['block_mail_type'], panelty_edit_date=>'23', panelty_edit_reason=>'24'));
          array_push($panelty_list, array(panelty_no=>3,panelty_type=>'Emergency Exit', panelty_date=>$row['emergency_escape_date'], panelty_reason=>'', panelty_edit_date=>'25'));
          array_push($panelty_list, array(panelty_no=>4,panelty_type=>'Reborn', panelty_date=>$row['last_standalone_withoutspirit_date'], panelty_reason=>'', panelty_edit_date=>'26'));
          array_push($panelty_list, array(panelty_no=>5,panelty_type=>'Create Guild', panelty_date=>$row['expire_guild_create_penalty_date'], panelty_reason=>$row['guild_penalty_type'], panelty_edit_date=>'27', panelty_edit_reason=>'28'));
          array_push($panelty_list, array(panelty_no=>6,panelty_type=>'Join Guild', panelty_date=>$row['expire_guild_join_penalty_date'], panelty_reason=>$row['guild_penalty_type'], panelty_edit_date=>'29', panelty_edit_reason=>'28'));
          $row['panelty_list'] = $panelty_list;

          $charList[] = $row;
        });
    }
    return $charList;

  }

  /**
   * 몬스터북 조회
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getMonsterBook(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT *, db_id as monsterbook_uid FROM dbo.dbmonsterbook WHERE player_db_id = :csn')->bindParam('csn', $csn)->get();
  }

  /**
   * 몬스터북 개별 조회
   * @param  $db_id
   * @return array
   */
  public function getMonsterBookInfo(  $db_id,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT *, db_id as monsterbook_uid FROM dbo.dbmonsterbook WHERE db_id = :db_id')->bindParam('db_id', $db_id)->get();
  }


  /**
   * 아이템 조회
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getItem(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT *, db_id as item_uid FROM dbo.dbitem WHERE player_db_id = :csn')->bindParam('csn', $csn)->get();
  }

  /**
   * 진행 퀘스트 조회
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getQuest(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT *, db_id as quest_uid FROM dbo.dbquest WHERE player_db_id = :csn')->bindParam('csn', $csn)->get();
  }

  /**
   * 퀘스트 개별 조회
   * @param  $db_id
   * @return array
   */
  public function getQuestInfo(  $db_id,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT *, db_id as quest_uid FROM dbo.dbquest WHERE db_id = :db_id')->bindParam('db_id', $db_id)->get();
  }

  /**
   * 반복 퀘스트 조회
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getRepeatQuest(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT *, db_id as quest_uid FROM dbo.dbrepeatquestinfo WHERE player_db_id = :csn')->bindParam('csn', $csn)->get();
  }

  /**
   * 완료 퀘스트 조회
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getResolvedQuest(  $csn,  $server_id ){
    $result = $this->getDB('game', $server_id)
      ->prepare("
          SELECT *, db_id as quest_uid, CONVERT(VARCHAR(MAX), Resolved_Quest_List, 2) as conv_Resolved_Quest_List
          FROM dbo.dbResolvedQuestInfo
          WHERE player_db_id = :csn ")
      ->bindParam('csn', $csn)->get();
    return $result;
  }

  /**
   * 스킬 조회
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getSkill(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT *, db_id as skill_uid FROM dbo.dbskill WHERE player_db_id = :csn')->bindParam('csn', $csn)->get();
  }

  /**
   * 던전귀속정보 조회
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getInstanceDungeon(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT *, db_id as pk_uid FROM dbo.dbbounddungeon WHERE player_db_id = :csn')->bindParam('csn', $csn)->get();
  }

  /**
   * 우편 : 받은 편지함
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getMail(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT * FROM dbo.dbmail WHERE player_db_id = :csn  AND  KeepFlag IN (1 , 0)  AND unreg_flag=0')
      ->bindParam('csn', $csn)
      ->get();
  }

  /**
   * 우편 : 보낸 편지함
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getSendMail(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT * FROM dbo.dbmail WHERE sender_player_db_id = :csn  and send_time>= DATEADD(D, -30, GETDATE()) ')
      ->bindParam('csn', $csn)
      ->get();
  }

  /**
   * 우편 : 삭제된 편지
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getDeletedMail(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT * FROM dbo.dbmail WHERE player_db_id = :csn AND KeepFlag IN (1, 0) AND unreg_flag=1 and unreg_date>= DATEADD(D, -30, GETDATE())')
      ->bindParam('csn', $csn)
      ->get();
  }

  public function getGuildName( $dbid,  $server_id){
    return $this->getDB('game',$server_id)
      ->prepare(" SELECT name FROM dbo.DBGuild WHERE db_id=:dbid ")
      ->bindParam('dbid', $dbid)
      ->getTop();
  }

  /**
   * 길드정보 조회
   * @param  $guild_db_id
   * @param  $server_id
   * @return array
   */
  public function getGuildInfo(  $guild_db_id,  $server_id ){
    return $this->getDB('game', $server_id)
      ->prepare('
        SELECT a.*, b.calculate_rp_date as rpdate1, c.calculate_rp_date as rpdate2
        FROM
          dbo.DBGuild a
          left outer join dbo.DBCitadelOwnership b ON a.db_id = b.guild_db_id
          left outer join dbo.DBROGuild c ON a.db_id = c.guild_db_id
        WHERE a.db_id = :guild_db_id')
      ->bindParam('guild_db_id', $guild_db_id)->get();
  }

  /**
   * 길드직급정보 조회
   * @param  $guild_db_id
   * @param  $server_id
   * @return array
   */
  public function getGuildGradeInfo(  $guild_db_id,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT * FROM dbo.DBGuildGrade WHERE guild_db_id = :guild_db_id')->bindParam('guild_db_id', $guild_db_id)->get();
  }

  /**
   * 길드원 정보 조회
   * @param  $guild_db_id
   * @param  $server_id
   * @return array
   */
  public function getGuildMemberInfo(  $guild_db_id,  $server_id ){

    $query = "
      SELECT guildmember.*, content.player_level as level, player.player_name as real_name
      FROM dbo.DBGuildMember guildmember LEFT OUTER JOIN dbo.DBPlayerContent content ON guildmember.player_db_id = content.player_db_id
        LEFT OUTER JOIN dbo.DBPlayer as player ON guildmember.player_db_id = player.db_id
      WHERE guildmember.guild_db_id = :guild_db_id and guildmember.unreg_flag=0 ";

    return $this->getDB('game', $server_id)->prepare($query)->bindParam('guild_db_id', $guild_db_id)->get();
  }


  /**
   * 스킬덱 정보 조회
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getSkillDeckInfo(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT *, CONVERT(VARCHAR(1000), skill_cid_list, 2) as conv_skill_cid_list FROM dbo.DBSkillDeck WHERE Player_DB_Id = :csn')->bindParam('csn', $csn)->get();
  }

  /**
   * 액션바 정보 조회
   * @param  $csn
   * @param  $server_id
   * @return array
   */
  public function getActionBarInfo(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare('SELECT * FROM dbo.DBActionBar WHERE Player_DB_Id = :csn')->bindParam('csn', $csn)->get();
  }

  /**
   * RxR : CO 정보 조회
   * @param  $server_id
   * @return array
   */
  public function getCOList(  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT a.citadel_cid, a.guild_db_id, a.bid_price, b.name FROM dbo.DBCitadelOwnership a JOIN dbo.DBGuild b ON a.guild_db_id = b.db_id ' )->get();
  }

  /**
   * RxR : CO 입찰 정보 조회
   * @param  $server_id
   * @return array
   */
  public function getCOBidList(  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT a.*, b.name FROM dbo.DBCitadelOwnershipAuction a JOIN dbo.DBGuild b ON a.guild_db_id = b.db_id ' )->get();
  }

  /**
   * RxR : CO 경매 진행 정보 조회
   * @param  $server_id
   * @return array
   */
  public function getCOAuctionList(  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBCitadelOwnershipAuctionSchedule' )->get();
  }

  /**
   * RxR : RO 정보
   * @param  $server_id
   * @return array
   */
  public function getROList(  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT a.*, b.name FROM dbo.DBROGuild a JOIN dbo.DBGuild b ON a.guild_db_id = b.db_id' )->get();
  }

  /**
   * RxR : RO 참여 신청 정보
   * @param  $server_id
   * @return array
   */
  public function getROGuildReservations(  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT a.*, b.name FROM dbo.DBROGuildReservation a JOIN dbo.DBGuild b ON a.guild_db_id = b.db_id' )->get();
  }

  /**
   * RxR : RO 진행 정보
   * @param  $server_id
   * @return array
   */
  public function getROReservations(  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBROReservation' )->get();
  }

  /**
   * RxR : Conquest 설정 정보
   * @param  $server_id
   * @return array
   */
  public function getConquestSetup(  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBSpecialWarReservation' )->get();
  }

  public function getMount(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBMount WHERE player_db_id=:csn and unreg_flag=0' )->bindParam('csn',$csn)->get();
  }

  public function getMountDeleted(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBMount WHERE player_db_id=:csn and unreg_flag=1' )->bindParam('csn',$csn)->get();
  }

  public function getPet(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBPet WHERE player_db_id=:csn and unreg_flag=0' )->bindParam('csn',$csn)->get();
  }

  public function getPetDeleted(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBPet WHERE player_db_id=:csn and unreg_flag=1' )->bindParam('csn',$csn)->get();
  }

  public function getFellow(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)
      ->prepare( "
          SELECT *
          FROM dbo.DBFellow
          WHERE player_db_id =:csn and unreg_flag=0
        " )
      ->bindParam('csn',$csn)->get();
  }

  public function getFellowDeleted(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)
      ->prepare( "
          SELECT *
          FROM dbo.DBFellow
          WHERE player_db_id =:csn and unreg_flag=1
        " )
      ->bindParam('csn',$csn)->get();
  }

  public function getFellowMission( $csn, $fellow, $server_id ){
    return $this->getDB('game', $server_id)
      ->prepare("
        SELECT mission_cid, time_to_complete, mission_state, db_id
        FROM dbo.DBMission
        WHERE player_db_id=:csn
          and (Register_Fellow_DB_Id_1=:fellow1
            or Register_Fellow_DB_Id_2=:fellow2
            or Register_Fellow_DB_Id_3=:fellow3) ")
      ->bindParam('csn', $csn)
      ->bindParam('fellow1',$fellow)
      ->bindParam('fellow2',$fellow)
      ->bindParam('fellow3',$fellow)
      ->get();
  }

  public function getMission(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBMission WHERE player_db_id=:csn' )->bindParam('csn',$csn)->get();
  }

  public function getInvenSlot(  $usn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT a.* FROM dbo.DBInventorySlotOpenInfo a right outer join dbo.DBAccountData b ON a.account_db_id = b.db_id WHERE b.usn=:usn' )->bindParam('usn',$usn)->get();
  }

  public function getItemDesc(  $uid1,  $uid2,  $uid3,  $uid4,  $uid5,  $server_id ){
    return $this->getDB('game', $server_id)
      ->prepare( 'SELECT * FROM dbo.DBItem WHERE db_id IN (:uid1, :uid2, :uid3, :uid4, :uid5)' )
      ->bindParam('uid1',$uid1)
      ->bindParam('uid2',$uid2)
      ->bindParam('uid3',$uid3)
      ->bindParam('uid4',$uid4)
      ->bindParam('uid5',$uid5)
      ->get();
  }

  public function getRemainMonsterbookReward(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBAvailableRewardMonsterBookInfo WHERE player_db_id=:csn' )->bindParam('csn',$csn)->get();
  }

  public function getBattleHistory(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBPlayerDuel WHERE player_db_id=:csn' )->bindParam('csn',$csn)->get();
  }

  public function getOrderSchedule(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBOrderSchedule WHERE player_db_id=:csn' )->bindParam('csn',$csn)->get();
  }

  public function getOrderGoal(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBOrderGoal WHERE player_db_id=:csn' )->bindParam('csn',$csn)->get();
  }

  public function getOrder(  $csn,  $server_id ){
    return $this->getDB('game', $server_id)->prepare( 'SELECT * FROM dbo.DBOrder WHERE player_db_id=:csn' )->bindParam('csn',$csn)->get();
  }

  public function setMissionState(  $csn,  $cid,  $server_id, string $state ){
    $query = 'UPDATE dbo.DBMission SET mission_state = :state WHERE mission_cid = :cid and player_db_id=:csn';
    $this->getDB('game', $server_id)
      ->prepare( $query )
      ->bindParam('cid', $cid)
      ->bindParam('state', $state)
      ->bindParam('csn', $csn)
      ->set();

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::setMissionState',
      'target'      => $cid,
      'target_type' => 'Mission_CID',
      'value'       => array($server_id, $state),
      'extra1'      => $query,
      'extra2'      => $this->getCsnToUsn($csn, $server_id),
      'extra3'      => $csn,
    ));

    return true;
  }

  public function setTradeRestrict( $usn, $server_id, $column, $value ){

    $query = sprintf("UPDATE dbo.DBAccountData SET %s =:value WHERE usn=:usn",$column);
    ActionLog::write2(array(
      'act_type'    => 'BlessBO::setMissionState',
      'target'      => $usn,
      'target_type' => 'USN',
      'value'       => array($server_id, $column, $value),
      'extra1'      => $query,
      'extra2'      => $usn,
    ));

    return $this->getDB('game',$server_id)->prepare( $query )
      ->bindParam('value', $value)
      ->bindParam('usn', $usn)
      ->set();
  }

  public function insertTradeDeny( $usn ){

     $query = "DECLARE @usn int = :usn ;
      DECLARE @reg_usn int = :reg_usn;

      MERGE INTO BL_GT_AUCTION_DENY_USER USING (SELECT 'X' as DUAL) AS B ON ( usn =@usn )
        WHEN MATCHED THEN
          UPDATE set reg_usn=@reg_usn
        WHEN NOT MATCHED THEN
          INSERT ( usn, reg_usn )
          VALUES ( @usn, @reg_usn );";


    ActionLog::write2(array(
      'act_type'    => 'BlessBO::insertTradeDeny',
      'target'      => $usn,
      'target_type' => 'USN',
      'value'       => array($usn, $_SESSION['user']['msn']),
      'extra1'      => $query,
      'extra2'      => $usn,
    ));

    return $this->getDB('middle')->prepare( $query )
      ->bindParam('usn', $usn)
      ->bindParam('reg_usn', $_SESSION['user']['msn'])
      ->set();
  }

  public function removeTradeDeny( $usn ){

    $query = "DELETE FROM BL_GT_AUCTION_DENY_USER WHERE usn=:usn";
    ActionLog::write2(array(
      'act_type'    => 'BlessBO::removeTradeDeny',
      'target'      => $usn,
      'target_type' => 'USN',
      'value'       => array($usn),
      'extra1'      => $query,
      'extra2'      => $usn,
    ));

    return $this->getDB('middle')->prepare( $query )
      ->bindParam('usn', $usn)
      ->set();
  }

//
//  /**
//   * 채팅 금지 종료일시 변경
//   * @param  $csn
//   * @param t $server_id
//   * @param string $datetime YmdHisu
//   * @return bool
//   */
//  public function setBlockChatDate(  $csn,  $server_id, string $datetime ){
//
//    $this->getDB('game', $server_id)
//      ->prepare('UPDATE dbo.dbplayercontent SET block_chat_date = :datetime WHERE player_db_id = :csn')
//      ->bindParam('csn', $csn)
//      ->bindParam('datetime', $datetime)
//      ->set();
// TODO : Actionlog 수정해야됨
//    ActionLog::write2(array(
//      'act_type'    => 'BlessBO::setBlockChatDate',
//      'target'      => $csn,
//      'target_type' => 'CSN',
//      'extra1'      => $server_id,
//      'extra2'      => $datetime
//    ));
//
//    return true;
//
//  }

  /**
   * GM 레벨 수정
   * @param  $usn
   * @param  $gmlevel
   * @return bool
   */
  public function setGmlevel(  $usn,  $gmlevel ){
    $query = 'UPDATE dbo.account SET gmlevel = :gmlevel WHERE usn = :usn';
    $this->getDB( 'global' )->prepare( $query )
      ->bindParam( 'gmlevel', $gmlevel )
      ->bindParam( 'usn', $usn )
      ->set();

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::setGmlevel',
      'target'      => $usn,
      'target_type' => 'USN',
      'value'      => $gmlevel,
      'extra1'      => $query,
      'extra2'      => $usn
    ));

    return true;

  }

  /**
   * Adm GM 레벨 참조
   * @param  $msn
   * @return  array
   */
  public function getAdmGmlevelMsn(  $msn ){

    return DB::instance('adm_common')->prepare( 'SELECT gm_level FROM bl_gm_level WHERE msn = :msn' )
      ->bindParam( 'msn', $msn )
      ->getTop();
  }

  public function getAdmGMLevel(){
    $result = $this->getAdmGmlevelMsn($_SESSION['user']['msn']);

    if ($result)
      return $result['gm_level'];
    else
      return 9;
  }

  private function getAdmTID(){
    return uniqid('AdmTID_', true);
  }

  /**
   *
   * @param  $usn
   */
  public function kickAccount( $usn, $svr, $duration, $msg ){
    debug('kickout begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "KICKOUT";
    $msgobj->Code = "BL|KICKOUT";
    $msgobj->Action = "KICKOUT";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->CHID   = $svr;
    $msgobj->MemberID = $usn;
    $msgobj->Duration = $duration;
    $msgobj->MSG = $msg;

    ActionLog::write2(array(
      'act_type'    => 'BL 유저 Kickout',
      'target'      => $usn,
      'value'       => array($svr, $duration, $msg),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
      'extra2'      => $usn
    ));

    return $this->sendJorbi($msgobj);
  }

  public function resetBan( $usn, $svr ){
    debug('kickout.CLEAR begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "KICKOUT.CLEAR";
    $msgobj->Code = "BL|KICKOUT.CLEAR";
    $msgobj->Action = "KICKOUT.";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->CHID   = $svr;
    $msgobj->MemberID = $usn;

    ActionLog::write2(array(
      'act_type'    => 'BL 유저 Kickout 초기화',
      'target'      => $usn,
      'value'       => $svr,
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
      'extra2'      => $usn
    ));

    return $this->sendJorbi($msgobj);
  }


  function setStory($usn, $csn, $quest, $svr){
    debug($usn);debug($csn);debug($quest);debug($svr);
    debug('setstory begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.SETSTORY";
    $msgobj->Code = "BL|OP.SETSTORY";
    $msgobj->Action = "OP.SETSTORY";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->CHID   = $svr;
    $msgobj->MemberID = $usn;
    $msgobj->PlayerDBId = $csn;
    $msgobj->QuestId  = $quest;
    $msgobj->_TimeOut_ = "3000";

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::setStory',
      'target'      => $usn,
      'value'       => array($csn, $quest, $svr),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
      'extra2'      => $usn,
      'extra3'      => $csn
    ));

    return $this->sendJorbi($msgobj);

  }

  function setMaxCU($svr, $value){
    debug('setMaxCU begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.SETMAXCU";
    $msgobj->Code = "BL|OP.SETMAXCU";
    $msgobj->Action = "OP.SETMAXCU";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->CHID   = $svr;
    $msgobj->MaxCu = $value;
    ActionLog::write2(array(
      'act_type'    => 'BlessBO::setMaxCU',
      'target'      => $svr,
      'value'       => $value,
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));

    return $this->sendJorbi($msgobj);
  }

  function setServerOpen($svr, $value){
    if($value) $openState = true; else $openState = false;
    debug('setServerOpen begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.SETSERVEROPEN";
    $msgobj->Code = "BL|OP.SETSERVEROPEN";
    $msgobj->Action = "OP.SETSERVEROPEN";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->CHID   = $svr;
    $msgobj->ServerOpen = $openState;
    $msgobj->_TimeOut_ = "3000";
    ActionLog::write2(array(
      'act_type'    => 'BlessBO::s',
      'target'      => $svr,
      'value'       => $value,
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));

    return $this->sendJorbi($msgobj);
  }

  function getConnectInfo($usn){
    debug('getConnectInfo (WHO) begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "WHO";
    $msgobj->Code = "BL|WHO";
    $msgobj->Action = "WHO";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->MemberID = $usn;
    $msgobj->_TimeOut_ = "3000";

    $result = $this->sendJorbi($msgobj);
    $connectInfo = array();
    $connectInfo['jorbi'] = DB::instance( 'jorbi_bl' )->prepare("SELECT chid, lblged, pcb_ef, pcb_id FROM TX_BL_WHO WHERE admtid=:tid AND chid!=0")
      ->bindParam('tid',$result->AdmTID)
      ->getTop();
    if($connectInfo['jorbi']!=null){
      $connectInfo['middle'] = $this->getDB('middle')->prepare("SELECT * FROM dbo.BL_GT_WEB_CHAR WHERE usn=:usn AND world_id=:chid")
        ->bindParam('usn',$usn)
        ->bindParam('chid', $connectInfo['jorbi']['chid'])
        ->get();
    }
    return $connectInfo;
  }

  function getConnectInfoMiddle($usn){
    return $this->getDB('middle')->prepare("SELECT * FROM dbo.BL_GT_WEB_CHAR WHERE usn=:usn")->bindParam('usn',$usn)->get();
  }

  function refreshCU(){
    debug('refreshCU begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "CU";
    $msgobj->Code = "BL|CU";
    $msgobj->Action = "CU";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->_TimeOut_ = "500";
    return $this->sendJorbi($msgobj);
  }

  function reloadServer(){
    debug('reloadServer begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.RELOADSERVER";
    $msgobj->Code = "BL|OP.RELOADSERVER";
    $msgobj->Action = "OP.RELOADSERVER";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->_TimeOut_ = "500";
    return $this->sendJorbi($msgobj);
  }

  function setServerTrade($svr, $all, $auction, $post, $personal, $warehouse){
    debug('setServerTrade begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.SETSERVERTRADE";
    $msgobj->Code = "BL|OP.SETSERVERTRADE";
    $msgobj->Action = "OP.SETSERVERTRADE";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->CHID   = $svr;
    $msgobj->StopAllTrade        = $all;
    $msgobj->StopAuction         = $auction;
    $msgobj->StopMail            = $post;
    $msgobj->StopPersonalTrade   = $personal;
    $msgobj->StopWarehouse       = $warehouse;
    $msgobj->_TimeOut_ = "3000";

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::setServerTrade',
      'target'      => $svr,
      'value'       => array($all, $auction, $post, $personal, $warehouse),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function removeGuildCreature( $svr, $uid ){
    debug('removeGuildCreature begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.DELRPPRODUCT";
    $msgobj->Code = "BL|OP.DELRPPRODUCT";
    $msgobj->Action = "OP.DELRPPRODUCT";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->CHID   = $svr;
    $msgobj->ProductID    = $uid;
    $msgobj->CHID         = $svr;
    $msgobj->_TimeOut_ = "3000";

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::removeGuildCreature',
      'target'      => $svr,
      'value'       => array($svr, $uid),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function startSpecialWar( $svr, $count, $icon, $wait, $play, $session ){
    debug('startSpecialWar begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.START.SPECIALWAR";
    $msgobj->Code = "BL|OP.START.SPECIALWAR";
    $msgobj->Action = "OP.START.SPECIALWAR";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->IconHHMM = $icon;
    $msgobj->WaitMM = $wait;
    $msgobj->PlayMM = $play;
    $msgobj->SessionCount = $session;
    $msgobj->_TimeOut_ = "3000";
    $chInfo = new stdClass();
    $chInfo->CHIDCount =  $count;
    $chInfo->CHIDList = $svr;
    $msgobj->CHIDInfo = $chInfo;

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::startSpecialWar',
      'target'      => $svr,
      'value'       => array($svr, $icon, $wait, $play, $session),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function startCoAuction( $svr, $count, $hh, $mm, $play){
    debug('startCoAuction begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.START.COAUCTION";
    $msgobj->Code = "BL|OP.START.COAUCTION";
    $msgobj->Action = "OP.START.COAUCTION";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->StartHH = $hh;
    $msgobj->StartMM = $mm;
    $msgobj->PlayMM = $play;
    $msgobj->_TimeOut_ = "3000";
    $chInfo = new stdClass();
    $chInfo->CHIDCount =  $count;
    $chInfo->CHIDList = $svr;
    $msgobj->CHIDInfo = $chInfo;

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::startCoAuction',
      'target'      => $svr,
      'value'       => array($svr, $hh, $mm, $play),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function startRoWar( $svr, $count, $realm, $applystart, $applyend, $rostart){
    debug('startRoWar begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.START.ROWAR";
    $msgobj->Code = "BL|OP.START.ROWAR";
    $msgobj->Action = "OP.START.ROWAR";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->RealmType = $realm;
    $msgobj->ApplyStartHHMM = $applystart;
    $msgobj->ApplyEndHHMM = $applyend;
    $msgobj->ROStartHHMM = $rostart;
    $msgobj->_TimeOut_ = "3000";
    $chInfo = new stdClass();
    $chInfo->CHIDCount =  $count;
    $chInfo->CHIDList = $svr;
    $msgobj->CHIDInfo = $chInfo;

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::startRoWar',
      'target'      => $svr,
      'value'       => array($svr, $realm, $applystart, $applyend, $rostart),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function startFieldRaid( $svr, $count, $id ){
    debug('startFieldRaid begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.START.FIELDRAID";
    $msgobj->Code = "BL|OP.START.FIELDRAID";
    $msgobj->Action = "OP.START.FIELDRAID";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->FieldRaidId = $id;
    $msgobj->_TimeOut_ = "3000";
    $chInfo = new stdClass();
    $chInfo->CHIDCount =  $count;
    $chInfo->CHIDList = $svr;
    $msgobj->CHIDInfo = $chInfo;

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::startFieldRaid',
      'target'      => $svr,
      'value'       => array($svr, $id),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function setServerBuff( $svr, $buff){
    debug('setServerBuff begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.SETSERVEREVENT";
    $msgobj->Code = "BL|OP.SETSERVEREVENT";
    $msgobj->Action = "OP.SETSERVEREVENT";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->EventID = $buff;
    $msgobj->CHID   = $svr;
    $msgobj->_TimeOut_ = "3000";

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::setServerBuff',
      'target'      => $svr,
      'value'       => array($svr, $buff),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function endSpecialWar( $svr, $count, $session ){
    debug('endSpecialWar begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.END.SPECIALWAR";
    $msgobj->Code = "BL|OP.END.SPECIALWAR";
    $msgobj->Action = "OP.END.SPECIALWAR";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->TargetSession = $session;
    $msgobj->_TimeOut_ = "3000";
    $chInfo = new stdClass();
    $chInfo->CHIDCount =  $count;
    $chInfo->CHIDList = $svr;
    $msgobj->CHIDInfo = $chInfo;

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::endSpecialWar',
      'target'      => $svr,
      'value'       => array($svr, $session),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function endCoAuction( $svr, $count ){
    debug('endCoAuction begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.END.COAUCTION";
    $msgobj->Code = "BL|OP.END.COAUCTION";
    $msgobj->Action = "OP.END.COAUCTION";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->_TimeOut_ = "3000";
    $chInfo = new stdClass();
    $chInfo->CHIDCount =  $count;
    $chInfo->CHIDList = $svr;
    $msgobj->CHIDInfo = $chInfo;

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::endCoAuction',
      'target'      => $svr,
      'value'       => array($svr),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function endRoWar( $svr, $count, $realm ){
    debug('endRoWar begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.END.ROWAR";
    $msgobj->Code = "BL|OP.END.ROWAR";
    $msgobj->Action = "OP.END.ROWAR";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->RealmType = $realm;
    $msgobj->_TimeOut_ = "3000";
    $chInfo = new stdClass();
    $chInfo->CHIDCount =  $count;
    $chInfo->CHIDList = $svr;
    $msgobj->CHIDInfo = $chInfo;

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::endRoWar',
      'target'      => $svr,
      'value'       => array($svr),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function endFieldRaid( $svr, $count, $id ){
    debug('endFieldRaid begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.END.FIELDRAID";
    $msgobj->Code = "BL|OP.END.FIELDRAID";
    $msgobj->Action = "OP.END.FIELDRAID";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->FieldRaidId = $id;
    $msgobj->_TimeOut_ = "3000";
    $chInfo = new stdClass();
    $chInfo->CHIDCount =  $count;
    $chInfo->CHIDList = $svr;
    $msgobj->CHIDInfo = $chInfo;

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::endFieldRaid',
      'target'      => $svr,
      'value'       => array($svr),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  function changeGuildChief( $server_id, $guild_db_id, $csn ){
    debug('changeGuildChief begins');
    $msgobj = new stdClass();
    $msgobj->GameSSN = "347";
    $msgobj->ADM = "OP.GUILD.DELEGATELEADER";
    $msgobj->Code = "BL|OP.GUILD.DELEGATELEADER";
    $msgobj->Action = "OP.GUILD.DELEGATELEADER";
    $msgobj->AdmTID = $this->getAdmTID();
    $msgobj->GuildDBId = $guild_db_id;
    $msgobj->PlayerDBId = $csn;
    $msgobj->_TimeOut_ = "3000";
    $msgobj->CHID   = $server_id;

    ActionLog::write2(array(
      'act_type'    => 'BlessBO::changeGuildChief',
      'target'      => $server_id,
      'value'       => array($server_id, $guild_db_id, $csn),
      'extra1'      => 'Jorbi +'.$msgobj->AdmTID,
    ));
    return $this->sendJorbi($msgobj);
  }

  public function sendJorbi($msgobj){
    $mode = true; //조비 번호는. 확인 필요 현재는 5번 사용중
    if( Util::is_dev() ) {
        $jorbiHost = 'jorbi.dq.nwz.kr';
    } else {
      $jorbi_num = 6;
      $jorbiHost = 'jorbi'.$jorbi_num.'.nwz.kr';
    }

    $str = json_encode( $msgobj );
    $socket = @fsockopen( $jorbiHost, 9002, $errno, $errstr, 3 );
    if( $socket ){
        $str = $str."\0";
        $len = strlen( $str );
        $packet = "\x0a\xFF\x00\x10".pack("s",$len).$str;
        $this->util_fwrite( $socket,    $packet );
        if( $mode ) {
            $line = fread( $socket, 4 );
            $len = fread( $socket, 2 );
            $len = unpack( "S", $len );
            $line = fread( $socket, $len[1] );
            $obj = json_decode( $line );
        } else {
            $msgobj["!! NOTE !!"] = iconv( "CP949", "UTF-8", "이 메시지는 실서비스에서는 회신되지 않습니다." );
            $obj = json_decode( $msgobj );
        }
        fclose($socket);
        debug("jorbi done");
        debug($obj);
        return $obj;
    } else {
        $obj = new stdClass;
        $obj->CF = true;
        $obj->ErrCode = -9500;
        $obj->ErrMsg = iconv( "CP949", "UTF-8", "연결 할 수 없습니다." );
        debug("error Jorbi");
        debug($obj);
        return $obj;
    }
  }

  function util_fwrite($sock, $data){
    $bytes_to_write = strlen($data);
    $bytes_written = 0;

    while ($bytes_written < $bytes_to_write){
      if ($bytes_written==0) {
        $rv = fwrite($sock, $data);
      }
      else
      {
        // 로그 수집
        $file = "tmp/fwrite_". date("Ymd");
        $p = array();
        $p[] = $bytes_written;
        $p[] = $bytes_to_write;
        $p[] = substr($data, ($bytes_written - $rv), $rv);
        guild_add_log($file, $p);

        $rv = fwrite($sock, substr($data, $bytes_written));
      }

      if ($rv===false || $rv==0)
        return ($bytes_written==0? false : $bytes_written);

      $bytes_written += $rv;
    }

    return $bytes_written;
  }

  public function getLittleEndian($str){
    $result = "";
    $result .= substr($str, 6, 2);
    $result .= substr($str, 4, 2);
    $result .= substr($str, 2, 2);
    $result .= substr($str, 0, 2);
    return $result;
  }

  public function getItemStat($server, $dbid){
    $type = [];   $value = [];
    $sub = $this->getDB('game',$server)
      ->prepare("
          DECLARE @stat nvarchar(max);
          DECLARE @legend int;
          SELECT @stat = CONVERT(nvarchar(max), stat_data_list, 2), @legend = legend_opt_cid
          FROM dbo.DBItem
          WHERE db_id =:dbid;
          SELECT stat = @stat, legend = @legend;
        ")
      ->bindParam('dbid',$dbid)->get();
    for($i=0; $i<16; $i++){
      $binary = base_convert( $this->getLittleEndian( substr( $sub[0]['stat'], $i*8, 8) ), 16, 10 );
      if($i%2==0){
        $type[] = $binary;
      }
      else{
        $value[] = $binary;
      }
    }
    //if(strlen($value[3])<8){ $value[3]=$value[3]."00"; }
    return [$type, $value, $sub[0]['legend']];
  }

  public function getItemRune($server, $dbid){
    return $this->getDB('game',$server)
      ->prepare("
          SELECT item_cid, db_id as item_uid, rune_item_cid_1, rune_item_cid_2, rune_item_cid_3, rune_item_cid_4
          FROM dbo.DBItem
          WHERE db_id =:dbid
        ")
      ->bindParam('dbid',$dbid)->get();
  }

  public function getWaypoint(  $csn,  $server_id ){
    $query = "
      DECLARE @arriveTime datetime;
      DECLARE @node nvarchar(max);
      DECLARE @route nvarchar(max);
      SELECT @arriveTime =  Arrived_DateTime ,  @node =  CONVERT(nvarchar(max), Available_Node_CId_List, 1)  ,  @route  = CONVERT(nvarchar(max), route, 1)
      FROM  dbo.DBWaypoint
      WHERE player_db_id =:csn
    ";
    $waypoint = $this->getDB('game', $server_id)->prepare( $query )->bindParam('csn',$csn)->get();
    return $waypoint[0];
  }

  public function getCustomWaypoint(  $csn,  $server_id){
    return $this->getDB('game', $server_id)->prepare( "SELECT * FROM dbo.DBCustomWaypoint WHERE player_db_id =:csn" )->bindParam('csn',$csn)->get();
  }

  public function getFriend(  $csn,  $server_id){
    return $this->getDB('game', $server_id)->prepare( "SELECT * FROM dbo.DBFriend WHERE player_db_id =:csn" )->bindParam('csn',$csn)->get();
  }

  public function getSecondPw($usn){
    return $this->getDB('middle')->prepare("SELECT usn, status, fail_cnt, upd_date, reg_date FROM BL_GT_SECOND_PWD WHERE usn=:usn")->bindParam('usn',$usn)->get();
  }

  public function callSecondPw($usn, $type){
    return $this->getDB('middle')->prepare("EXEC USP_BL_NW_SECOND_PWD :type, :usn, 0, 0, 0, 'Y', 1")->bindParam('usn',$usn)->bindParam('type',$type)->get();
  }

 public function getLogtype(){
    $subResult = $this->getDB('logw','01')->prepare("SELECT log_type, code_name FROM BL_BT_UPLOAD_LOGTYPE")->get();
    $result = array();
    foreach($subResult as $key => $value){
      $result[$value['log_type']] = $value['code_name'];
    }
    return $result;
  }

  function getLocalname( $filename, $cid ){
    $query = "
      SELECT local.local_name
      FROM BL_BT_GAME_LOCAL local, BL_BT_GAME_LOCAL_CID cid
      WHERE local.field_name = cid.field_name and local.file_name=:filename and cid.cid=:cid";
    $subResult =  $this->getDB('info')->prepare($query)->bindParam('filename', $filename)->bindParam('cid',$cid)->get();
    //debug($subResult);
    return $subResult[0]['local_name'];
  }

  function getBuffList(){
    return $this->getDB('info')->prepare("SELECT * FROM BL_BT_GAME_LOCAL_CID WHERE file_name='AccountInfo'")->get();
  }

  function getJorbiResult( $admtid ){
    return DB::instance('jorbi_bl')->query("SELECT * FROM TX_BL_OP WHERE admtid=:admtid")
      ->bindParam('admtid', $admtid)
      ->get();
  }


}

?>

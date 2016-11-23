<?php

/**
 * BlessGuild Class
 * @author leeejong@neowiz.com 2015.12.01
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessGuild {
  private $bo;
  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getServerInfo(){
    return $this->bo->getServerInfo();
  }

  function getGuildinfo( $type, $server_id, $keyword ){
    $db = $this->bo->getDB('game', $server_id);
    switch($type){
      case 'guildid':
        if(is_numeric($keyword)){
          $sub = $db->prepare("SELECT * FROM dbo.DBGuild WHERE db_id =:guildid")->bindParam('guildid',$keyword)->get();
        }
        else{
          return '올바른 값을 입력해주세요';
        }
        break;
      case 'guildname':
        $sub = $db->prepare("SELECT * FROM dbo.DBGuild WHERE name =:name")->bindParam('name',strtolower($keyword))->get();
        break;
      case 'character':

        if( !is_numeric($keyword) && !$keyword = $this->bo->getNameToCsn($keyword, $server_id) )
          error('케릭터가 없거나 삭제되어 찾을 수 없습니다. - '.$keyword);

        $subGuildinfo = $db->prepare("SELECT guild_db_id FROM dbo.DBGuildMember WHERE player_db_id =:csn")->bindParam('csn',$keyword)->get();

        $guildid = $subGuildinfo[0]['guild_db_id'];
        if($guildid == null)
          error('길드 가입정보가 없습니다'.$keyword);

        $sub = $db->prepare("SELECT * FROM dbo.DBGuild WHERE db_id =:guildid")->bindParam('guildid',$guildid)->get();
        break;
    }

    return $sub;
  }

  function getGuildMember( $guild_db_id, $server_id ){
    return $this->bo->getGuildMemberInfo($guild_db_id, $server_id);
  }

  function getMemberGrade( $guild_db_id, $server_id ){
    return $this->bo->getGuildGradeInfo($guild_db_id, $server_id);
  }

  function deleteMember( $dbid, $server_id ){
    return $this->bo->getDB('game', $server_id)->prepare("DELETE FROM dbo.DBGuildMember WHERE db_id=:dbid")
      ->bindParam('dbid', $dbid)
      ->set();
  }

  function changeChief( $server_id, $guild_db_id, $csn ){
    return $this->bo->changeGuildChief( $server_id, $guild_db_id, $csn );
  }

}

?>
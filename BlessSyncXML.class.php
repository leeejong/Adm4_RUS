<?php

/**
 * BlessSyncXML Class
 * @author leeejong@neowiz.com 2016.1.6
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessSyncXML {

  private
    $bo;

  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  function getXML( $type ) {

    svn_auth_set_parameter( SVN_AUTH_PARAM_DEFAULT_USERNAME, 'gameinfosvn' );
    svn_auth_set_parameter( SVN_AUTH_PARAM_DEFAULT_PASSWORD, 'Rpdla!2vh' );
    svn_auth_set_parameter( PHP_SVN_AUTH_PARAM_IGNORE_SSL_VERIFY_ERRORS, true );
    svn_auth_set_parameter( SVN_AUTH_PARAM_NON_INTERACTIVE, true );

    if ( $type == 'item' ) {
      $xmlString = svn_cat( 'http://n3gamesvn.nwz.kr/svn/bl_kr_neowiz/trunk/server/BLServer/Content/ServerData/ItemInfo.xml' );
      $truncateQuery = "TRUNCATE table bl_bt_game_item";
      $queryFormat = " INSERT INTO bl_bt_game_item (item_id, name, grade, usable_class, usable_minlv) VALUES ";
      $selectQuery = " SELECT * FROM bl_bt_game_item ";
    }
    else if ( $type == 'skill' ) {
      $xmlString = svn_cat( 'http://n3gamesvn.nwz.kr/svn/bl_kr_neowiz/trunk/server/BLServer/Content/ServerData/PCSkillInfo.xml' );
      $truncateQuery = "TRUNCATE table bl_bt_game_skill_tmp";
      $queryFormat = " INSERT INTO bl_bt_game_skill_tmp (skill_id, code_name, local_name, skill_group, skill_grade, skill_desc, pc_level, class_type,
                                   miss_chance, invokable_target_rc_state, cooltime, applygcd, cooldowngroup, aggropoint, begin_normal_auto_attack,
                                   interact_prop, category_type, passivemastery, skillcharge, auto_firable) VALUES ";
      $selectQuery = " SELECT * FROM bl_bt_game_skill_tmp ";
    }
    else
      return 'ERROR UNKNOWN TYPE';

    $xml = simplexml_load_string( str_replace( "bl:", "", $xmlString ) );
    $db = $this->bo->getDB( 'info' );
    $db->prepare( $truncateQuery )->set();

    $tempString = "";
    $count = 0;
    $inputString = array();

    if ( $type == 'item' ) {
      foreach ( $xml->itemInfo as $key => $value ) {

        if ( $count % 500 !== 0 ) {
          $tempString .= ",";
        }

        $tempString .= "("
          ."".$value['item_id'].","
          ."'".$value['name_k']."',"
          ."'".$value['grade']."',"
          ."'".$value['usable_class']."',"
          ."".$value['usable_minlv'].")";

        $count++;

        if ( $count > 0 && $count % 500 === 0 ) {
          $inputString[] = $tempString;
          $tempString = "";
        }
      }
    }
    else if ( $type == 'skill' ) {
      foreach ( $xml->pcSkillInfo as $key => $value ) {

        if ( $count % 500 !== 0 ) {
          $tempString .= ",";
        }

        $tempString .= "("
          ." ".$value['skill_id'].","
          ." '".$value['code_name']."' , "
          ." '".$value['local_name']."' , "
          ." '".$value['skill_group']."' , "
          ." '".$value['skill_grade']."' , "
          ." '".$value['description']."' , "
          ." ".$value['pc_level']."  , "
          ." '".$value['class_type']."'  , "
          ." ".$value['miss_chance']." , "
          ." '".$value['invokable_target_RC_state']."' , "
          ." ".$value['coolTime']." , "
          ." '".$value['applyGCD']."' , "
          ." '".$value['coolDownGroup']."' , "
          ." ".$value['aggroPoint']." , "
          ." '".$value['begin_normal_auto_attack']."' , "
          ." '".$value['interact_prop']."' , "
          ." '".$value['category_type']."' , "
          ." '".$value['passiveMastery']."' ,"
          ." '".$value['skillCharge']."' , "
          ." '".$value['auto_firable']."'  ) ";

        $count++;

        if ( $count > 0 && $count % 500 === 0 ) {
          $inputString[] = $tempString;
          $tempString = "";
        }
      }
    }

    $inputString[] = $tempString;

    foreach ( $inputString as $key => $value ) { $db->prepare( $queryFormat.$value )->set(); }

    $result = $db->prepare( $selectQuery )->get();

    return [$count, $result ];
  }

  function _getLocalizationFileToArray( $arrFile ) {
    $arrKOR = array();
    foreach ( $arrFile as $key1 => $value1 ) {
      $str = "";
      $handle = fopen( sprintf( "http://gameinfosvn:Rpdla!2vh@n3gamesvn.nwz.kr/svn/bl_kr_neowiz/trunk/ReferenceData/bless/BLGame/Localization/KOR/%s.KOR", $value1 ), "rb" );
      if ( FALSE === $handle )
        continue;
      while ( !feof( $handle ) )  $str .= fread( $handle, 8192);
      fclose( $handle );
      $localstr = iconv( 'utf-16', 'utf-8', $str );
      $arrTmp = explode( "\n", $localstr );
      foreach ( $arrTmp as $key2 => $value2 ) {
        $value2 = str_replace("'", "''", $value2);
        $arrK_V = explode( "=", $value2, 2 );
        if ( !$arrK_V[1] )continue;
        if ( strlen($arrK_V[0])>1000 || strlen($arrK_V[1])>1000) continue;

        $subArr = array();
        $subArr['Filename'] = $value1;
        $subArr['Fieldname'] = trim( $arrK_V[0] );
        $subArr['Localname'] = trim( $arrK_V[1] );
        $arrKOR[$subArr['Fieldname']] = $subArr;
      }
    }
    return $arrKOR;
  }

  function getLocal( $target ) {
    // Get Nodes
    //$localXML = $this->_getLocalizationFileToArray( array( 'ItemInfo', 'BLEnum', 'AbnormalStatusInfo', 'NPCInfo', 'FellowInfo', 'PetInfo', 'MountInfo' ) );
    $localXML = $this->_getLocalizationFileToArray( array( $target ) );

    // Insert into InfoDB
    $truncateQuery = "DELETE FROM bl_bt_game_local WHERE file_name='".$target."'";
    $queryFormat = " INSERT INTO bl_bt_game_local (file_name, field_name, local_name) VALUES ";
    $selectQuery = " SELECT * FROM bl_bt_game_local where file_name='".$target."'";

    $db = $this->bo->getDB( 'info' );
    $db->prepare( $truncateQuery )->set();

    $tempString = "";
    $count = 0;
    $inputString = array();
    foreach ( $localXML as $key => $value ) {

      if ( $count % 50 !== 0 ) { $tempString .= ","; }

      $tempString .= "("
        ." '".$value['Filename']."',"
        ." '".$value['Fieldname']."' , "
        ." N'".$value['Localname']."'  ) ";

      $count++;

      if ( $count > 0 && $count % 50 === 0 ) {
        $inputString[] = $tempString;
        $tempString = "";
      }
    }
    $inputString[] = $tempString;
    foreach ( $inputString as $key => $value ) {
      $db->prepare( $queryFormat.$value )->set();
    }
    $result = $db->prepare( $selectQuery )->get();
    return [$count, $result];
  }

  function getField( $target ){

    svn_auth_set_parameter( SVN_AUTH_PARAM_DEFAULT_USERNAME, 'gameinfosvn' );
    svn_auth_set_parameter( SVN_AUTH_PARAM_DEFAULT_PASSWORD, 'Rpdla!2vh' );
    svn_auth_set_parameter( PHP_SVN_AUTH_PARAM_IGNORE_SSL_VERIFY_ERRORS, true );
    svn_auth_set_parameter( SVN_AUTH_PARAM_NON_INTERACTIVE, true );

    $xmlString = svn_cat( 'http://n3gamesvn.nwz.kr/svn/bl_kr_neowiz/trunk/ReferenceData/bless/BLGame/ClientContent/ClientData/'.$target.'.xml' );
    $truncateQuery = "DELETE FROM bl_bt_game_local_cid WHERE file_name='".$target."'";
    $queryFormat = " INSERT INTO bl_bt_game_local_cid (file_name, cid, field_name) VALUES ";
    $selectQuery = " SELECT * FROM bl_bt_game_local_cid where file_name='".$target."'";

    $xml = simplexml_load_string( str_replace( "bl:", "", $xmlString ) );
    $db = $this->bo->getDB( 'info' );
    $db->prepare( $truncateQuery )->set();

    $tempString = "";
    $count = 0;
    $inputString = array();
    $xmlArr = (array) $xml;

    $nodeName = $target;
    $targetHead = str_replace('Info', '', $target);
    $cidName = $targetHead.'_id';
    $fieldName = "local_name";
    if($target=='PetInfo'){
      $nodeName = 'petInfo';
      $cidName = 'pet_id';
    }
    if($target=='MountInfo'){
      $cidName = 'mount_id';
    }
    if($target=='FellowInfo'){
      $cidName = 'fellow_id';
    }
    if($target=='NPCInfo'){
      $cidName = 'npc_id';
      $nodeName = 'npcInfo';
    }
    if($target=='ItemInfo'){
      $nodeName = 'itemInfo';
      $cidName='item_id';
      $fieldName = 'name_k';
    }
    if($target=='PCSkillInfo'){
      $nodeName='pcSkillInfo';
      $cidName = 'skill_id';
    }
    if($target=='MonsterBookInfo'){
      $nodeName='monsterBookInfo';
      $cidName = 'id';
    }
    if($target=='QuestInfo'){
      $nodeName =  'questInfo';
      $cidName = 'quest_id';
    }
    if($target=='AccountInfo'){
      $nodeName = 'ServerEventInfo';
      $cidName = 'server_event_id';
      $fieldName = 'code_name';
    }

    debug($xmlArr);

    $nodeArr = (array)$xmlArr[$nodeName];
    foreach ( $nodeArr as $key => $value ) {
      if ( $count % 500 !== 0 ) { $tempString .= ","; }
      $value[$cidName] = str_replace("'", "''", $value[$cidName]);
      $value[$fieldName] = str_replace("'", "''", $value[$fieldName]);
      $tempString .= "("
        ." '".$target."',"
        ." '".$value[$cidName]."' , "
        ." '".$value[$fieldName]."'  ) ";

      $count++;

      if ( $count > 0 && $count % 500 === 0 ) {
        $inputString[] = $tempString;
        $tempString = "";
      }
    }

    $inputString[] = $tempString;

    foreach ( $inputString as $key => $value ) { $db->prepare( $queryFormat.$value )->set(); }

    $result = $db->prepare( $selectQuery )->get();

    return [$count, $result ];
  }

  function syncItemlist( $type ) {
    if ( $type == 'item' ) {
      $action = 1;
    }
    else if ( $type == 'skill' ) {
      $action = 2;
    }
    else {
      return 'UNKNOWN TYPE';
    }
    //USP_BL_NW_GAME_SYNC
    $query = "EXEC USP_BL_NW_GAME_SYNC :action, 1, 'Y', :result";
    $this->bo->getDB( 'info' )->prepare( $query )->bindParam( 'action', $action )->bindInOutParam( 'result', $result )->set();

    return $result;
  }

}

?>
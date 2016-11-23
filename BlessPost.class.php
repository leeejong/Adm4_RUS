<?php

/**
 * BlessPost Class
 * @author leeejong@neowiz.com 2015.09.07
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessPost {
  private $bo;
  private $optionType;
  use ClientTable;

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
    $this->optionType = $this->setOptionTypes();
  }

  function getServerInfo(){
    //$this->bo->getItemStat(1, 281474979589041);
    return $this->bo->getServerInfo();
  }


  function giveItemGamemoney(  $usertype,  $user,  $itemlist,  $subject,  $msg,  $money, $server ){
    if($usertype == 'csn'){
      $nick = $this->bo->getCsnToCharacterInfo($user, $server)['player_name'];
      if($nick ==  null) error('No CSN');
    }
    else{
      $nick = $user;
    }

    if($result = $this->giveItem($usertype, $nick, $itemlist, $subject, $msg, $money, $server ))
      return true;
    error(msg('Send Failed'+$result));
  }

  function giveItem($usertype, $user, $itemlist, $subject, $msg, $money, $server ){

    $sendResult = 'Failed';

    if($itemlist['checkbox1']){ $dbid1 = 0; $cid1 = intval($itemlist['itemid1']); $value1=intval($itemlist['value1']); }
    else{ $dbid1 = intval($itemlist['dbid1']); $cid1 = -1; $value1=0; }
    if($itemlist['checkbox2']){ $dbid2 = 0; $cid2 = intval($itemlist['itemid2']); $value2=intval($itemlist['value2']); }
    else{ $dbid2 = intval($itemlist['dbid2']); $cid2 = -1; $value2=0; }
    if($itemlist['checkbox3']){ $dbid3 = 0; $cid3 = intval($itemlist['itemid3']); $value3=intval($itemlist['value3']); }
    else{ $dbid3 = intval($itemlist['dbid3']); $cid3 = -1; $value3=0; }
    if($itemlist['checkbox4']){ $dbid4 = 0; $cid4 = intval($itemlist['itemid4']); $value4=intval($itemlist['value4']); }
    else{ $dbid4 = intval($itemlist['dbid4']); $cid4 = -1; $value4=0; }
    if($itemlist['checkbox5']){ $dbid5 = 0; $cid5 = intval($itemlist['itemid5']); $value5=intval($itemlist['value5']); }
    else{ $dbid5 = intval($itemlist['dbid5']); $cid5 = -1; $value5=0; }

    $this->bo->getDB('game',$server)
      ->prepare("EXEC BLSP_Native_SendMail
          :player_db_id, :normal_mail_count, :gm_mail_count,
          :system_mail_count, :expand_mail_count, :expire_days, :expire_hours,
          :receiver_name, :sender_name, :system_mail_cid,
          :title, :content, :mail_type, :state_type, :world_type, :world_wrapper_cid, :location_x, :location_y,
          :gold,
          :item_db_id_1, :item_cid_1, :item_amount_1,
          :item_db_id_2, :item_cid_2, :item_amount_2,
          :item_db_id_3, :item_cid_3, :item_amount_3,
          :item_db_id_4, :item_cid_4, :item_amount_4,
          :item_db_id_5, :item_cid_5, :item_amount_5,
          :mail_db_id, :receiver_db_id, :auto_delete_flag, :ret
      ")
      ->bindParam('player_db_id', 0)
      ->bindParam('normal_mail_count', 100)
      ->bindParam('gm_mail_count', 100)
      ->bindParam('system_mail_count', 1000)
      ->bindParam('expand_mail_count', 100)
      ->bindParam('expire_days', 10)
      ->bindParam('expire_hours', 0)
      ->bindParam('receiver_name', $user)
      ->bindParam('sender_name', 'Bless')
      ->bindParam('system_mail_cid', -1)
      ->bindParam('title', $subject)
      ->bindParam('content', $msg)
      ->bindParam('mail_type', 2)
      ->bindParam('state_type', 0)
      ->bindParam('world_type', -1)
      ->bindParam('world_wrapper_cid', -1)
      ->bindParam('location_x', 0)
      ->bindParam('location_y', 0)
      ->bindParam('gold', $money)
      ->bindParam('item_db_id_1', $dbid1)->bindParam('item_cid_1', $cid1)->bindParam('item_amount_1', $value1)
      ->bindParam('item_db_id_2', $dbid2)->bindParam('item_cid_2', $cid2)->bindParam('item_amount_2', $value2)
      ->bindParam('item_db_id_3', $dbid3)->bindParam('item_cid_3', $cid3)->bindParam('item_amount_3', $value3)
      ->bindParam('item_db_id_4', $dbid4)->bindParam('item_cid_4', $cid4)->bindParam('item_amount_4', $value4)
      ->bindParam('item_db_id_5', $dbid5)->bindParam('item_cid_5', $cid5)->bindParam('item_amount_5', $value5)

      ->bindInOutParam( 'mail_db_id', $mail_db_id )
      ->bindInOutParam( 'receiver_db_id', $receiver_db_id )
      ->bindInOutParam( 'auto_delete_flag', $auto_delete_flag )
      ->bindInOutParam( 'ret', $result )

      ->set(true);

    if($result==0) $sendResult = 'Succeed';
    else if($result==1){ $sendResult = 'No Target'; error('No Target.');}
    else if($result==2){ $sendResult = 'Target postbox is full.'; error('Target postbox is full');}

    ActionLog::write2(array(
      'act_type'    => 'Bless 우편 전송',
      'target'      => $user,
      'target_type' => $usertype,
      'value'       => 'Money='.$money,
      'extra1'      => $subject,
      'extra2'      => $msg,
      'extra3'      => $sendResult.','.$dbid1.','.$cid1.','.$value1
                                  .','.$dbid2.','.$cid2.','.$value2
                                  .','.$dbid3.','.$cid3.','.$value3
                                  .','.$dbid4.','.$cid4.','.$value4
                                  .','.$dbid5.','.$cid5.','.$value5,
    ));

    return $sendResult;

  }

  function getLittleEndian($str){
    return $this->bo->getLittleEndian($str);
  }


  function makeItem(
      $server,$item_cid,$amount,$legend_opt_cid,$remain_effect_charges,
      $type1,$val1,$type2,$val2,$type3,$val3,$type4,$val4,$type5,$val5,$type6,$val6,$type7,$val7,$type8,$val8,$type9,$val9, $dueDate
    ){

    $type = [$type1,$type2,$type3,$type4,$type5,$type6,$type7,$type8,$type9];
    $val  = [$val1,$val2,$val3,$val4,$val5,$val6,$val7,$val8,$val9];
    $bstring = "0x";
    for($i=0;$i<9;$i++){
      if($type[$i]!=-1){
        $bstring .= $this->getLittleEndian(sprintf("%08X", $type[$i]));
        $bstring .= $this->getLittleEndian(sprintf("%08X", $val[$i]));
      }
    }

    $this->bo->getDB('game',$server)
      ->setForce(true)
      ->prepare("
        DECLARE @stat varbinary(128) = CONVERT(varbinary(128), :stat_data_list, 1) ;
        DECLARE @custom varbinary(128) = CONVERT(varbinary(128), :customizing_data_list, 1) ;
        DECLARE @trade varbinary(128) = CONVERT(varbinary(128), :trading_able_player_list, 1) ;

        EXEC BLSP_insert_DBItem
          :amount, :bonding, :carve_maker_db_id, :carve_maker_name,
          :custom_count, @custom, :db_id,
          :duration_date, :equip_slot, :having_slot_change_date, :having_slot_type,
          :inventory_slot_index, :inventory_tab_index, :item_cid, :legend_opt_cid,
          :must_set_property, :player_db_id, :potential_level,:remain_effect_charges,
          -1, -1, -1, -1,
          @stat, :trading_able_duration_date, @trade,
          :unreg_date, :unreg_flag
      ")
      ->bindParam('stat_data_list', $bstring)
      ->bindParam('customizing_data_list', '0x')                    // 새로추가
      ->bindParam('trading_able_player_list', '0x')                 //새로추가

      ->bindParam('amount', $amount)
      ->bindParam('bonding', 0)
      ->bindParam('carve_maker_db_id', 0)
      ->bindParam('carve_maker_name', '')
      ->bindParam('custom_count', 0)
      ->bindParam('duration_date', $dueDate)
      ->bindParam('equip_slot', -1)
      ->bindParam('having_slot_change_date', "1753-1-1")
      ->bindParam('having_slot_type', 2)
      ->bindParam('inventory_slot_index', 0)
      ->bindParam('inventory_tab_index', 0)
      ->bindParam('item_cid', $item_cid)
      ->bindParam('legend_opt_cid', $legend_opt_cid)
      ->bindParam('must_set_property', 0)                           // 새로추가
      ->bindParam('player_db_id', 0)
      ->bindParam('potential_level', 0)
      ->bindParam('remain_effect_charges', $remain_effect_charges)

      ->bindParam('trading_able_duration_date', "1753-1-1")      //새로추가

      ->bindParam('unreg_date', "2015-10-13")
      ->bindParam('unreg_flag', 0)
      ->bindInOutParam( 'db_id', $result )
      ->set(true);

    $params = [$bstring, $amount, $item_cid, $legend_opt_cid, $remain_effect_charges, $result];

    ActionLog::write2(array(
      'act_type'    => 'Bless 아이템 생성',
      'target'      => $result,
      'target_type' => 'ITEM',
      'value'       => 'ITEM_CID='.$item_cid,
      'extra1'      => 'Amount='.$amount,
      'extra2'      => 'Binary='.$bstring,
      'extra3'      => $result.','.$amount.','.$legend_opt_cid.','.$remain_effect_charges.','+$dueDate.','
    ));

    $this->alertMail($result, $server,$item_cid,$amount,$legend_opt_cid,$remain_effect_charges,
      $type1,$val1,$type2,$val2,$type3,$val3,$type4,$val4,$type5,$val5,$type6,$val6,$type7,$val7,$type8,$val8,$type9,$val9, $dueDate );

    return $result;
  }

   function alertMail($item_uid, $server,$item_cid,$amount,$legend_opt_cid,$remain_effect_charges,
      $type1,$val1,$type2,$val2,$type3,$val3,$type4,$val4,$type5,$val5,$type6,$val6,$type7,$val7,$type8,$val8,$type9,$val9, $dueDate){

     $query = "SELECT name FROM BL_BT_GAME_ITEM WHERE item_id=:item_cid";
     $queryResult =  $this->bo->getDB('middle')->prepare($query)->bindParam('item_cid',$item_cid)->getTop();
     $itemname =  $queryResult['name'];

    $AuthBO = new AuthBO();
    $senderInfo = $AuthBO->memberInfo($_SESSION['user']['msn']);

    $subject = "[BL] 아이템생성 Alert Mail";
     $caption = "'".$itemname."'을(를) 생성했습니다. <br/>";
     $msg = Html::makeVerticalTable(
        array(
          'Maker',
          'Item_UID',
          'Item_CID',
          'Type1', 'Value1'
          ,'Type2','Value2'
          ,'Type3','Value3'
          ,'Type4','Value4'
          ,'Type5','Value5'
          ,'Type6','Value6'
          ,'Type7','Value7'
          ,'Type8','Value8'
          ,'Type9','Value9'
          ,'Legend_Option','Server','Amount','remain_effect_charges','Duedate'
          ),
        array(
          $senderInfo['name'],
          $item_uid,
          $item_cid,
          $this->optionType[$type1], $val1
          ,$this->optionType[$type2], $val2
          ,$this->optionType[$type3], $val3
          ,$this->optionType[$type4], $val4
          ,$this->optionType[$type5], $val5
          ,$this->optionType[$type6], $val6
          ,$this->optionType[$type7], $val7
          ,$this->optionType[$type8], $val8
          ,$this->optionType[$type9], $val9
          ,$legend_opt_cid,$server,$amount,$remain_effect_charges,$dueDate
       )
     );
    Mail::template($senderInfo['email'], 'leeejong@neowiz.com', $subject, $caption, $msg);
    return true;
  }

  function selectUser($server, $realm, $race, $class, $gender, $minLevel, $maxLevel, $checkLogout, $logoutDate){
    //Backup DB Instance로 변경 필요
    if(!Util::is_dev())
      error('백업DB로 변경 전까지 사용이 불가합니다');
    $query = "SELECT a.player_name, a.db_id, a.usn, a.realm_type, a.race_type, a.class_type, a.gender_type, b.player_level, b.logout_date FROM DBPlayer a JOIN dbo.DBPlayerContent b ON a.db_id = b.player_db_id WHERE a.usn>0 ";
    if($realm!=99){ $query .= "and a.realm_type=:realm "; }
    if($race!=99){ $query .= "and a.race_type=:race "; }
    if($class!=99){ $query .= "and a.class_type=:class "; }
    if($gender!=99){ $query .= "and a.gender_type=:gender "; }
    if($minLevel!=0){ $query .= "and b.player_level>=:minlevel "; }
    if($maxLevel!=0){ $query .= "and b.player_level<=:maxlevel "; }
    if($checkLogout){ $query .= "and b.logout_date>:logoutdate "; }

    return $this->bo->getDB('game',$server)->prepare($query)
      ->bindParam('realm',$realm)
      ->bindParam('race',$race)
      ->bindParam('class',$class)
      ->bindParam('gender',$gender)
      ->bindParam('minlevel',$minLevel)
      ->bindParam('maxlevel',$maxLevel)
      ->bindParam('logoutdate',$logoutDate)
      ->get();
  }

  function sendGiftbox($type, $key, $title, $sendtype, $sender, $expire, $item ){

    $usn = $type=='id' ? $this->bo->getUsn( $key ) : $key;

    $query = "EXEC USP_BL_NW_CASH_ITEM_FREE
          :usn, :provider_type, :provider_nick, :cash_item_id, :expire_day, :title, :store, :web_yn, :result";

    $this->bo->getDB('middle')
      ->prepare($query)
      ->bindParam('usn', $usn)
      ->bindParam('provider_type', $sendtype)
      ->bindParam('provider_nick', $sender)
      ->bindParam('cash_item_id', $item)
      ->bindParam('expire_day', $expire)
      ->bindParam('title', $title)
      ->bindParam('store', 1)
      ->bindParam('web_yn','Y')
      ->bindInOutParam( 'result', $result)
      ->set();


    ActionLog::write2(array(
      'act_type'    => 'Bless 상품수신함 전송',
      'target'      => $key,
      'target_type' => $type,
      'value'       => $usn,
      'extra1'      => $sender.'+'.$title,
      'extra2'      => $item.'+'.$expire,
      'extra3'      => $result,
    ));

    return $result;

  }

  function checkItemcid($cid){
    return $this->bo->getDB('middle')->prepare("SELECT cash_item_id FROM BL_BT_MALL_ITEM WHERE cash_item_id=:cid")->bindParam('cid',$cid)->getTop();
  }

  function setOptionTypes() {
    $optionType = array();
    $optionType[0]  = 'run_forward_speed';
    $optionType[1]  = 'run_backward_speed';
    $optionType[2]  = 'walk_forward_speed';
    $optionType[3]  = 'walk_backward_speed';
    $optionType[4]  = 'full_run_forward_speed';
    $optionType[5]  = 'jump_ability';
    $optionType[6]  = 'max_step_height';
    $optionType[7]  = 'stamina';
    $optionType[8]  = 'strength';
    $optionType[9]  = 'agility';
    $optionType[10] = 'intelligence';
    $optionType[11] = 'wisdom';
    $optionType[12] = 'technique';
    $optionType[13] = 'balance';
    $optionType[14] = 'quickness';
    $optionType[15] = 'armor';
    $optionType[16] = 'spell_armor';
    $optionType[17] = 'attack_power';
    $optionType[18] = 'spell_power';
    $optionType[19] = 'main_weapon_min_damage';
    $optionType[20] = 'main_weapon_max_damage';
    $optionType[21] = 'main_weapon_attack_period';
    $optionType[24] = 'weapon_spell_damage_min';
    $optionType[25] = 'weapon_spell_damage_max';
    $optionType[29] = 'hit_rating';
    $optionType[30] = 'dodge_rating';
    $optionType[31] = 'parry_rating';
    $optionType[32] = 'block_rating';
    $optionType[33] = 'block_reduce_rating';
    $optionType[34] = 'critical_rating';
    $optionType[35] = 'critical_power';
    $optionType[36] = 'resist_rating';
    $optionType[37] = 'rc_resist_rating';
    $optionType[38] = 'haste_rating';
    $optionType[39] = 'hit_chance';
    $optionType[40] = 'spell_hit_chance';
    $optionType[41] = 'dodge_chance';
    $optionType[42] = 'parry_chance';
    $optionType[43] = 'parry_amount';
    $optionType[44] = 'block_chance';
    $optionType[45] = 'block_reduce';
    $optionType[46] = 'spell_resist_chance';
    $optionType[47] = 'rc_resist_chance';
    $optionType[48] = 'critical_chance';
    $optionType[49] = 'critical_modifier';
    $optionType[50] = 'spell_critical_chance';
    $optionType[51] = 'armor_reduce';
    $optionType[52] = 'spell_armor_reduce';
    $optionType[53] = 'haste';
    $optionType[54] = 'auto_attack_period';
    $optionType[55] = 'max_hp';
    $optionType[56] = 'hp_regen';
    $optionType[57] = 'cost_type';
    $optionType[58] = 'max_cost';
    $optionType[59] = 'cost_regen';
    $optionType[60] = 'deal_amplification';
    $optionType[61] = 'heal_amplification';
    $optionType[62] = 'receive_deal_amplification';
    $optionType[63] = 'receive_heal_amplification';
    $optionType[64] = 'aggro_amplification';
    $optionType[65] = 'HP';
    $optionType[66] = 'cost';
    $optionType[67] = 'energy';
    $optionType[68] = 'max_energy';
    $optionType[69] = 'sprint_cost';
    $optionType[70] = 'energy_regen';
    $optionType[71] = 'radius';
    $optionType[72] = 'half_height';
    $optionType[73] = 'swim_forward_speed';
    $optionType[74] = 'swim_backward_speed';
    $optionType[75] = 'push_block_amount';
    $optionType[76] = 'physical_deal_amplification';
    $optionType[77] = 'magical_deal_amplification';
    $optionType[78] = 'receive_physical_deal_amplification';
    $optionType[79] = 'receive_magical_deal_amplification';
    $optionType[80] = 'hill_climbing_ability';
    $optionType[81] = 'flying_forward_speed';
    $optionType[82] = 'flying_backward_speed';
    $optionType[83] = 'melee_deal_amplification';
    $optionType[84] = 'range_deal_amplification';
    $optionType[85] = 'spell_deal_amplification';
    $optionType[86] = 'receive_melee_deal_amplification';
    $optionType[87] = 'receive_range_deal_amplification';
    $optionType[88] = 'receive_spell_deal_amplification';
    $optionType[89] = 'deal_amp_by_backattack';
    $optionType[90] = 'receive_deal_amp_by_backattack';
    $optionType[91] = 'pve_exp_coefficient';
    $optionType[92] = 'pvp_exp_coefficient';
    $optionType[93] = 'pve_gold_drop_coefficient';
    $optionType[94] = 'bp_coefficient';
    $optionType[95] = 'cp_coefficient';
    $optionType[96] = 'dp_coefficient';
    return $optionType;
  }

}

?>
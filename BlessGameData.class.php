<?php

/**
 * BlessGameData Class
 * @author bitofsky@neowiz.com 2013.06.05
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessGameData {

  private $bo;
  private $ModifyInfo = array (
   1 => array('gm_level' => 1, 'data_type' => 4, 'name' => 'GM권한등급', 'edit_table_name'=>'Account', 'edit_column_name'=>'GMLevel', 'add_edit_db_info'=>'')
//,  2 => 미사용
,  3 => array('gm_level' => 2, 'data_type' => 0, 'name' => '캐릭터 복구', 'edit_table_name'=>'-', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
,  4 => array('gm_level' => 4, 'data_type' => 11, 'name' => 'Kickout', 'edit_table_name'=>'-', 'edit_column_name'=>'JORBI를 통해 kickout처리를 호출', 'add_edit_db_info'=>'')
//,  5 => array('gm_level' => 4, 'data_type' => 0, 'name' => '거래정지', 'edit_table_name'=>'-', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
,  6 => array('gm_level' => 2, 'data_type' => 2, 'name' => '캐릭터명 변경', 'edit_table_name'=>'DBPlayer', 'edit_column_name'=>'player_name', 'add_edit_db_info'=>'AccountCharacter_Info / Character_Name')
//,  7 => 미사용
,  8 => array('gm_level' => 1, 'data_type' => 5, 'name' => 'Gold 추가', 'edit_table_name'=>'DBAccountCurrency', 'edit_column_name'=>'Gold', 'add_edit_db_info'=>'')
,  9 => array('gm_level' => 3, 'data_type' => 6, 'name' => 'Gold 회수', 'edit_table_name'=>'DBAccountCurrency', 'edit_column_name'=>'Gold', 'add_edit_db_info'=>'')
//,  10 => array('gm_level' => 1, 'data_type' => 5, 'name' => 'RP 추가', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'RP', 'add_edit_db_info'=>'')
//,  11 => array('gm_level' => 3, 'data_type' => 6, 'name' => 'RP 회수', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'RP', 'add_edit_db_info'=>'')
,  12 => array('gm_level' => 1, 'data_type' => 5, 'name' => 'CP 추가', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'CP', 'add_edit_db_info'=>'')
,  13 => array('gm_level' => 3, 'data_type' => 6, 'name' => 'CP 회수', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'CP', 'add_edit_db_info'=>'')
,  14 => array('gm_level' => 1, 'data_type' => 5, 'name' => 'BP 추가', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'BP', 'add_edit_db_info'=>'')
,  15 => array('gm_level' => 3, 'data_type' => 6, 'name' => 'BP 회수', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'BP', 'add_edit_db_info'=>'')
//,  16 => array('gm_level' => 1, 'data_type' => 5, 'name' => 'GP 추가', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'GP', 'add_edit_db_info'=>'')
//,  17 => array('gm_level' => 3, 'data_type' => 6, 'name' => 'GP 회수', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'GP', 'add_edit_db_info'=>'')
,  18 => array('gm_level' => 1, 'data_type' => 5, 'name' => 'DP 추가', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'DP', 'add_edit_db_info'=>'')
,  19 => array('gm_level' => 3, 'data_type' => 6, 'name' => 'DP 회수', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'DP', 'add_edit_db_info'=>'')
//,  20 => array('gm_level' => 4, 'data_type' => 0, 'name' => '위치이동', 'edit_table_name'=>'-', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
//,  21 => array('gm_level' => 4, 'data_type' => 0, 'name' => '패널티 만료 시간 수정', 'edit_table_name'=>'-', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
//,  22 => array('gm_level' => 4, 'data_type' => 3, 'name' => '채팅 금지시간', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'Block_Chat_Date', 'add_edit_db_info'=>'')
//,  23 => array('gm_level' => 4, 'data_type' => 3, 'name' => '우편 전송 금지시간', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'Block_Mail_Date', 'add_edit_db_info'=>'')
//,  24 => array('gm_level' => 4, 'data_type' => 4, 'name' => '우편 전송 금지 타입', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'Block_Mail_Type', 'add_edit_db_info'=>'')
,  25 => array('gm_level' => 4, 'data_type' => 3, 'name' => '비상 탈출 종료시간', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'Emergency_Escape_Date', 'add_edit_db_info'=>'')
//,  26 => array('gm_level' => 4, 'data_type' => 3, 'name' => '제자리부활 사용시간', 'edit_table_name'=>'DBDeathAndRevival', 'edit_column_name'=>'Restrict_Revival_StandAlone_For_Persist_Date', 'add_edit_db_info'=>'')
//,  27 => array('gm_level' => 4, 'data_type' => 3, 'name' => '길드 생성 만료시간', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'Expire_Guild_Create_Penalty_Date', 'add_edit_db_info'=>'')
//,  28 => array('gm_level' => 4, 'data_type' => 4, 'name' => '길드 생성 만료 타입', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'Guild_Penalty_Type', 'add_edit_db_info'=>'')
//,  29 => array('gm_level' => 4, 'data_type' => 3, 'name' => '길드 가입 만료시간', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'Expire_Guild_Join_Penalty_Date', 'add_edit_db_info'=>'')
//,  30 => array('gm_level' => 4, 'data_type' => 4, 'name' => '길드 가입 만료 타입', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'Guild_Penalty_Type', 'add_edit_db_info'=>'')
,  31 => array('gm_level' => 3, 'data_type' => 9, 'name' => '착용 아이템 삭제', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'Unreg_Flag', 'add_edit_db_info'=>'')
,  32 => array('gm_level' => 1, 'data_type' => 5, 'name' => '소지 아이템 개수 추가', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'Amount', 'add_edit_db_info'=>'')
,  33 => array('gm_level' => 3, 'data_type' => 6, 'name' => '소지 아이템 개수 회수', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'Amount', 'add_edit_db_info'=>'')
,  34 => array('gm_level' => 2, 'data_type' => 7, 'name' => '소지 아이템 잔여횟수 수정', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'Remain_Effect_Charges', 'add_edit_db_info'=>'')
,  35 => array('gm_level' => 2, 'data_type' => 1, 'name' => '소지 아이템 귀속여부 수정', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'Bonding', 'add_edit_db_info'=>'')
,  36 => array('gm_level' => 3, 'data_type' => 9, 'name' => '소지 아이템 삭제', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'Unreg_Flag', 'add_edit_db_info'=>'')
,  37 => array('gm_level' => 2, 'data_type' => 8, 'name' => '삭제 아이템 복구', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'Unreg_Flag', 'add_edit_db_info'=>'')
,  38 => array('gm_level' => 1, 'data_type' => 1, 'name' => '삭제 아이템 이동', 'edit_table_name'=>'-', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
//,  39 => 미사용
//,  40 => array('gm_level' => 3, 'data_type' => 1, 'name' => '퀘스트 목표, 카운트 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'count1~6, flag1~6', 'add_edit_db_info'=>'')
,  41 => array('gm_level' => 3, 'data_type' => 4, 'name' => '퀘스트 목표1 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'flag1', 'add_edit_db_info'=>'')
,  42 => array('gm_level' => 3, 'data_type' => 1, 'name' => '퀘스트 카운트1 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'count1', 'add_edit_db_info'=>'')
,  43 => array('gm_level' => 3, 'data_type' => 4, 'name' => '퀘스트 목표2 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'flag2', 'add_edit_db_info'=>'')
,  44 => array('gm_level' => 3, 'data_type' => 1, 'name' => '퀘스트 카운트2 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'count2', 'add_edit_db_info'=>'')
,  45 => array('gm_level' => 3, 'data_type' => 4, 'name' => '퀘스트 목표3 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'flag3', 'add_edit_db_info'=>'')
,  46 => array('gm_level' => 3, 'data_type' => 1, 'name' => '퀘스트 카운트3 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'count3', 'add_edit_db_info'=>'')
,  47 => array('gm_level' => 3, 'data_type' => 4, 'name' => '퀘스트 목표4 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'flag4', 'add_edit_db_info'=>'')
,  48 => array('gm_level' => 3, 'data_type' => 1, 'name' => '퀘스트 카운트4 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'count4', 'add_edit_db_info'=>'')
,  49 => array('gm_level' => 3, 'data_type' => 4, 'name' => '퀘스트 목표5 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'flag5', 'add_edit_db_info'=>'')
,  50 => array('gm_level' => 3, 'data_type' => 1, 'name' => '퀘스트 카운트5 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'count5', 'add_edit_db_info'=>'')
,  51 => array('gm_level' => 3, 'data_type' => 4, 'name' => '퀘스트 목표6 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'flag6', 'add_edit_db_info'=>'')
,  52 => array('gm_level' => 3, 'data_type' => 1, 'name' => '퀘스트 카운트6 수정', 'edit_table_name'=>'DBQuest', 'edit_column_name'=>'count6', 'add_edit_db_info'=>'')
,  53 => array('gm_level' => 3, 'data_type' => 1, 'name' => 'Story 퀘스트 변경', 'edit_table_name'=>'-', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
//,  54 => array('gm_level' => 3, 'data_type' => 1, 'name' => '몬스터북 스테이지, 목표 수정', 'edit_table_name'=>'DBMonsterBook', 'edit_column_name'=>'Stage_Index, count1~6', 'add_edit_db_info'=>'')
,  55 => array('gm_level' => 3, 'data_type' => 1, 'name' => '몬스터북 스테이지 수정', 'edit_table_name'=>'DBMonsterBook', 'edit_column_name'=>'Stage_Index', 'add_edit_db_info'=>'')
,  56 => array('gm_level' => 3, 'data_type' => 1, 'name' => '몬스터북 목표1 수정', 'edit_table_name'=>'DBMonsterBook', 'edit_column_name'=>'count1', 'add_edit_db_info'=>'')
,  57 => array('gm_level' => 3, 'data_type' => 1, 'name' => '몬스터북 목표2 수정', 'edit_table_name'=>'DBMonsterBook', 'edit_column_name'=>'count2', 'add_edit_db_info'=>'')
,  58 => array('gm_level' => 3, 'data_type' => 1, 'name' => '몬스터북 목표3 수정', 'edit_table_name'=>'DBMonsterBook', 'edit_column_name'=>'count3', 'add_edit_db_info'=>'')
,  59 => array('gm_level' => 3, 'data_type' => 1, 'name' => '몬스터북 목표4 수정', 'edit_table_name'=>'DBMonsterBook', 'edit_column_name'=>'count4', 'add_edit_db_info'=>'')
,  60 => array('gm_level' => 3, 'data_type' => 1, 'name' => '몬스터북 목표5 수정', 'edit_table_name'=>'DBMonsterBook', 'edit_column_name'=>'count5', 'add_edit_db_info'=>'')
,  61 => array('gm_level' => 3, 'data_type' => 1, 'name' => '몬스터북 목표6 수정', 'edit_table_name'=>'DBMonsterBook', 'edit_column_name'=>'count6', 'add_edit_db_info'=>'')
//,  62 => array('gm_level' => 1, 'data_type' => 5, 'name' => '길드 CP 추가', 'edit_table_name'=>'DBGuild', 'edit_column_name'=>'CP', 'add_edit_db_info'=>'')
//,  63 => array('gm_level' => 2, 'data_type' => 6, 'name' => '길드 CP 회수', 'edit_table_name'=>'DBGuild', 'edit_column_name'=>'CP', 'add_edit_db_info'=>'')
//,  64 => array('gm_level' => 1, 'data_type' => 1, 'name' => '길드원 직급 타입 수정', 'edit_table_name'=>'DBGuildMember', 'edit_column_name'=>'Grade_Type', 'add_edit_db_info'=>'')
//,  65 => 중복
,  66 => array('gm_level' => 3, 'data_type' => 9, 'name' => '받은 편지함 삭제', 'edit_table_name'=>'DBMail', 'edit_column_name'=>'Unreg_Flag', 'add_edit_db_info'=>', Delete_Type')
,  67 => array('gm_level' => 2, 'data_type' => 9, 'name' => '받은 편지함 반송', 'edit_table_name'=>'DBMail', 'edit_column_name'=>'ReturnFlag', 'add_edit_db_info'=>'')
,  68 => array('gm_level' => 2, 'data_type' => 9, 'name' => '보낸 편지함 반송', 'edit_table_name'=>'DBMail', 'edit_column_name'=>'ReturnFlag', 'add_edit_db_info'=>'')
,  69 => array('gm_level' => 3, 'data_type' => 8, 'name' => '삭제된 편지함 복구', 'edit_table_name'=>'DBMail', 'edit_column_name'=>'Unreg_Flag', 'add_edit_db_info'=>'')
//,  70 => array('gm_level' => 1, 'data_type' => 0, 'name' => '우편 발송', 'edit_table_name'=>'-', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
,  71 => array('gm_level' => 2, 'data_type' => 1, 'name' => '위치이동(X좌표)', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'last_location_x', 'add_edit_db_info'=>'')
,  72 => array('gm_level' => 2, 'data_type' => 1, 'name' => '위치이동(Y좌표)', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'last_location_y', 'add_edit_db_info'=>'')
,  73 => array('gm_level' => 2, 'data_type' => 1, 'name' => '위치이동(Z좌표)', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'last_location_z', 'add_edit_db_info'=>'')
,  74 => array('gm_level' => 2, 'data_type' => 1, 'name' => '위치이동(방향)', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'last_rotation_yaw', 'add_edit_db_info'=>'')
,  75 => array('gm_level' => 2, 'data_type' => 1, 'name' => '위치이동(월드 인스턴스 SID)', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'last_world_instance_sid', 'add_edit_db_info'=>'')
,  76 => array('gm_level' => 2, 'data_type' => 1, 'name' => '위치이동(월드맵 유형)', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'last_worldmap_type', 'add_edit_db_info'=>'')
,  77 => array('gm_level' => 2, 'data_type' => 1, 'name' => '위치이동(월드맵 ID)', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'last_worldmap_cid', 'add_edit_db_info'=>'')
,  78 => array('gm_level' => 2, 'data_type' => 1, 'name' => '위치이동(월드맵 래퍼 ID)', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'last_worldmap_wrapper_cid', 'add_edit_db_info'=>'')
,  79 => array('gm_level' => 2, 'data_type' => 10, 'name' => '위치이동', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
,  80 => array('gm_level' => 4, 'data_type' => 12, 'name' => '귀환', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
,  81 => array('gm_level' => 3, 'data_type' => 9, 'name' => '던전 귀속정보 초기화', 'edit_table_name'=>'DBBoundDungeon', 'edit_column_name'=>'cooltime_expire_date', 'add_edit_db_info'=>'')
,  82 => array('gm_level' => 2, 'data_type' => 1, 'name' => '아이템 다른유저에게 전송', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'Unreg_Flag', 'add_edit_db_info'=>'')
//,  83 => array('gm_level' => 4, 'data_type' => 1, 'name' => '제작Exp 수정', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'craft_exp', 'add_edit_db_info'=>'')
//,  84 => array('gm_level' => 4, 'data_type' => 1, 'name' => '채집Exp 수정', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'gather_exp', 'add_edit_db_info'=>'')
,  85 => array('gm_level' => 4, 'data_type' => 1, 'name' => '귀환지 수정', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'destination_cid', 'add_edit_db_info'=>'')
,  86 => array('gm_level' => 3, 'data_type' => 0, 'name' => '마운트 삭제', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'mount_dbid', 'add_edit_db_info'=>'')
,  87 => array('gm_level' => 3, 'data_type' => 0, 'name' => '펫 삭제', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'pet_dbid', 'add_edit_db_info'=>'')
,  88 => array('gm_level' => 3, 'data_type' => 0, 'name' => '펠로우 삭제', 'edit_table_name'=>'DBMission', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
,  89 => array('gm_level' => 2, 'data_type' => 0, 'name' => '마운트 복구', 'edit_table_name'=>'DBMount', 'edit_column_name'=>'Unreg_Flag', 'add_edit_db_info'=>'')
,  90 => array('gm_level' => 2, 'data_type' => 0, 'name' => '펫 복구', 'edit_table_name'=>'DBPet', 'edit_column_name'=>'Unreg_Flag', 'add_edit_db_info'=>'')
,  91 => array('gm_level' => 2, 'data_type' => 0, 'name' => '펠로우 복구', 'edit_table_name'=>'DBFellow', 'edit_column_name'=>'Unreg_Flag', 'add_edit_db_info'=>'')
,  92 => array('gm_level' => 1, 'data_type' => 5, 'name' => '무료 루메나 추가', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'Lumena', 'add_edit_db_info'=>'')
,  93 => array('gm_level' => 3, 'data_type' => 6, 'name' => '무료 루메나 회수', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'Lumena', 'add_edit_db_info'=>'')
,  94 => array('gm_level' => 1, 'data_type' => 5, 'name' => '유료 충전 루메나 추가', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'Lumena_P', 'add_edit_db_info'=>'')
,  95 => array('gm_level' => 3, 'data_type' => 6, 'name' => '유료 충전 루메나 회수', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'Lumena_P', 'add_edit_db_info'=>'')
,  96 => array('gm_level' => 2, 'data_type' => 0, 'name' => '임의거점 삭제', 'edit_table_name'=>'DBCustomWaypoint', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
,  97 => array('gm_level' => 2, 'data_type' => 5, 'name' => '제작Exp 추가', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'craft_exp', 'add_edit_db_info'=>'')
,  98 => array('gm_level' => 3, 'data_type' => 6, 'name' => '제작Exp 회수', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'craft_exp', 'add_edit_db_info'=>'')
,  99 => array('gm_level' => 2, 'data_type' => 5, 'name' => '채집Exp 추가', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'gather_exp', 'add_edit_db_info'=>'')
, 100 => array('gm_level' => 3, 'data_type' => 6, 'name' => '채집Exp 회수', 'edit_table_name'=>'DBPlayerContent', 'edit_column_name'=>'gather_exp', 'add_edit_db_info'=>'')
, 101 => array('gm_level' => 2, 'data_type' => 3, 'name' => '정액제 만료시간 변경', 'edit_table_name'=>'BL_GT_VIP', 'edit_column_name'=>'eff_end_date', 'add_edit_db_info'=>'')
, 102 => array('gm_level' => 2, 'data_type' => 8, 'name' => '재매입 가능 아이템 복구', 'edit_table_name'=>'-', 'edit_column_name'=>'-', 'add_edit_db_info'=>'')
, 103 => array('gm_level' => 2, 'data_type' => 4, 'name' => '확장인벤 영구제여부 수정', 'edit_table_name'=>'DBInventorySlotOpenInfo', 'edit_column_name'=>'permanent_open', 'add_edit_db_info'=>'')
, 104 => array('gm_level' => 2, 'data_type' => 3, 'name' => '확장인벤 기간수정', 'edit_table_name'=>'DBInventorySlotOpenInfo', 'edit_column_name'=>'expiretime', 'add_edit_db_info'=>'')
, 105 => array('gm_level' => 2, 'data_type' => 3, 'name' => 'Mount 만료시간 변경', 'edit_table_name'=>'DBMount', 'edit_column_name'=>'expiretime', 'add_edit_db_info'=>'')
, 106 => array('gm_level' => 2, 'data_type' => 3, 'name' => 'Pet 만료시간 변경', 'edit_table_name'=>'DBPet', 'edit_column_name'=>'expiretime', 'add_edit_db_info'=>'')
, 107 => array('gm_level' => 2, 'data_type' => 3, 'name' => 'Fellow 만료시간 변경', 'edit_table_name'=>'DBFellow', 'edit_column_name'=>'expiretime', 'add_edit_db_info'=>'')
, 108 => array('gm_level' => 2, 'data_type' => 5, 'name' => '정액제 만료시간 추가', 'edit_table_name'=>'BL_GT_VIP', 'edit_column_name'=>'eff_end_date', 'add_edit_db_info'=>'')
, 109 => array('gm_level' => 2, 'data_type' => 6, 'name' => '정액제 만료시간 제거', 'edit_table_name'=>'BL_GT_VIP', 'edit_column_name'=>'eff_end_date', 'add_edit_db_info'=>'')
, 110 => array('gm_level' => 1, 'data_type' => 5, 'name' => '시니스 추가', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'cinis', 'add_edit_db_info'=>'')
, 111 => array('gm_level' => 3, 'data_type' => 6, 'name' => '시니스 회수', 'edit_table_name'=>'DBPlayerContentToken', 'edit_column_name'=>'cinis', 'add_edit_db_info'=>'')
, 112 => array('gm_level' => 3, 'data_type' => 9, 'name' => '룬슬롯1 삭제', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'rune_item_cid_1', 'add_edit_db_info'=>'')
, 113 => array('gm_level' => 3, 'data_type' => 9, 'name' => '룬슬롯2 삭제', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'rune_item_cid_2', 'add_edit_db_info'=>'')
, 114 => array('gm_level' => 3, 'data_type' => 9, 'name' => '룬슬롯3 삭제', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'rune_item_cid_3', 'add_edit_db_info'=>'')
, 115 => array('gm_level' => 3, 'data_type' => 9, 'name' => '룬슬롯4 삭제', 'edit_table_name'=>'DBItem', 'edit_column_name'=>'rune_item_cid_4', 'add_edit_db_info'=>'')
    );

  function __construct( $arg1 = null, $arg2 = null ) {
    $this->bo = new BlessBO();
  }

  public function getModifyInfo( string $modify_code ){
    $result = $this->ModifyInfo[$modify_code];
    //debug('[php] getModifyInfo : ' + $result);
    return $result;
    //if ($result) return $result;
  }

  public function getModifyInfoAddDBInfo( string $edit_table_name, string $edit_column_name ){
    $result = '';
    foreach( $this->ModifyInfo as $key=>$value ){
      if ($edit_table_name == $value['edit_table_name'] && $edit_column_name == $value['edit_column_name']) {
        if ($value['add_edit_db_info']) $result = $value['add_edit_db_info'];
        break;
      }
    }
    return $result;
  }

  public function getAdmGMLevel(){
    return $this->bo->getAdmGMLevel();
  }

  /**
   * 코드별 데이터 수정 처리
   * GM권한을 가지고 있으면 바로수정
   * GM권한이 없으면 로그기록하여 수정요청
   * @param string $modify_code 변경 항목 코드
   * @param string $modify_data 변경 값
   */
  public function modifyGameDataItem( string $modify_code, $csn, $server_id, $usn, string $character_name, string $before_data, $modify_data, string $memo_data, $extra_id, string $reference_url  ){
    debug('modifyGameDataItem... modify_code : '.$modify_code.', modify_data : '.$modify_data);
    $modify_info = $this->getModifyInfo( $modify_code );
    debug($modify_info);

    $admGMLevel = $this->getAdmGMLevel();
    debug($admGMLevel);
    $nowDate = date('YmdHis');
    $localDB = DB::instance('adm_local');

    $insertQuery = "INSERT INTO adm_local.bl_gamedata_edit_log (msn, server_id, usn, csn, character_name, edit_table_name, edit_column_name,
      before_data, edit_data, edit_memo, reg_date, edit_status, require_gm_level, editor_gm_level, approve_msn, approve_date, extra_id, modify_code, reference_url)
      VALUES (:msn, :server_id, :usn, :csn, :character_name, :edit_table_name, :edit_column_name,
      :before_data, :edit_data, :edit_memo, :reg_date, :edit_status, :require_gm_level, :editor_gm_level, :approve_msn, :approve_date, :extra_id, :modify_code, :reference_url)";

    if ($admGMLevel > $modify_info['gm_level']) {   // GM등급이 클 경우 수정 요청 처리
      debug('modifyGameDataItem... 수정요청 ');
      $edit_status = 1;
      $approve_msn = null;
      $approve_date = null;
    } else { // GM등급이 작거나 같을 경우 바로 수정 처리
      debug('modifyGameDataItem... 바로수정 ');
      $edit_status = 2;
      $approve_msn = $_SESSION['user']['msn'];
      $approve_date = $nowDate;
    }

    $localDB->prepare( $insertQuery )
      ->bindParam('msn', $_SESSION['user']['msn'])
      ->bindParam('server_id', $server_id)
      ->bindParam('usn', $usn)
      ->bindParam('csn', $csn)
      ->bindParam('character_name', $character_name)
      ->bindParam('edit_table_name', $modify_info['edit_table_name'])
      ->bindParam('edit_column_name', $modify_info['edit_column_name'])
      ->bindParam('before_data', $before_data)
      ->bindParam('edit_data', $modify_data)
      ->bindParam('edit_memo', $memo_data)
      ->bindParam('reg_date', $nowDate)
      ->bindParam('edit_status', $edit_status)
      ->bindParam('require_gm_level', $modify_info['gm_level'])
      ->bindParam('editor_gm_level', $admGMLevel)
      ->bindParam('approve_msn', $approve_msn)
      ->bindParam('approve_date', $approve_date)
      ->bindParam('extra_id', $extra_id)
      ->bindParam('modify_code', $modify_code)
      ->bindParam('reference_url', $reference_url)
      ->set();

    ActionLog::write2(array(
      'act_type'    => 'modifyGameDataItem',
      'target'      => $usn,
      'value'       =>
        array(
          'msn'      => $_SESSION['user']['msn'],
          'server_id' => $server_id,
          'usn' => $usn,
          'csn' => $csn,
          'character_name' => $character_name,
          'edit_table_name' => $modify_info['edit_table_name'],
          'edit_column_name' => $modify_info['edit_column_name'],
          'before_data' => $before_data,
          'edit_data' => $modify_data,
          'edit_memo' => $memo_data,
          'reg_date' => $nowDate,
          'edit_status' => $edit_status,
          'require_gm_level' => $modify_info['gm_level'],
          'editor_gm_level' => $admGMLevel,
          'approve_msn' => $approve_msn,
          'approve_date' => $approve_date,
          'extra_id' => $extra_id,
          'modify_code' => $modify_code,
          'reference_url' => $reference_url
        ),
      'extra2'=>$usn,
      'extra3'=>$csn
    )
  );

    if ($admGMLevel <= $modify_info['gm_level']) {   // GM등급이 작을 경우 바로 수정 처리

      // 등록한 log_seq 값을 가져옴
      $sql = 'SELECT log_seq FROM adm_local.bl_gamedata_edit_log WHERE msn=:msn AND reg_date=:reg_date';
      $result = $localDB->prepare( $sql )
                ->bindParam('msn', $_SESSION['user']['msn'])
                ->bindParam('reg_date', $nowDate)->getTop();
      debug('등록한 log_seq 값을 가져옴');
      debug($result);

      if ($result) {
        debug('log_seq : '.$result['log_seq']);
        return $this->confirmModifyGameDataItem($result['log_seq']);
      }
    }

    return true;
  }

  /**
   * 해당 log_seq를 수정함
   * @param $log_seq
   */
  public function confirmModifyGameDataItem($log_seq) {

    $admGMLevel = $this->getAdmGMLevel();
    $localDB = DB::instance('adm_local');
    $admQuery = 'SELECT * FROM adm_local.bl_gamedata_edit_log WHERE log_seq=:log_seq';
    $result = $localDB->prepare( $admQuery )->bindParam('log_seq', $log_seq)->getTop();

    if ($result) {

      if ($admGMLevel > $result['require_gm_level']) {
        debug('수정 승인 권한이 없습니다. GM Level :'.$admGMLevel.', 필요 GM Level : '.$result['require_gm_level']);
        if ($admGMLevel == 2 && $result['msn'] != $_SESSION['user']['msn']) {
          debug('GMLevel 2로 다른 GM이 승인 요청한 건을 승인처리합니다.');
        } else if ($result['msn'] == $_SESSION['user']['msn']) {
          return '본인이 요청한 건은 승인처리 할 수 없습니다.';
        } else {
          return '수정 승인 권한이 없습니다.';
        }
      }

//      // 현재 게임 접속중인지 확인 -> 접속중이면 에러메세지 출력
//      $connectInfo = $this->bo->getConnectInfo($result['usn']);
//      if($connectInfo->LBLged === 'T'){
//        return '유저가 접속중입니다.';
//      }

      // 선처리하여 리턴시키는경우 이곳에서 모두 처리
      // case 1: 게임내 GMLevel수정의 경우 바로 수정 후로그 기록 하여 완료 처리
      if ($result['modify_code'] == 1) {
        $this->bo->setGmlevel($result['usn'], $result['edit_data']);
        return $this->updateEndEditLog($log_seq, 'BO::setGmLevel');
      }
      else if ($result['modify_code'] == 3) {
        $this->bo->getDB('game', $result['server_id'])
          ->prepare( 'EXEC BLSP_Native_RestorePlayer :player_db_id, :max_player_slot_count, :ret' )
          ->bindParam('player_db_id', $result['csn'])
          ->bindParam('max_player_slot_count', 10)
          ->bindInOutParam('ret', $spResult)
          ->set(true);
        if ($spResult ==='0'){
//          $this->bo->getDB('middle')
//            ->prepare("
//              UPDATE BL_GT_WEB_CHAR
//              SET unreg_date = NULL, upd_date = GETDATE()
//              WHERE csn =:csn AND world_id =:chid  AND usn =:usn
//              ")
//            ->bindParam('csn', $result['csn'])
//            ->bindParam('chid', $result['server_id'])
//            ->bindParam('usn', $result['usn'])
//            ->set();
          return $this->updateEndEditLog($log_seq, 'BLSP_Native_RestorePlayer');

        }
        else if($spResult==='1'){ return '삭제된 캐릭터를 찾을 수 없습니다.'; }
        else if($spResult==='2'){ return '가질수 있는 캐릭터 수량을 초과했습니다.'; }
        else if($spResult==='3'){ return '중복된 캐릭터명이 존재합니다.'; }
        else{ return '알수 없는 문제가 발생했습니다'.$spResult; }
      }
      // case 4: Kickout의 경우 로그 기록 하여 완료 처리
      // GameData.js에서 Jorbi로 콜한다
      else if ($result['modify_code'] == 4) {
        return $this->updateEndEditLog($log_seq, 'Jorbi');
      }
      // case 6: 캐릭터명 변경
      else if ($result['modify_code'] == 6) {
        $this->bo->getDB('game', $result['server_id'])
          ->prepare( 'EXEC BLSP_Native_ChangePlayerName :player_db_id, :new_player_name, :ret' )
          ->bindParam('player_db_id', $result['csn'])
          ->bindParam('new_player_name', $result['edit_data'])
          ->bindInOutParam('ret', $spResult)
          ->set(true);
        if ($spResult ==='0'){ return $this->updateEndEditLog($log_seq, 'BLSP_Native_ChangePlayerName'); }
        else if($spResult==='1'){ return '캐릭터 명을 변경할 플레이어를 찾을 수 없습니다.'; }
        else if($spResult==='2'){ return '중복된 캐릭터명입니다.'; }
        else{ return '알수 없는 문제가 발생했습니다'.$spResult; }
      }
      // case 53: setStory
      else if($result['modify_code'] == 53){
        $this->bo->setStory($result['usn'], $result['csn'], $result['edit_data'], $result['server_id']);
        return $this->updateEndEditLog($log_seq, 'Jorbi');
      }
      // case 79: 위치이동의 경우 여러 값을 한번에 INSERT하고 완료처리
      else if ($result['modify_code'] == 79){
        $arr  = json_decode($result["edit_data"]);
        $query = 'UPDATE dbo.'.$result['edit_table_name'].' SET
          last_location_x = :xpoint,
          last_location_y = :ypoint,
          last_location_z = :zpoint,
          last_world_instance_sid = :sid,
          last_worldmap_type = :type,
          last_worldmap_wrapper_cid = :wrapper,
          last_worldmap_cid = :cid
          WHERE Player_DB_Id = :csn
          ';

        $this->bo->getDB('game', $result['server_id'])->prepare($query)
          ->bindParam('xpoint',$arr[0])
          ->bindParam('ypoint',$arr[1])
          ->bindParam('zpoint',$arr[2])
          ->bindParam('sid',$arr[3])
          ->bindParam('type',$arr[4])
          ->bindParam('wrapper',$arr[5])
          ->bindParam('cid',$arr[6])
          ->bindParam('csn',$result["csn"])->set();

        return $this->updateEndEditLog($log_seq, $query);
      }
      //case 80: 귀환지로 이동.
      else if($result['modify_code'] == 80){
        $arr  = json_decode($result["edit_data"]);
        $query = 'UPDATE dbo.'.$result['edit_table_name'].' SET
          last_location_x = :xpoint,
          last_location_y = :ypoint,
          last_location_z = :zpoint,
          last_worldmap_type = :type,
          last_worldmap_wrapper_cid = :wrapper,
          last_worldmap_cid = :cid
          WHERE Player_DB_Id = :csn
        ';

        $this->bo->getDB('game', $result['server_id'])->prepare($query)
          ->bindParam('xpoint',$arr[0])
          ->bindParam('ypoint',$arr[1])
          ->bindParam('zpoint',$arr[2])
          ->bindParam('type',$arr[3])
          ->bindParam('wrapper',$arr[4])
          ->bindParam('cid',$arr[5])
          ->bindParam('csn',$result["csn"])->set();

        return $this->updateEndEditLog($log_seq, $query);
      }
      //case 81: 던전귀속정보 초기화
      else if ($result['modify_code'] == 81){
        //cooltime_expire_date, dungeon_stage_index
        $query = "UPDATE dbo.".$result['edit_table_name']." SET
          cooltime_expire_date = :expire_date,
          dungeon_stage_index = 1
          WHERE player_db_id = :csn
        ";
        $this->bo->getDB('game', $result['server_id'])->prepare($query)
          ->bindParam('expire_date', date('Y-m-d H:i:s', strtotime('19880125100000')) )
          ->bindParam('csn', $result['csn'])
          ->set();
        return $this->updateEndEditLog($log_seq, $query);
      }
      //case 37: 삭제아이템 복구
      else if ($result['modify_code'] == 37){
        $this->bo->getDB('game', $result['server_id'])
          ->prepare( 'EXEC BLSP_Native_RestoreItemOnMail :item_db_id, :player_db_id, :title, :content, :ret ' )
          ->bindParam('item_db_id', $result['extra_id'])
          ->bindParam('player_db_id', $result['csn'])
          ->bindParam('title', '삭제 아이템 복구')
          ->bindParam('content', '삭제 아이템 복구 우편입니다(운영자발신)')
          ->bindInOutParam( 'ret', $spResult )
          ->set(true);
        if ($spResult ==='0'){ return $this->updateEndEditLog($log_seq, 'BLSP_Native_RestoreItemOnMail'); }
          else if($spResult==='1'){ return '잘못된 Player DBID'; }
          else if($spResult==='2'){ return '삭제상태 아이템이 아닙니다'; }
          else{ return '알수 없는 문제가 발생했습니다'.$spResult; }
      }
      //case 38: 삭제아이템 이동
      else if ($result['modify_code'] == 38){
        $this->bo->getDB('game', $result['server_id'])
          ->prepare( 'EXEC BLSP_Native_RestoreItemOnMail :item_db_id, :player_db_id, :title, :content, :ret ' )
          ->bindParam('item_db_id', $result['extra_id'])
          ->bindParam('player_db_id', $result['edit_data'])
          ->bindParam('title', '삭제 아이템 복구')
          ->bindParam('content', '삭제 아이템 복구 우편입니다(운영자발신)')
          ->bindInOutParam( 'ret', $spResult )
          ->set(true);
         if ($spResult ==='0'){ return $this->updateEndEditLog($log_seq, 'BLSP_Native_RestoreItemOnMail'); }
          else if($spResult==='1'){ return '잘못된 Player DBID'; }
          else if($spResult==='2'){ return '삭제상태 아이템이 아닙니다'; }
          else{ return '알수 없는 문제가 발생했습니다'.$spResult; }
      }
      //case 82: 아이템 다른유저에게 보내기
      else if ($result['modify_code'] == 82){
        $this->bo->getDB('game', $result['server_id'])
          ->prepare( 'EXEC BLSP_Native_MoveItemToPlayerOnMail :item_db_id, :player_db_id, :title, :content, :ret ' )
          ->bindParam('item_db_id', $result['extra_id'])
          ->bindParam('player_db_id', $result['edit_data'])
          ->bindParam('title', '운영자 아이템 복구')
          ->bindParam('content', '운영자 아이템 복구 우편입니다(운영자발신)')
          ->bindInOutParam( 'ret', $ret )
          ->set(true);
        return $this->updateEndEditLog($log_seq, 'BLSP_Native_MoveItemToPlayerOnMail');
      }
      //case 67, 68: 우편 반송 -> SP 호출
      else if ($result['modify_code'] == 67 || $result['modify_code'] == 68){
        $this->bo->getDB('game', $result['server_id'])
          ->prepare( 'EXEC BLSP_Native_SendBackMail :mail_db_id, :ret' )
          ->bindParam('mail_db_id', $result['extra_id'])
          ->bindInOutParam( 'ret', $ret )
          ->set(true);
        return $this->updateEndEditLog($log_seq, 'BLSP_Native_SendBackMail');
      }
      else if ($result['modify_code'] == 69){
        $this->bo->getDB('game', $result['server_id'])
          ->prepare( 'EXEC BLSP_Native_RestoreDeleteMail :mail_db_id, :ret' )
          ->bindParam('mail_db_id', $result['extra_id'])
          ->bindInOutParam( 'ret', $ret )
          ->set(true);
        return $this->updateEndEditLog($log_seq, 'BLSP_Native_RestoreDeleteMail');
      }
      //case 86 ~ 91 : 마운트 펫 펠로우 삭제 및 복구 기능
      else if ($result['modify_code'] == 86){
        $subdb = $this->bo->getDB('game', $result['server_id']);
        $query = 'UPDATE dbo.'.$result['edit_table_name'].' SET
          mount_dbid = 0
          WHERE player_db_id =:csn
        ';
        $subdb->prepare($query)->bindParam('csn',$result['csn'])->set();
        $subdb
          ->prepare( 'EXEC BLSP_delete_DBMount :db_id' )
          ->bindParam('db_id', $result['extra_id'])
          ->set(true);
        return $this->updateEndEditLog($log_seq, 'BLSP_delete_DBMount');
      }
      else if ($result['modify_code'] == 87){
        $subdb = $this->bo->getDB('game', $result['server_id']);
        $query = 'UPDATE dbo.'.$result['edit_table_name'].' SET
          pet_dbid = 0
          WHERE player_db_id =:csn
        ';
        $subdb->prepare($query)->bindParam('csn',$result['csn'])->set();
        $subdb
          ->prepare( 'EXEC BLSP_delete_DBPet :db_id' )
          ->bindParam('db_id', $result['extra_id'])
          ->set(true);

        return $this->updateEndEditLog($log_seq, $query);
      }
      else if ($result['modify_code'] == 88){
        $subdb = $this->bo->getDB('game', $result['server_id']);
        $mission = $this->bo->getFellowMission($result['csn'], $result['extra_id'], $result['server_id']);
        if($mission[0]['db_id'] !== null){
          $failureQuery =
            "UPDATE dbo.DBMission
             SET mission_state = 4, Register_Fellow_DB_Id_1=0, Register_Fellow_DB_Id_2=0, Register_Fellow_DB_Id_3=0
             WHERE db_id = :dbid ";
          $subdb->prepare($failureQuery)->bindParam('dbid',$mission[0]['db_id'])->set();
        }
        $subdb
          ->prepare( 'EXEC BLSP_delete_DBFellow :db_id' )
          ->bindParam('db_id', $result['extra_id'])
          ->set(true);
        return $this->updateEndEditLog($log_seq, 'BLSP_delete_DBFellow + 스튜디오 제공 Fellow 수정 가이드 참조');
      }
      else if ($result['modify_code'] == 89 || $result['modify_code'] == 90 || $result['modify_code'] == 91){
        $query = 'UPDATE dbo.'.$result['edit_table_name'].' SET
          unreg_flag = 0
          WHERE db_id =:dbid
        ';
        $this->bo->getDB('game', $result['server_id'])->prepare($query)->bindParam('dbid',$result['extra_id'])->set();
        return $this->updateEndEditLog($log_seq, $query);
      }
      //case 96 : 임의거점 삭제기능
      else if($result['modify_code'] == 96){
        $this->bo->getDB('game', $result['server_id'])
          ->prepare( 'EXEC BLSP_delete_DBCustomWaypoint :db_id' )
          ->bindParam('db_id', $result['extra_id'])
          ->set(true);
        return $this->updateEndEditLog($log_seq, 'BLSP_delete_DBCustomWaypoint');
      }
      //case 101:정액제 만료시간 수정
      else if($result['modify_code'] == 101){
        $query =  'UPDATE BL_GT_VIP SET eff_end_date=:date WHERE usn=:usn' ;
        $this->bo->getDB('middle')
          ->prepare( $query )
          ->bindParam('usn', $result['usn'])
          ->bindParam('date', date('Y-m-d H:i:s', strtotime($result['edit_data']))  )
          ->set(true);
        return $this->updateEndEditLog($log_seq, $query);
      }
      //case 102 : 재매입 가능 아이템 복구
      else if($result['modify_code'] == 102){
        $this->bo->getDB('game', $result['server_id'])
          ->prepare( 'EXEC BLSP_Native_RestoreRepurchaseItemOnMail :item_db_id, :title, :content, :ret' )
          ->bindParam('item_db_id', $result['extra_id'])
          ->bindParam('title', '아이템 복구')
          ->bindParam('content', '아이템 복구')
          ->bindInOutParam( 'ret', $spResult)
          ->set(true);
        return $this->updateEndEditLog($log_seq, 'BLSP_Native_RestoreRepurchaseItemOnMail');
      }
      //case 108: 일괄 기간추가
       else if($result['modify_code'] == 108 || $result['modify_code'] == 109){
        //if($result['modify_code']===108){ $sign='+'; }else{ $sign='-';}
         $mdb =  $this->bo->getDB('middle');
         $mdb->beginTransaction();
        //일단 입력받은 LEVEL의 정액제 만료일을  +5day  시킨다.
         debug($result['usn']);
         debug($result['extra_id']);
         debug($result['edit_data']);

        $mdb->prepare("
            DECLARE @enddate Datetime
            DECLARE @usn INT = :usn
            DECLARE @level Int = :level
            DECLARE @amount Int = :amount
            SELECT @enddate = eff_end_date FROM dbo.BL_GT_VIP WHERE usn=@usn and level=@level
            UPDATE BL_GT_VIP SET eff_end_date = DATEADD(D, @amount, @enddate) WHERE usn=@usn and level=@level
            ")
           ->bindParam('usn', $result['usn'])
          ->bindParam('level', $result['extra_id'])
           ->bindParam('amount', $result['edit_data']  )
           ->set();

        $targetLevel = $mdb->prepare("SELECT * FROM dbo.BL_GT_VIP WHERE usn=:usn and eff_end_date>GETDATE() and level!=:level")
           ->bindParam('usn', $result['usn'])
           ->bindParam('level', $result['extra_id'])
           ->get();

        foreach($targetLevel as $key =>$value){
          $mdb->prepare(" UPDATE BL_GT_VIP SET eff_start_date =:sdate, eff_end_date =:edate WHERE usn=:usn and level=:level ")
            ->bindParam('sdate', date('Y-m-d H:i:s', strtotime($value['eff_start_date']. ' '.$result['edit_data'].' day')) )
            ->bindParam('edate', date('Y-m-d H:i:s', strtotime($value['eff_end_date']. ' '.$result['edit_data'].' day')) )
            ->bindParam('usn', $result['usn'])
            ->bindParam('level', $value['level'])
            ->set();
        }
        $mdb->commit();

        return $this->updateEndEditLog($log_seq, 'UPDATE BL_GT_VIP');
      }

      //case 112-115 : 아이템 룬슬롯 삭제
      else if($result['modify_code'] == 112 || $result['modify_code'] == 113 || $result['modify_code'] == 114 || $result['modify_code'] == 115){
        debug('ddddddddddddddddddddddddddddddddddddd');
        switch($result['modify_code']){
          case 112: $rune = 1; break;
          case 113: $rune = 2; break;
          case 114: $rune = 3; break;
          case 115: $rune = 4; break;
        }
        debug('sssssssssssssssssssssss');
        debug($rune);
        debug($result['extra_id']);
        debug('sssssssssssssssssssssss');

        $this->bo->getDB('game', $result['server_id'])
          ->prepare( sprintf( 'EXEC BLSP_update_DBItem_Rune_Item_CId_%s :item_db_id, -1', $rune ) )
          ->bindParam('item_db_id', $result['extra_id'])
          ->set(true);
        return $this->updateEndEditLog($log_seq, 'BLSP_update_DBItem_Rune_Item_CId_'.$rune);
      }


      $targetDB = $this->bo->getDB('game', $result['server_id']);
      $targetDB->beginTransaction();
      // 선처리하지 않는 modifyCode들의 경우 Query 생성, Transaction 시작
      $modifyCode = $result['modify_code'];
      $result['edit_date'] = date('Y-m-d H:i:s'); // 수정일시 정보 기록

      // 수정Query 도입부
      // 수치 변경일 경우는 원래 수치의 +/- 처리, 그 외의경우는 Default 정보로 설정
      if($this->ModifyInfo[$modifyCode]['data_type'] == 5 || $this->ModifyInfo[$modifyCode]['data_type'] == 6) {
        $query = 'UPDATE dbo.'.$result['edit_table_name'].' SET '.$result['edit_column_name'].'+=:edit_data ';
      } else {
        $query = 'UPDATE dbo.'.$result['edit_table_name'].' SET '.$result['edit_column_name'].'=:edit_data ';
      }

      switch( $modifyCode ){
        case 31: case 36:  // 캐릭터 삭제, 아이템 삭제일 경우
          $query .= ', Unreg_Date=:edit_date';
          break;
        case 66:
          $query .= ', Unreg_Date=:edit_date, Delete_Type =3';
          break;
//        case 69:    //BLSP_Native_RestoreDeleteMail 로 변경
//          $query .= ', Unreg_Date=null, Expire_Time =:edit_date';
//          $result['edit_date'] = date('Y-m-d H:i:s', strtotime(date('Ymd').' +15 day'));    // 15일 후로 설정
//          break;
      }

      // 처리 타입이 날짜 타입일 경우 수정 항목 변경
      if ($this->ModifyInfo[$modifyCode]['data_type'] == 3) {
        $result['edit_data'] = date('Y-m-d H:i:s', strtotime($result['edit_data']));
      }

       // 각 테이블별 WHERE 조건 설정
      $dbProcess = $targetDB;
      $query .= ' WHERE ';
      switch( $result['edit_table_name'] ){
        case 'DBPlayer':
          $query .= 'db_id = :csn';
          $dbProcess->prepare($query)
            ->bindParam('csn', $result['csn'])
            ->bindParam('edit_data', $result['edit_data']);
          if ($modifyCode == 7) $dbProcess->bindParam('edit_date', $result['edit_date']);
          break;
        case 'DBPlayerContent':
          $query .= 'Player_DB_Id = :csn';
          $dbProcess->prepare($query)
            ->bindParam('csn', $result['csn'])
            ->bindParam('edit_data', $result['edit_data']);
          break;
        case 'DBAccountCurrency' :
          $query .= 'usn =:usn';
          $dbProcess->prepare($query)
            ->bindParam('edit_data', $result['edit_data'])
            ->bindParam('usn', $result['usn']);
          break;
        case 'DBPlayerContentToken':
          $query .= 'player_db_id =:csn';
          $dbProcess->prepare($query)
            ->bindParam('csn', $result['csn'])
            ->bindParam('edit_data', $result['edit_data']);
          break;
        case 'DBDeathAndRevival':
          $query .= 'Player_DB_Id = :csn';
          $dbProcess->prepare($query)
            ->bindParam('csn', $result['csn'])
            ->bindParam('edit_data', $result['edit_data']);
          break;
        case 'DBAccountData':
          $query .= 'usn = :usn';
          $dbProcess->prepare($query)
            ->bindParam('usn', $result['usn'])
            ->bindParam('edit_data', $result['edit_data']);
          break;
        case 'DBItem':
          $query .= 'Player_DB_Id = :csn AND DB_ID = :extra_id';
          $dbProcess->prepare($query)
            ->bindParam('csn', $result['csn'])
            ->bindParam('extra_id', $result['extra_id'])
            ->bindParam('edit_data', $result['edit_data']);
          if ($modifyCode == 31 || $modifyCode == 36 || $modifyCode == 37) $dbProcess->bindParam('edit_date', $result['edit_date']);
          break;
        case 'DBQuest':
          $query .= 'Player_DB_Id = :csn AND DB_ID = :extra_id';
          $dbProcess->prepare($query)
            ->bindParam('csn', $result['csn'])
            ->bindParam('extra_id', $result['extra_id'])
            ->bindParam('edit_data', $result['edit_data']);
          break;
        case 'DBMonsterBook':
          $query .= 'Player_DB_Id = :csn AND DB_ID = :extra_id';
          $dbProcess->prepare($query)
            ->bindParam('csn', $result['csn'])
            ->bindParam('extra_id', $result['extra_id'])
            ->bindParam('edit_data', $result['edit_data']);
          break;
        case 'DBGuild':
          $query .= 'DB_ID = :extra_id';
          $dbProcess->prepare($query)
            ->bindParam('extra_id', $result['extra_id'])
            ->bindParam('edit_data', $result['edit_data']);
          break;
        case 'DBGuildMember':
          $query .= 'Player_DB_Id = :csn AND DB_ID = :extra_id';
          $dbProcess->prepare($query)
            ->bindParam('csn', $result['csn'])
            ->bindParam('extra_id', $result['extra_id'])
            ->bindParam('edit_data', $result['edit_data']);
          break;
        case 'DBMail':
          if ($modifyCode == 66 || $modifyCode == 67 || $modifyCode == 69) {  // 받은편지함, 삭제된 편지의 경우
            $query .= 'Player_DB_Id = :csn AND DB_ID = :extra_id';
          } else {
            $query .= 'Sender_Player_DB_Id = :csn AND DB_ID = :extra_id';
          }
          $dbProcess->prepare($query)
            ->bindParam('csn', $result['csn'])
            ->bindParam('extra_id', $result['extra_id'])
            ->bindParam('edit_data', $result['edit_data'])
            ->bindParam('edit_date', $result['edit_date']);
          break;
        case 'DBInventorySlotOpenInfo':
          $query .= 'db_id =:db_id';
          $dbProcess->prepare($query)
            ->bindParam('db_id', $result['extra_id'])
            ->bindParam('edit_data', $result['edit_data']);
          break;
        case 'DBMount': case 'DBPet': case 'DBFellow':
          $query .= 'player_db_id =:csn and db_id=:db_id';
          $dbProcess->prepare($query)
            ->bindParam('csn', $result['csn'])
            ->bindParam('db_id', $result['extra_id'])
            ->bindParam('edit_data', $result['edit_data']);
          break;
      }

      debug('confirmModifyGameDataItem... Query : '.$query);
      $result = $dbProcess->set();
      $targetDB->commit();
      debug('confirmModifyGameDataItem... result : '.$result);

      // 처리완료 상태로 변경
      $this->updateEndEditLog($log_seq, $query);
      return $result;
    }
    return false;
  }

  /**
   * 완료상태 등록처리
   * @param $log_seq
   * @return type
   */
  public function updateEndEditLog($log_seq, string $query) {

    ActionLog::write2(array(
      'act_type'    => '처리완료',
      'target'      => $_SESSION['user']['msn'],
      'value'       => $query,
      'extra1'      => $log_seq,
    ));


    $localDB = DB::instance('adm_local');
    $sql = 'UPDATE adm_local.bl_gamedata_edit_log SET edit_status=2, approve_msn=:approve_msn, approve_date=:approve_date WHERE log_seq=:log_seq';
    return $localDB->prepare( $sql )
        ->bindParam('log_seq', $log_seq)
        ->bindParam('approve_msn', $_SESSION['user']['msn'])
        ->bindParam('approve_date', date('YmdHis'))
        ->set();
  }

  /**
   * 해당 log_seq를 반려함
   * @param $log_seq
   */
  public function rejectModifyGameDataItem($log_seq, string $memo_data) {

    $admGMLevel = $this->getAdmGMLevel();

    $localDB = DB::instance('adm_local');
    $sql = 'SELECT * FROM adm_local.bl_gamedata_edit_log WHERE log_seq=:log_seq';
    $result = $localDB->prepare( $sql )->bindParam('log_seq', $log_seq)->getTop();

    if ($result) {

      if ($admGMLevel > $result['require_gm_level']) {
        debug('반려 권한이 없습니다. GM Level :'.$admGMLevel.', 필요 GM Level : '.$result['require_gm_level']);
        if ($admGMLevel == 2) {
          debug('GMLevel 2로 다른 GM이 반려 요청한 건을 승인처리합니다.');
        } else {
          return '반려 권한이 없습니다.';
        }
      }
      $AuthBO = new AuthBO();
      $senderInfo = $AuthBO->memberInfo($_SESSION['user']['msn']);
      $receiverInfo = $AuthBO->memberInfo($result['msn']);

      $subject = '블레스 수정 요청건이 반려되었습니다.';

      $addDBInfo = $this->getModifyInfoAddDBInfo($result['edit_table_name'], $result['edit_column_name']);
      $strAddDBInfo = ($addDBInfo != '') ? ', '.$addDBInfo : '';

      $send_info = array(
       array(
         'field' => '반려 사유',
         'data'  => $memo_data
       ),
       array(
         'field' => '요청한 GM',
         'data'  => $result['msn'].' ('.$receiverInfo['id'].' / '.$receiverInfo['name'].')'
       ),
       array(
         'field' => '서버',
         'data'  => $result['server_id']
       ),
       array(
         'field' => '캐릭터명',
         'data'  => $result['character_name']
       ),
       array(
         'field' => 'csn',
         'data'  => $result['csn']
       ),
       array(
         'field' => '수정 테이블/항목',
         'data'  => $result['edit_table_name'].' / '.$result['edit_column_name'].$strAddDBInfo
       ),
       array(
         'field' => '수정 정보',
         'data'  => '['.$result['before_data'].'] -> ['.$result['edit_data'].']'
       ),
       array(
         'field' => '수정 항목 ID',
         'data'  => ($result['extra_id'] == 0) ? '' : $result['extra_id']
       ),
       array(
         'field' => '수정 Memo',
         'data'  => $result['edit_memo']
       ),
       array(
         'field' => '수정 요청일시',
         'data'  => date('Y-m-d H:i:s', strtotime($result['reg_date']))
       ),
       array(
         'field' => '반려 일시',
         'data'  => date('Y-m-d H:i:s')
       )
      );
      $message = '<b>*반려관련 정보</b>';
      $message .= $this->makeVerticalTable($send_info);
      Mail::send($senderInfo['email'], $receiverInfo['email'], $subject, $message);

      // ActionLog기록
      ActionLog::write('rejectModifyGameDataItem', $_SESSION['user']['msn'], $send_info);

      // 상태정보 변경
      $sql = 'UPDATE adm_local.bl_gamedata_edit_log SET edit_status=3 WHERE log_seq=:log_seq';
      $result = $localDB->prepare( $sql )
        ->bindParam('log_seq', $log_seq)
        ->set();

      return $result;
    }
    return false;
  }

  /**
   * HTML Vertical Table 태그 생성
   * @param array $data=null
   * @param array $opt=null
   * @return string HTML Tag
   */
  function makeVerticalTable( array $data=null ){

    $html = '<table border=1 cellspacing=0 cellpadding=0 bordercolor=#6C9BCB >';
    if( !$data ) return $html.'</table>';

    foreach( $data as $i=>$v ){
      $html .= '<tr><th bgcolor=#D5E4F1>' . $v['field'] . '</th>';
      $html .= '<td>' . $v['data'] . '</td></tr>';
    }

    $html .= '</table>';
    return $html;

  }
}

?>
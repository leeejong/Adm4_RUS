/**
 * BlessDesc
 * ADM 4.0 JavaScript Menu
 * @author bitofsky@neowiz.com 2013.05.14
 * @package
 * @subpackage
 * @encoding UTF-8
 */

// http://glat.info/jscheck/
/*global $, jQuery, $adm, $E, confirm, console, alert, JSON, HTMLInputElement define */

// 명료한 Javascript 문법을 사용 한다.
"use strict";

(function ($, window, document) {

  var DESC = {};

  DESC.bl_gt_char_web = {
    tribe_gender: '성별',
    tribe_type: '종족',
    class_type: '클래스',
    article_cnt: '게시물 작성',
    tail_cnt: '댓글 작성',
    recommend_cnt: '게시물 추천',
    lev: '지정 등급'
  };

  DESC.raceTypeHud = {
    99: "None",
    0: "AMISTAD",
    1: "AQUAELF",
    2: "PANTERA",
    3: "IBLIS",
    4: "SIREN",
    5: "HABICHTS",
    6: "SYLVANELF",
    7: "LUPUS",
    8: "FEDAYIN",
    9: "MASCU",
    10: "Mascu_H",
    11: "Mascu_U"
  };
  DESC.genderTypeHud = {
    99: "None",
    0: "Male",
    1: "Female",
    2: "Androgynous"
  };
  DESC.classTypeHud = {
    99: "None",
    0: "GUARDIAN",
    1: "BERSERKER",
    2: "STRIKER",
    3: "RANGER",
    4: "MAGE",
    5: "WARLOCK",
    6: "PALADIN",
    7: "MYSTIC",
    8: "Assassin",
    9: "A2MAGE"
  };

  DESC.infoLevel = {
    0: '0 : Common',
    1: '1 : Uncommon',
    2: '2 : Rare',
    3: '3 : Epic',
    4: '4 : Legendary'
  };

  DESC.infoLevelCond = {
    0: {
      article_cnt: 0,
      tail_cnt: 0,
      recommend_cnt: 0
    },
    1: {
      article_cnt: 3,
      tail_cnt: 5,
      recommend_cnt: 5
    },
    2: {
      article_cnt: 20,
      tail_cnt: 30,
      recommend_cnt: 40
    },
    3: {
      article_cnt: 99999999999999,
      tail_cnt: 99999999999999,
      recommend_cnt: 99999999999999
    },
    4: {
      article_cnt: 99999999999999,
      tail_cnt: 99999999999999,
      recommend_cnt: 99999999999999
    }
  };

  DESC.infoTribeGender = {M: '남', F: '여'};


  DESC.infoQuestConditionType = {ongoing: '수락', resolved: '완료', not_ongoing: '미수락', not_resolved: '미완료'};
  DESC.infoQuestObjectiveType = {dealDamage: '데미지 입히기', enterTerritory: '특정 위치 진입', escort: '호위', escort2: '데려오기', getitem: '아이템 획득', interact: '상호 작용', kill: '처치', killSkill: '특정 스킬로 처치', pulling: '유인 하기', talk: 'NPC와 대화', talkSelection: 'NPC와 대화 중 선택', useitem: '아이템 사용', acquireSkill: '특정 스킬 획득', completeQuest: '퀘스트 완료'};

  DESC.ItemInfo = {
    item_id: 'Item ID',
    name: '코드네임',
    name_k: '아이템 이름',
    description_k: '설명',
    icon_index: '아이콘',
    equip_category: '분류',
    equip_cat1: '대분류',
    equip_cat2: '중분류',
    equip_cat3: '소분류',
    grade: '등급',
    usable_class: '사용 클래스',
    usable_minlv: '사용 최소 레벨',
    usable_maxlv: '사용 최대 레벨',
    enable_sale: '판매여부',
    buy_price: '구매가격',
    sell_price: '판매가격',
    destroyable: '파괴여부',
    stackable: '겹침',
    max_holding_count: '최대소지',
    min_wp_damage: '최소공격력',
    max_wp_damage: '최대공격력',
    min_wp_spell_damage: '최소주문력',
    max_wp_spell_damage: '최대주문력',
    wp_attackperiod: '공격속도',
    parry_amount: '무기막기',
    armor: '방어력',
    resist: '저항력',
    strength: '힘',
    agility: '민첩',
    intelligence: '지능',
    wisdom: '지혜',
    stamina: '스테미너',
    energy: '에너지',
    valor: '용기',
    technique: '기술',
    concentration: '집중',
    will: '의지',
    domination: '지배',
    conviction: '신념',
    insight: '통찰',
    disappear_on_exhaust: '잔량0일때 삭제',
    effect_charges: '최대사용횟수',
    bondingtype: '귀속'
  };

  DESC.ItemInfo_TYPES = {
    grade: {
      junk: '잡템',
      normal: '일반',
      rare: '희귀',
      legendary: '전설',
      unique: '고유'
    },
    equip_cat1: {
      WP: '무기',
      AR: '방어구',
      EE: '악세서리',
      EI: '기타(EI)',
      none: '기타(none)'
    },
    equip_cat2: {
      '1h': '한손',
      '2h': '양손',
      Massive: '육중한',
      Heavy: '중갑',
      Medium: '평갑',
      Light: '경갑',
      Robe: '로브',
      etc: '기타'
    },
    equip_cat3: {
      dagger: '단검',
      sword: '검',
      mace: '철퇴',
      axe: '도끼',
      hammer: '해머',
      bow: '활',
      staff: '지팡이',
      scythe: '낫',
      orb: '보주',
      crossbow: '석궁',
      wand: '완드',
      shield: '방패',
      helmet: '투구',
      upper: '상의',
      lower: '하의',
      glove: '장갑',
      boots: '신발',
      shoulder: '어깨',
      belt: '벨트',
      cloak: '망토',
      underwear: '속옷',
      necklace: '목걸이',
      earring: '귀걸이',
      ring: '반지',
      none: '기타(none)'

    },
    disappear_on_exhaust: {
      'true': '삭제',
      'false': '삭제안함'
    },
    bondingtype: {
      none: '-',
      onGet: '획득시',
      onEquip: '착용시'
    }
  };

  DESC.NPCInfo = {
    npc_id: 'NPC ID',
    code_name: '코드네임',
    local_name: '이름',
    npc_category: '분류',
    faction: '세력',
    society: '집단',
    level: '레벨',
    can_recognize: '인식 가능',
    visible_range: '인식 거리',
    visible_fov_angle: '인식 각도',
    audible_range: '청각 인지 거리',
    exp_acquired: '습득 경험치',
    drop_money: '드랍 머니',
    drop_money_ratio: '드랍 머니 확률',
    drop_money_range: '드랍 머니 범위',
    aggressive_type: '선공 유형',
    attack_judge_type: '공격 판정',
    attack_damage_type: '데미지 유형',
    skill_list: '사용 스킬'
  };

  DESC.NPCInfo_TYPES = {
    npc_category: {
      monster: '몬스터',
      civilian: '시민',
      waypoint_manager: '이동 관리인',
      return_manager: '귀환 관리인',
      guard: '가드',
      revival_manager: '부활 관리인',
      skill_traner: '스킬 트레이너',
      dungeon_manager: '던전 관리인'
    },
    faction: {
      mob: '몹',
      npc: 'NPC',
      object: '객체'
    },
    can_recognize: {
      'true': '가능',
      'false': '불가'
    },
    aggressive_type: {
      aggressive: '선공',
      defensive: '비선공'
    },
    attack_judge_type: {
      melee: '근거리',
      range: '원거리',
      spell: '주문'
    },
    attack_damage_type: {
      physical: '물리',
      magical: '마법'
    }
  };

  DESC.NPCInfoDropItem = {
    item_name: '아이템 이름',
    rate: '확률',
    min_count: '최소 수량',
    max_count: '최대 수량'
  };

  DESC.QuestInfo = {
    quest_id: '퀘스트 ID',
    name: '코드네임',
    local_name: '퀘스트 이름',
    text_objective_summary: '수행 목표',
    level_min: '최소 레벨',
    level_max: '최대 레벨',
    level_recommended: '적정 레벨',
    recommended_pc_number: '추천 인원수',
    quest_type: '수행 파티 유형',
    time_limit: '시간제한',
    sequential_objective: '순차적 목표수행',
    selective_count: '선택 목표 필요수',
    acceptable_race_list: '허용 종족',
    reward_money: '보상 머니',
    reward_experience: '보상 경험치',
    bonus_reward_money: '보너스 머니',
    bonus_reward_experience: '보너스 경험치',
    repeatable: '반복 가능',
    repeatcount: '반복 횟수',
    max_repeatcount: '최대 반복횟수',
    abandon_possible: '포기 가능'
  };

  DESC.QuestInfo_TYPES = {
    quest_type: {
      normal: '일반',
      party: '파티',
      raid: '레이드'
    },
    acceptable_race_list: {
      'undefined': '모두',
      pantera: '판테라',
      siren: '시렌',
      amistad: '아미스타드',
      aquaElf: '아쿠아엘프'
    },
    repeatable: {
      'true': '가능',
      'false': '불가'
    },
    abandon_possible: {
      'true': '가능',
      'false': '불가'
    },
    sequential_objective: {
      'true': '순차적',
      'false': ' '
    }
  };

  DESC.PropInfo = {
    prop_id: 'Prop ID',
    name: '코드 네임',
    name_k: '소품 이름',
    //title: '',
    //title_k: '',
    prop_category: '분류',
    description_k: '설명',
    icon_index: '아이콘',
    duration: '지속시간',
    can_target: '타겟팅 여부',
    interact_type: '상호작용 유형',
    interact_casting_time: '상호작용 캐스팅 시간',
    after_interact: '상호작용 이후',
    deactive_depose_time: '비활성화 시간',
    faction: '세력'
  };

  DESC.PropInfo_TYPES = {
    prop_category: {
      interact: '상호작용',
      aura: '오라'
    },
    can_target: {
      'false': '불가',
      'true': '가능'
    },
    interact_type: {
      gather: '수집',
      none: '없음',
      portal: '이동'
    },
    after_interact: {
      activate: '활성화',
      deactivate: '비활성화',
      depose: '없어짐'
    }
  };

  DESC.DialogInfo = {
    dialog_id: '대화 ID',
    code_name: '코드 네임',
    category: '분류',
    priority: '우선순위',
    show_questtype: '퀘스트 유형',
    show_questid: '퀘스트 ID',
    monolog_text: '독백'
  };

  DESC.DialogInfo_Condition = {
    player_have_escort: 'NPC 호위 진행시',
    have_questes: '수락 가능 퀘스트가 있는 경우',
    allclear_quest: '모든 퀘스트 클리어시',
    have_quest: '특정 퀘스트 보유시 :',
    rewardable_quest: '특정 보상가능 퀘스트 보유시 :',
    fail_quest: '특정 실패 퀘스트 보유시 :',
    resolved_quest: '특정 완료 퀘스트 보유시 :',
    have_item: '특정 아이템 보유시 :'
  };

  DESC.InstantField_QuestCondition = {
    resolved: '해결',
    notResolved: '미해결',
    having: '보유중',
    havingNotCompleted: '보유중 & 미완료',
    havingCompleted: '보유중 & 완료'
  };

  DESC.DialogInfo_SelectionCondition = {
    ongoing_quest: '퀘스트 진행중',
    rewardable_quest: '퀘스트 보상 획득 가능',
    acceptable_quest: '퀘스트 수행 가능',
    not_under_escort: '호위중이 아닐때'
  };

  DESC.DialogInfo_SelectionFunction = {
    link: '대화 연결',
    end: '대화 종료',
    startWaypoint: '웨이포인트 이동',
    registerWaypoint: '웨이포인트 등록',
    showWaypointUI: '웨이포인트 UI 노출',
    changeFaction: '세력 우호도 변동',
    incQuestObjectiveCount: '퀘스트 진행 상태 갱신',
    revival: '케릭터 부활',
    setDestination: '귀환 장소 설정',
    startEscort: '호위 시작',
    quest_reward: '퀘스트 완료',
    quest_add: '퀘스트 수락',
    talkSelection: '퀘스트 대화'
  };

  DESC.SkillInfo = {
    skill_id: 'Skill ID',
    code_name: '코드 네임',
    local_name: '스킬 이름',
    description: '설명',
    skill_level: '스킬 레벨',
    pc_level: '사용자 레벨',
    icon_index: '아이콘',
    tooltip_template: '툴팁 템플릿',
    prepare_type: '시전 유형',
    need_acquire: '습득 필요',
    firing_type: '발사 유형',
    targeting_type: '타겟팅 유형',
    judge_type: '판정 유형',
    damage_type: '데미지 유형',
    distance_type: '사거리 유형',
    projectile_type: '발사체 유형',
    proj_velocity: '발사체 속도',
    miss_chance: '실패 확률',
    invokable_relationship_type: '발동 관계 유형',
    approach_distance: '발동 거리',
    invokable_distance_lower_limit: '발동 최저 높이',
    invokable_distance_upper_limit: '발동 최대 높이',
    invokable_angle: '발동 각도',
    invoke_alive_condition: '발동 생존 상태',
    invokable_target_rc_state: '발동 가능 상태',
    usable_in_combat: '전투 중 시전',
    mobilitytype: '스킬 이동성',
    move_cast: '시전중 이동',
    move_firing: '발동중 이동',
    target_select_with_judge: '판정시 타겟팅',
    prepare_time: '준비 시간',
    firing_time: '발동 시간',
    applymoment: '스킬 적용시점',
    cooltime: '쿨타임',
    applygcd: '전역 쿨타임',
    cooldowngroup: '쿨다운 그룹',
    applyingtype: '발동 지역 유형',
    n_sw: '무기 데미지 상수',
    n_sws: '무기 주문력 상수',
    n_sa: '전투력 상수',
    n_sps: '주문력 상수',
    invokable_item_type: '사용 아이템 유형',
    skill_grade: '스킬 등급',
    applyingareatargetrelationshiptype: '범위내 타겟 타입',
    applyingareatargetmax: '범위내 최대 타겟 수',
    aggropoint: '도발 포인트',
    dealingamount: '딜링 수치',
    healingamount: '힐링 수치',
    begin_normal_auto_attack: '자동공격 활성화'
  };

  DESC.SkillInfo_TYPES = {
    tooltip_template: $.extend({'undefined': ' '}, DESC.infoClassType3),
    prepare_type: {
      instant: '즉시',
      casting: '캐스팅'
    },
    need_acquire: {
      'true': '필요',
      'false': '불필요'
    },
    firing_type: {
      shooting: '슈팅',
      channeling: '채널링',
      multi_strike: '복수 공격'
    },
    targeting_type: {
      object: '대상',
      non_target: '논타겟',
      point: '지점'
    },
    judge_type: {
      none: '없음',
      spell: '주문',
      melee: '근거리',
      range: '원거리'
    },
    damage_type: {
      physical: '물리',
      magical: '마법'
    },
    distance_type: {
      'short': '짧음',
      'long': '장거리'
    },
    projectile_type: {
      not_projectile: '발사체 아님',
      targeting: '타겟팅',
      non_targeting: '논타겟팅'
    },
    applyingareatargetrelationshiptype: {
      hostile: '적대적',
      all: '모두',
      friendly: '우호적',
      party: '파티'
    },
    invokable_relationship_type: {
      hostile: '적대적',
      all: '모두',
      friendly: '우호적'
    },
    invoke_alive_condition: {
      alive: '생존',
      dead: '죽음'
    },
    invokable_target_rc_state: {
      none: ' ',
      beenHitUp: '공중에 띄워진 상태',
      beenDowned: '쓰러진 상태'
    },
    usable_in_combat: {
      'true': '가능',
      'false': '불가능'
    },
    mobilitytype: {
      movecast_null_movefiring_able: '시전중이동N,사용중이동O',
      movecast_null_movefiring_unable: '시전중이동N,사용중이동X',
      movecast_able_movefiring_able: '시전중이동O,사용중이동O',
      movecast_able_movefiring_unable: '시전중이동O,사용중이동X',
      movecast_unable_movefiring_able: '시전중이동X,사용중이동O',
      movecast_unable_movefiring_unable: '시전중이동X,사용중이동X'
    },
    move_cast: {
      'true': '가능',
      'false': '불가능'
    },
    move_firing: {
      'true': '가능',
      'false': '불가능'
    },
    target_select_with_judge: {
      'true': '타겟팅',
      'false': ' '
    },
    applyingtype: {
      object: '대상',
      object_area: '대상 주변',
      self: '자신',
      self_area: '자신 주변',
      area: '선택 지역'
    },
    begin_normal_auto_attack: {
      'true': '활성화 됨',
      'false': ' '
    },
    applygcd: {
      'true': '전역',
      'false': ' '
    }
  };

  DESC.ItemDropTableInfo = {
    table_id: '테이블 ID',
    name: '테이블 이름'
  };

  DESC.ItemDropTableInfoItems = {
    drop_item: '아이템 이름',
    weight: '확률 가중치',
    min_count: '최소 수량',
    max_count: '최대 수량',
    condition_class: '조건:클래스',
    condition_gender: '조건:성별',
    condition_race: '조건:종족',
    condition_pcfaction: '조건:진영',
    condition_equip_item: '조건:장착아이템',
    condition_inventory_item: '조건:소지아이템'
  };

  DESC.DBPlayer = {
    server_id: '서버',
    account_db_id: 'Account ID',
    player_db_id: 'CSN',
    player_name: '플레이어 이름',
    class_type: '클래스',
    gender_type: '성별',
    race_type: '종족',
    guild_db_name: '길드',
    stacked_kill: '누적 킬',
    stacked_death: '누적 데스',
    tutorial_state_type: '튜토리얼',
    last_standalone_date: '제자리부활사용시간',
    block_chat_date: '채팅금지종료',
    destination_cid: '귀환지',
    emergency_escape_date: '비상 탈출 종료 시간',
    block_mail_type: '우편 패널티 유형',
    block_mail_date: '우편 만료일',
    expire_guild_create_penalty_date: '길드 생성 제한 만료일',
    expire_guild_join_penalty_date: '길드 가입 제한 만료일',
    guild_penalty_type: '길드 패널티 유형',
    energy_max: '에너지 MAX',
    exp: '경험치',
    hp: '현재 HP',
    last_condition_phase: '마지막 상태',
    last_location_cid: '위치 CID',
    last_location_x: 'X좌표',
    last_location_y: 'Y좌표',
    last_location_z: 'Z좌표',
    last_party_sid: '파티 SID',
    last_rotation_yaw: '방향',
    last_world_instance_sid: '인스턴스SID',
    last_worldmap_type: '월드맵Type',
    last_worldmap_cid: '월드맵ID',
    last_worldmap_wrapper_cid: '래퍼ID',
    login_count: '로그인 횟수',
    logout_date: '로그아웃 일시',
    mp: '현재 MP',
    player_level: '레벨',
    unreg_flag: '삭제 여부',
    unreg_date: '삭제 일시',
    unlock_skill_deck_size: '잠금 해제된 스킬덱',
    temp: '  ',
    panelty_type: '패널티 종류',
    panelty_date: '패널티 만료 시간',
    panelty_reason: '패널티 사유',
    panelty_edit: '패널티 수정',
    destinationPoint: '귀환지',
    move_point: '위치이동',
    move_home: '귀환',
    acting_point: '행동력',
    acting_point_max: '행동력Max',
    charge_acting_point_count: '행동력 충전',
    pet_last_fatigue_update_date: '피로도 업뎃시각',
    nextbaserxp: '차주정산RXP',
    craftLevel: '제작레벨',
    craft_exp: '제작경험치',
    gatherLevel: '채집레벨',
    gather_exp: '채집경험치',
    pet_dbid: '소환중인 펫ID',
    inventory_expansion_cid: '확장 CID',
    permanent_open: '영구제',
    expiretime: 'Slot만료시간'
  };

  DESC.DBMonsterBook = {
    count1: '첫번째 목표',
    count2: '두번째 목표',
    count3: '세번째 목표',
    count4: '네번째 목표',
    count5: '다섯번째 목표',
    count6: '여섯번째 목표',
    monsterbook_cid: '몬스터북 CID',
    monsterbook_uid: '몬스터북 UID',
    stage_index: '스테이지 번호'
  };

  DESC.DBItem = {
    item_cid: '아이템 CID',
    item_uid: '아이템 UID',
    amount: '갯수',
    bonding: '귀속',
    equip_slot: '착용슬롯',
    having_slot_change_date: '슬롯변경시간',
    having_slot_type: '슬롯타입',
    inventory_slot_index: '슬롯',
    inventory_tab_index: '탭',
    remain_effect_charges: '잔여',
    unreg_date: '삭제시간',
    custom_count: 'Cnt',
    item_delete: ' ',
    item_restore: ' ',
    item_send: ' ',
    potential_level: '잠재력',
    duration_date: '만료시간'
  };

  DESC.DBItem_equip = {
    item_cid: '아이템 CID',
    item_uid: '아이템 UID',
    amount: '갯수',
    bonding: '귀속',
    equip_slot: '착용슬롯',
    having_slot_change_date: '슬롯변경시간',
    having_slot_type: '슬롯타입',
    inventory_slot_index: '슬롯',
    inventory_tab_index: '탭',
    remain_effect_charges: '잔여',
    unreg_date: '생성시간',
    custom_count: 'Cnt',
    item_delete: ' ',
    item_restore: ' ',
    item_send: ' ',
    potential_level: '잠재력',
    duration_date: '만료시간'
  };

  DESC.DBQuest = {
    quest_cid_num: '퀘스트 CID 번호',
    quest_cid: '퀘스트 CID',
    start_date: '시작일시',
    is_failed: '실패여부',
    count1: '카운트1',
    count2: '카운트2',
    count3: '카운트3',
    count4: '카운트4',
    count5: '카운트5',
    count6: '카운트6',
    extendeddata: '기타데이터',
    flag1: '목표1',
    flag2: '목표2',
    flag3: '목표3',
    flag4: '목표4',
    flag5: '목표5',
    flag6: '목표6',
    conv_resolved_quest_list: '완료 퀘스트 리스트',
    quest_status: '퀘스트 상태'
  };

  DESC.DBRepeatQuestInfo = {
    quest_cid: '퀘스트 CID',
    repeat_count: '초기화 후 완료 횟수',
    resolved_date: '완료시간',
    resolved_level: '완료레벨',
    total_repeat_count: '총 완료 횟수'
  };

  DESC.DBSkill = {
    skill_cid: '스킬 CID'
  };

  DESC.MonsterBookInfo = {
    id: '몬스터북ID',
    location: '지역',
    open_quest_name: '오픈 퀘스트'
  };

  DESC.MonsterBookInfoStage = {
    summary: '목표',
    count: '죽임',
    reward_money: '보상금',
    reward_experience: '경험치'
  };

  DESC.DBGuildInfo = {
    db_id: '길드ID',
    name: '길드명',
    level: '길드 레벨',
    exp: '길드 경험치',
    influence_amount: '길드영향력',
    reg_date: '길드 생성 일자',
    gold: '길드 창고 골드',
    reusable_name_date: '길드 이름 재사용 가능 날짜',
    unreg_flag: '길드 삭제 여부',
    unreg_date: '길드 삭제 일',
    message: '길드 자기 소개',
    notice: '길드 공지',
    notice_date: '길드 공지 수정 날짜',
    accumulated_co_rp: '축적된 CO RP',
    rpdate1: 'CO RP 정산일',
    accumulated_ro_rp: '축적된 RO RP',
    rpdate2: 'RO RP 정산일',
    calculate_influence_date: '영향력 정산일',
    rp: '길드 보유 RP'
  };

  DESC.DBGuildGradeInfo = {
    name: '직급 이름',
    type: '직급 타입',
    authority: '직급 권한',
    priority: '길드 내 직급 우선 순위'
  };

  DESC.DBGuildMemberInfo = {
    player_db_id: 'CSN',
    player_name: '케릭터명',
    grade_type: '직급 타입',
    player_level: '가입시 레벨',
    join_date: '가입일',
    logout_date: '로그아웃 시간',
    unreg_flag: '삭제 여부',
    unreg_date: '삭제 시간',
    influence: '영향력',
    level: '현재 레벨',
    real_name: '현재 캐릭터명'
  };

  DESC.DBSkillDeckInfo = {
    deck_idx: '덱 인덱스',
    deck_name: '덱 이름',
    conv_skill_cid_list: '스킬 아이디'
  };

  DESC.DBActionBarInfo = {
    slot_idx: '액션바 슬롯',
    actionbar_type: '타입',
    actionbar_id: '스킬ID(아이템ID)'
  };

  DESC.DBPenaltyInfo_BlockMailType = {0: '없음', 1: '스팸', 2: '운영자제재'};
  DESC.DBPenaltyInfo_GuildPenaltyType = {0: '없음', 1: '탈퇴', 2: '추방', 3: '해체'};

  DESC.DBLog = {
    log_time: 'LogTime',
    log_type: 'Action',
    world_id: 'World',
    account_uid: 'USN',
    character_uid: 'CSN',
    character_name: 'CName',
    party_uid: 'Party',
    guild_uid: 'Guild',
    item_uid: 'Item',
    npc_uid: 'Npc',
    level: 'Level',
    class_type: 'Class',
    gender_type: 'Gender',
    race_type: 'Race',
    position: 'Position',
    data_0: 'Data0',
    data_1: 'Data1',
    data_2: 'Data2',
    data_3: 'Data3',
    data_4: 'Data4',
    data_5: 'Data5',
    detail_data: 'Detail',
    description: 'Desc'
  };

  DESC.DBMail = {
    send_time: '보낸시각',
    expire_time: '만료일시',
    unreg_date: '생성/삭제일시',
    db_id: '고유번호',
    // sender_name:'보낸캐릭터',
    sender_player_db_id: '보낸CSN',
    player_db_id: '받는CSN',
    mail_type: '종류',
    state_type: '상태',
    returnflag: '반송',
    keepflag: '보관',
    delete_type: '삭제',
    gold: '골드',
    details: '상세',
    mail_restore: ''
  };

  DESC.DBPet = {
  }

  DESC.DBLog_TYPES = {
    race_type: DESC.raceTypeHud,
    class_type: DESC.classTypeHud,
    gender_type: [DESC.infoTribeGender.M, DESC.infoTribeGender.F],
    /**
     * Log References
     */
    log_type: {
      1000: 'ServerInfo',
      1001: 'NpcInfo',
      1002: 'PropInfo',
      1003: 'DungeonInfo',
      1100: 'StartCQ',
      1110: 'EndCQ',
      1120: 'CQNPCInfo',
      1130: 'CQInfo',
      1200: 'StartCoAuction',
      1210: 'EndCoAuction',
      1230: 'ROInfo',
      1310: 'StartRO',
      1320: 'EndRO',
      1400: 'StartRaid',
      1401: 'EndRaid',
      1500: 'ContributeRaid',
      1600: 'OpenColosseumSession',
      1601: 'CloseColosseumSession',
      10000: 'Login',
      10001: 'Logout',
      10100: 'EnterGame',
      10101: 'LeaveGame',
      10200: 'EnterMap',
      10201: 'LeaveMap',
      11000: 'SavePCStat',
      12000: 'CreateIndun',
      12001: 'DeleteIndun',
      12002: 'EnterIndun',
      12003: 'LeaveIndun',
      13000: 'EnterChannel',
      14000: 'Teleport',
      14001: 'StartWaypoint',
      14010: 'RegisterTelpoint',
      14011: 'DelTelpoint',
      15000: 'RideOn',
      15001: 'RideOff',
      15002: 'SummonPet',
      15003: 'ReturnPet',
      15010: 'taming',
      15020: 'GetMPF',
      15021: 'DelMPF',
      15030: 'IncreaseLevelMPF',
      15031: 'IncreaseExpMPF',
      15032: 'UpgradeMPF',
      15033: 'UpgradefaileMPF',
      20000: 'CreateCharacter',
      20001: 'DeleteCharacter',
      20010: 'IncreaseLevel',
      20011: 'IncreaseExp',
      20012: 'ChangeRank',
      20013: 'IncreaseExpRank',
      20020: 'Die',
      20021: 'Revive',
      20030: 'AddAP',
      20031: 'DelAP',
      20040: 'IncreaseGatherLevel',
      20041: 'IncreaseGatherExp',
      20050: 'IncreaseCraftLevel',
      20051: 'IncreaseCraftExp',
      20800: 'AttendColosseum',
      20801: 'AttendCancelColosseum',
      20802: 'EnterColosseum',
      20803: 'LeaveColosseum',
      20804: 'ColosseumResult',
      20850: 'RequestFlagBattle',
      20851: 'AcceptFlagBattle',
      20852: 'RefuseFlagBattle',
      20853: 'FlagBattleResult',
      20900: 'Killbypc',
      20901: 'Killpc',
      21000: 'KillbyNpc',
      21001: 'KillNpc',
      21002: 'Monsterbattle',
      21201: 'KillBossNpc',
      21202: 'KillBossNpcFail',
      21203: 'BossNpcDrop',
      21204: 'BossUsesSkillResult',
      21300: 'PCSpawnNPC',
      22000: 'AddSkill',
      22190: 'lockSkillDeck',
      22200: 'UnlockSkillDeck',
      22201: 'ActivateSkillDeck',
      22300: 'Unlockinven',
      22301: 'Lockinven',
      30000: 'SellItem',
      30001: 'BuyItem',
      30002: 'RestoreItem',
      32000: 'TradeItemGive',
      32001: 'TradeItemTake',
      32002: 'SingleTradeItem',
      33000: 'sendmail',
      33001: 'senditem',
      33002: 'receivemail',
      33003: 'openmail',
      33004: 'receiveitem',
      33005: 'delmail',
      34000: 'AddItem',
      34001: 'DelItem',
      34002: 'SplitItem',
      34003: 'AddWarehouse',
      34004: 'DelWarehouse',
      34100: 'RewardItem',
      34101: 'GetItem',
      34200: 'UseItem',
      34202: 'DestroyItem',
      34300: 'EquipItem',
      34301: 'TakeOffItem',
      36000: 'AddGold',
      36001: 'DelGold',
      36030: 'AddBP',
      36031: 'DelBP',
      36050: 'AddDP',
      36051: 'DelDP',
      36100: 'AddCP',
      36101: 'DelCP',
      36150: 'AddCPguild',
      36151: 'DelCPguild',
      36200: 'AddRP',
      36201: 'delRP',
      36210: 'CreateRPProduct',
      36211: 'DelRPProduct',
      36300: 'AddLumena',
      36301: 'DelLumena',
      36302: 'FlashShopOn',
      36303: 'FlashShopOff',
      36350: 'AddCoin',
      36351: 'DelCoin',
      37000: 'SuccessCraft',
      38000: 'ChangeItemStat',
      38001: 'ChangeSpecialOpt',
      38002: 'ChangePotential',
      38010: 'DisassembleResult',
      40000: 'InviteParty',
      40001: 'AnswerParty',
      40002: 'CreateParty',
      40003: 'DeleteParty',
      40004: 'JoinParty',
      40005: 'OutOfParty',
      40006: 'KickOfParty',
      40007: 'SetPartyCaptain',
      40008: 'SetParty',
      42000: 'CreateGuild',
      42001: 'DeleteGuild',
      42002: 'joinGuild',
      42003: 'leaveGuild',
      42004: 'KickOfGuild',
      42005: 'inviteGuild',
      42006: 'AnswerGuild',
      42008: 'changeGuildGrade',
      42100: 'IncreaseGuildLevel',
      42101: 'IncreaseGuildExp',
      42200: 'ContributeGuildCP',
      50000: 'StartEpisode',
      50001: 'FinishEpisode',
      50002: 'CompleteConditionEpisode',
      50500: 'Starttutorial',
      50501: 'Endtutorial',
      51000: 'StartStory',
      51001: 'FinishStory',
      51002: 'CompleteConditionStory',
      52000: 'StartMonsterBook',
      52001: 'CompleteMonsterBook',
      52002: 'FinishMonsterBook',
      52500: 'StartFellowMission',
      52501: 'FinishFellowMission',
      52502: 'RewardFellowMission',
      60000: 'AttendCQ',
      60001: 'AttendCancelCQ',
      60003: 'EnterCQ',
      60004: 'LeaveCQ',
      60006: 'CQPoint',
      60007: 'CQResult',
      60008: 'SetCannon',
      60101: 'BidCOAuction',
      60102: 'FailCOAuction',
      60103: 'CitadelOwner',
      60200: 'AttendRO',
      60201: 'EnterRO',
      60202: 'LeaveRO',
      60203: 'ChangeAttendRo',
      60208: 'KillRoNpc',
      60209: 'ROInteractObject',
      60300: 'ContributeRP',
      200000: 'Say',
      200001: 'Whisper',
      300000: 'Abuse',
      300100: 'BotReport',
      400000: 'Cheat',
      900000: 'AbuseDetectMove',
    }
  };


  DESC.DBLog_usetoken_type = {0: '골드', 1: 'cp', 2: 'RP', 3: 'BP', 4: 'DP', 5: 'Rumena'};
  DESC.DBLog_item_trade_type = {0: '스토리', 1: '에피소드', 2: '개인거래', 3: '상점거래', 4: '패키지', 5: '우편', 6: '제작', 7: '치트', 8: '프롭', 9: 'NPC 대화', 10: '몬스터', 11: '몬스터북', 12: '상점 재구매', 20: '기타'};
  DESC.DBLog_point_type = {0: '몬스터', 1: 'PK', 2: '퀘스트', 3: '몬스터북', 4: '치트', 5: '드랍템', 6: '상점', 7: '경매', 8: '특별전장', 9: 'CO', 10: 'RO'};
  DESC.DBLog_guild_grade_type = {0: '길드장', 1: '부길드장', 2: '길드관리자', 3: '일반 길드원', 4: '신입길드원', 5: '신규등급', 6: '신규등급', 7: '신규등급', 8: '신규등급', 9: '신규등급'};

  DESC.DBLog_log_type_TYPES = {
    1100: {data_1: {0: '최초시작', 1: '재시작'}},
    1110: {data_1: {0: '정상', 1: '운영자종료'}, data_3: {0: '군주npc kill', 1: '점수높아승리', 2: '킬수가많아승리', 3: '인원이적어 승리', 4: '인원이 동일해서 패', 5: '양진영 점수가 0이라서 패'}, data_4: {0: '하이란', 1: '우니온', 2: 'lose'}},
    1120: {data_2: {0: '스폰', 1: '디스폰'}},
    1200: {data_2: {0: '최초시작', 1: '재시작'}},
    1210: {data_2: {0: '정상', 1: '비정상종료', 2: '운영자종료'}},
    1310: {data_2: {0: '최초시작', 1: '재시작'}},
    1320: {data_2: {1: '수성승리', 2: '공성승리', 3: '비정상종료', 4: '운영자종료', 5: '공성없음'}},
    10000: {data_1: {0: '일반', 1: '가맹 PCB'}},
    10001: {data_1: {0: '정상', 1: '튕김', 2: '운영자킥'}},
    14000: {data_5: {0: 'prop', 1: '귀환석', 2: 'GM', 3: 'NPC', 4: '비상탈출', 5: '유료귀환(초기화)', 6: '유료파티소환'}},
    15001: {data_1: {0: '자의에 의한해제', 1: 'pc 공격을 받아 해제', 2: 'npc 공격을 받아 해제', 3: '볼륨진입'}},
    15003: {data_3: {1: '해제명령', 2: '피로도부족', 3: '캐릭터사망', 4: '거점이동수단이용', 5: '비행', 6: '펫삭제', 7: '다른펫 소환', 8: '캐릭터로그아웃', 9: '치트'}},
    15010: {data_2: {1: '마운트', 2: '펫', 3: '펠로우'}},
    15020: {data_1: {1: '마운트', 2: '펫', 3: '펠로우'}, data_2: {1: '테이밍', 2: '상품수신함', 3: '퀘스트보상', 4: '상점구매', 9: '치트'}},
    15021: {data_1: {1: '마운트', 2: '펫', 3: '펠로우'}, data_2: {1: '도감삭제', 2: '강화재료', 3: '승급재료', 4: '사용기간만료', 9: '치트'}},
    15030: {data_1: {1: '마운트', 2: '펫', 3: '펠로우'}},
    15031: {data_1: {1: '마운트', 2: '펫', 3: '펠로우'}},
    15032: {data_1: {1: '마운트', 2: '펫', 3: '펠로우'}},
    15033: {data_1: {1: '마운트', 2: '펫', 3: '펠로우'}},
    20011: {data_2: {0: '사냥', 1: 'PVP', 2: '퀘스트', 3: '몬스터북', 4: '채집', 5: '제작', 6: '펠로우 미션', 9: '치트'}},
    20020: {data_1: {0: '익사', 1: '낙사', 2: 'HP를 cost로 사용', 3: 'abnormal status'}},
    20021: {data_1: {0: '제자리 부활', 1: '영혼사부활', 2: '시체부활', 3: '스킬부활', 4: '시스템', 5: 'CQ', 6: 'RO', 9: '치트'}},
    20030: {data_2: {1: '물약사용', 2: '이벤트', 3: '충전', 9: '치트'}},
    20031: {data_2: {1: '스킬사용', 2: '적들과사냥감 반복', 3: '카스트라 공방전 입장', 4: '펠로우 미션 초기화', 5: '전장 입장', 6: '채집과인터랙션', 7: '제작의뢰', 8: '던전입장', 9: '테이밍', 10: '치트'}},
    20051: {data_3: {1: '제작', 2: '제작의뢰'}},
    21201: {data_2: {0: 'Boss', 1: 'Elite'}},
    21202: {data_2: {0: 'Boss', 1: 'Elite'}},
    21203: {data_3: {0: 'Boss', 1: 'Elite'}},
    22000: {data_1: {0: '퀘스트', 1: '스킬북', 2: 'GM'}},
    22200: {data_1: {1: '아이템사용', 2: '기간제 유료상품', 3: '정액제 유료상품', 4: '영구 유료상품', 9: '치트'}},
    22300: {data_1: {1: '기간제패키지정액상품구매', 2: '기간 구매', 3: '영구 구매', 9: '치트'}},
    22301: {data_1: {1: '기간패키지만료', 2: '기간제 만료', 9: '치트'}},
    30000: {data_4: DESC.DBLog_usetoken_type},
    30001: {data_4: DESC.DBLog_usetoken_type},
    30002: {data_4: DESC.DBLog_usetoken_type},
    33000: {data_2: {0: '일반', 1: '시스템'}},
    33002: {data_3: {0: '일반', 1: '시스템', 2: '운영자'}, data_5: {0: '반송아님', 1: '반송'}},
    33005: {data_1: {0: '신규', 1: '읽음', 2: '첨부획득'}, data_2: {0: '직접삭제', 1: '기간만료삭제', 2: '반송', 3: '운영자삭제', 4: '시스템/운영자 우편함 풀로인한 자동삭제'}},
    34000: {data_3: {0: '스토리', 1: '에피소드', 2: '개인거래', 3: '상점거래', 4: '채집', 5: '우편', 6: '제작', 7: '치트', 8: '프롭', 9: 'NPC 대화', 10: '몬스터',
                                11: '몬스터북', 12: '상점 재구매', 13: '길드 창고', 14: '테이밍', 15: '미션', 16: '패키지', 17: '아이템나누기',18:'루메나상점', 20: '기타',
                                21:'플래쉬상점', 22:'추가루팅', 23:'개인창고불출', 24:'거래소구매', 25:'거래소회수'
                              }},
    34001: {data_3: {0: '스토리', 1: '에피소드', 2: '개인거래', 3: '상점거래', 4: '우편', 5: '제작', 6: '제작의뢰', 7: '치트', 8: '프롭', 9: 'NPC 대화', 10: '문', 11: '파괴', 12: '사용', 13: '경매', 14: '기간 만료'}},
    34100: {data_2: {0: '스토리', 1: '에피소드', 2: '몬스터북', 3: '펠로우 미션'}},
    36000: {data_2: {0: '상점거래', 1: 'PVEdrop', 2: 'Quest보상', 3: '적들과사냥감', 4: '채집', 5: '펠로우미션', 6: 'Item사용', 7: '우편', 8: '거래',9:'속성변경',10:'장비추출',11:'거래소판매', 20: '치트'}},
    36001: {data_2: {0: '상점거래', 1: '거점이동수단', 2: '제작의뢰', 3: '우편', 4: '거래', 5: '상점 재구매', 7: '장비속성변경', 20: '치트',21:'퀘스트',22:'경매',23:'길드창설',24:'승급심사',25:'거래소수수료',26:'거래소구매'}},
    36030: {data_2: {0: 'PVEdrop', 1: '채집', 2: '적들과사냥감', 3: 'Quest', 4: '점수전환', 5: '펠로우미션', 6: 'Item', 9: '치트'}},
    36031: {data_2: {0: '제작', 1: '제작의뢰', 2: '장비속성변경', 3: '교환소', 9: '치트'}},
    36050: {data_2: {0: 'PVEdrop', 1: 'Quest', 2: '점수전환', 3: '펠로우미션', 4: 'Item사용', 9: '치트'}},
    36051: {data_2: {0: '제작', 1: '제작의뢰', 2: '장비속성변경', 3: '교환소', 9: '치트'}},
    36100: {data_2: {0: 'PVP', 1: 'CQ', 2: 'Quest', 3: '점수전환', 4: '펠로우미션', 5: 'Item사용', 9: '치트',10:'투기장',99:'몬스터처치'}},
    36101: {data_2: {0: '제작', 1: '제작의뢰', 2: '장비속성변경', 3: '교환소', 9: '치트'}},
    36150: {data_2: {1: 'dailyreward', 2: 'co 낙찰 실패로 인한 환급', 3: 'co 낙찰성공', 9: '치트'}},
    36151: {data_2: {1: 'co입찰', 2: 'cp상점', 9: '치트'}},
    36200: {data_2: {1: 'CoDailyReward', 2: 'RoDailyReward', 3: 'RpProduct', 4: '교환소', 5: '특별전장', 6: 'RO가 하사', 7: 'CO 낙찰 성공', 9: '치트'}, data_3: {1: '스페치아', 2: '히에라콘', 3: '엘라노'}},
    36201: {data_2: {1: '상점구매', 2: '다른길드에하사', 9: '치트'}, data_3: {1: '스페치아', 2: '히에라콘', 3: '엘라노'}},
    36210: {data_1: {1: 'npc', 2: 'trap'}},
    36211: {data_1: {1: '사용시간만료', 2: '상대진영캐릭터 공격에의한 삭제', 10: '운영자삭제'}},
    36300: {data_4: {1: '퀘스트', 2: '출석체크', 3: '정액제', 4: '루메나패키지', 5: '장애보상', 6: '이벤트', 7: '파티소환환불', 9: '치트', 10: '아이템사용',11:'상품수신함'}},
    36301: {data_4: {1: '첫구매상점', 2: '플래쉬상점', 3: '컨텐츠토큰상점', 4: '물약주문서상점', 5: '잡화상점', 6: '동반자상점', 7: '선행스킬상점', 8: '행동력', 9: '속성변경', 10: '특수옵션변경', 11: '제자리부활', 12: '인벤확장', 13: '교환소', 14: '커스터마이징', 15: '파티소환', 16: '귀환쿨타임초기화', 20: '치트'}},
    37000: {data_1: {1: '성공', 2: '대성공'}, data_2: {1: '제작', 2: '제작의뢰'}},
    38000: {data_1: {1: 'strength', 2: 'agility', 3: 'intelligence', 4: 'wisdom', 5: 'stamina', 6: 'technique', 7: 'balance', 8: 'quickness'}},
    40001: {data_2: {0: '거부', 1: '수락'}},
    40002: {data_0: {0: '일반', 1: '공대'}},
    40004: {data_0: {0: '일반', 1: '공대'}},
    40008: {data_0: {0: '자유', 1: '순번', 2: '지정', 3: '주사위'}, data_1: {0: '자유', 1: '순번', 2: '지정', 3: '주사위'}},
    42003: {data_0: {0: '자진탈퇴', 1: '길드해체'}},
    42006: {data_1: {0: '거부', 1: '수락'}},
    42008: {data_1: DESC.DBLog_guild_grade_type, data_2: DESC.DBLog_guild_grade_type},
    42101: {data_2: {1: '길드원 활동', 9: '치트'}},
    50000: {data_3: {0: '일반', 1: '반퀘'}},
    50001: {data_1: {0: '성공', 1: '실패', 2: '포기'}},
    50500: {data_0: {0: '정상시작', 1: '스킵'}},
    50501: {data_0: {0: '정상종료', 1: '중단'}},
    51001: {data_1: {0: '성공', 1: '실패', 2: '포기'}},
    52501: {data_2: {1: '완료', 2: '실패'}},
    53001: {data_1: {0: '정상', 1: '스킵'}},
    60004: {data_0: {0: '자의에 의한 퇴장', 1: '비정상퇴장', 2: '운영자종료', 4: '자리비움 추방', 5: '시스템 킥(CQ 정상 종료후 시스템 일괄 KICK처리시)', 9: '치트'}, data_2: {0: '승리', 1: '패배', 2: '중간이탈'}},
    60006: {data_2: {0: 'npc', 1: 'user'}},
    60200: {data_0: {0: '공격', 1: '수성'}, data_1: {0: '길드장', 1: '부길드장', 2: '길드원'}},
    60201: {data_0: {0: '공격', 1: '수성', 3: '치트'}, data_2: {0: '길드장', 1: '부길드장', 2: '길드원'}, data_3: {1: '경기 전', 2: '경기 중'}},
    60202: {data_0: {0: '자의에 의한 퇴장', 1: '비정상퇴장', 2: '운영자종료', 3: '팀변경'}, data_1: {0: '승리', 1: '패배', 2: '중간이탈'}},
    60203: {data_0: {1: '공격', 2: '수성'}},
    60208: {data_0: {0: '공격', 1: '수성'}, data_1: {1: '1차목표물', 2: '2차목표물'}},
    60209: {data_1: {0: '일반', 1: '파티채팅', 3: '지역채팅', 4: '길드채팅', 5: '길드공지'}},
    200000: {data_0: {0: '일반', 1: '파티채팅', 3: '지역채팅', 4: '길드채팅', 5: '길드공지'}},
    300000: {data_0: {1: '이동 핵'}}

  };

  for (var i in DESC.DBLog_TYPES.log_type)
    DESC.DBLog_TYPES.log_type[i] = i + '\t' + DESC.DBLog_TYPES.log_type[i];

  DESC.DBLog_log_type_description = {
    1100: 'CQ  시작, Start type ( 0=최초시작, 1= 재시작) , endCQ_Time: 초단위',
    1110: 'CQ 종료,  End_type ( 0=정상, 1=운영자종료),win_realm(0=하이란, 1=우니온, 2=lose), type(0= 군주npc kill, 1=점수높아승리, 2= 킬수가많아승리, 3= 인원이적어 승리, 4= 인원이 동일해서 패, 5= 양진영 점수가 0이라서 패), CQ_Session UID 하루 전달까지만 유니크 하면 됨.  StartCQ_Time: 초단위',
    1120: 'CQ내 NPC 정보, Type ( 0= 스폰, 1= 디스폰), realm(디스폰 시킨 렐름 정보)',
    1130: 'Conquest 상태 정보, 카스트라 공방전 시작 후 종료 시 까지 매 1분 간격 & 종료 시 상태 정보 기록, Conquest_CID (해당 카스트라 공방전의 종류), Session_ID (해당 카스트라 공방전의 유니크ID), CQ_TS (초단위, 해당 카스트라 공방전이 살아있는 누적시간)',
    1200: 'co경매 시작, Start type ( 0=최초시작, 1= 재시작) ',
    1210: 'co경매 종료, End_type ( 0=정상, 1=비정상종료, 2=운영자종료), SuccessfulBidCitadel_count(낙찰이 된 시타델 수), NotbidCitadel_count(응찰이 한번도 없었던 시타델 수)',
    1230: 'RO 상태 정보, 수도 쟁탈전 시작 후 종료 시 까지 매 1분 간격 & 종료 시 상태 정보 기록, RO_CID (해당 수도 쟁탈전의 종류), Session_ID (해당 수도 쟁탈전의 유니크ID), RO_TS (초단위, 해당 수도 쟁탈전이 살아있는 누적시간), 전장 내 공성인원수 (현재 RO에 존재하는 공성측 캐릭터 수), 전장 내 수성인원수 (현재 RO에 존재하는 수성측 캐릭터 수)',
    1310: '수도쟁탈전 시작, Start type ( 0=최초시작, 1= 재시작) ',
    1320: '수도쟁탈전 종료, end_type ( 1=수성승리, 2=공성승리, 3=비정상종료, 4=운영자종료, 5=공성없음),startRO_time(시작시간으로 부터 경과시간)',
    10000: '계정 로그인, pcroom_type ( 0 = 일반, 1 = 가맹피씨방 )',
    10001: '계정 로그아웃, logout_type ( 0 = 정상, 1 = 튕김, 2 = 운영자킥 )',
    10100: '게임 입장, position ( GetLogPosition() 사용 )',
    10101: '게임 퇴장, position ( GetLogPosition() 사용 ), playtime ( 플레이 시간, 초 단위 )',
    10200: '맵/인던 입장, map_cid ( 맵 리소스 아이디 ), map_uid ( 할당된 맵 고유 아이디 )',
    10201: '맵/인던 퇴장, map_cid ( 맵 리소스 아이디 ), map_uid ( 할당된 맵 고유 아이디 ), playtime ( 맵에서 플레이 시간, 초 단위 )',
    12000: '',
    12001: '인스턴스던전 소멸 정보',
    12002: '인던 입장 정보, Dungeon_CID (해당 던전의 종류), Dungeon_UID (해당 던전의 유니크ID), CA Stats(물리공격;마법공격;근접물리방어;원거리물리방어,주문마법방어)',
    12003: '인던 퇴장 정보',
    13000: '볼륨채널 입장, volumeChannel_CID (볼륨채널id), volumeChannel_index (볼륨채널 내 채널번호)',
    14000: '이동 전/후 위치, Type(0=prop, 1=귀환석, 2=GM, 3 = NPC, 4 = 비상탈출,5=유료귀환(초기화) ,6=유료파티소환)',
    14001: '와이번(곤돌라, 비행선 등) 시작 포인트 ID, 와이번 도착 포인트 ID',
    14010: '임의 거점등록 (detail_data = 등록된 거점의 x,y,z 좌표)',
    14011: '임의 거점등록삭제 (detail_data = 삭제된 거점의 x,y,z 좌표)',
    15000: '마운트 탑승',
    15001: '마운트 탑승 해제 type (0=자의에 의한해제, 1= pc 공격을 받아 해제 2=npc 공격을 받아 해제, 3=볼륨진입 ) target_uid ( 엔피씨 = npc_cid, 유저 = character_uid )',
    15002: '펫소환, pet_cid(소환한 펫의 CID), pet_uid(소환한 펫의 UID), fatigue(해당 펫이 보유한 피로도양)',
    15003: '펫소환해제, pet_cid(소환한 펫의 CID), pet_uid(소환한 펫의 UID), fatigue(해당 펫이 보유한 피로도양), return_type (1=해제명령,2=피로도부족, 3=캐릭터사망, 4=거점이동수단이용, 5=비행, 6=펫삭제, 7=다른펫 소환, 8=캐릭터로그아웃, 9=치트)',
    15010: '테이밍시도 npc_cid(대상 몬스터의 CID),npc_type(1=마운트, 2=펫, 3=펠로우), (remain_hp= 시도 당시 대상npc의 체력의 백분율 단위기록)',
    15020: 'MPF습득, MPF_type(1=마운트, 2=펫, 3=펠로우), add_type(1=테이밍, 2=상품수신함, 3=퀘스트보상, 4=상점구매, 9=치트), skill_cid#1(NPC에 부여된 첫번째 스킬 CID), skill_cid#2(NPC에 부여된 두번째 스킬 CID), end_time (기간제 = 만료일시(201508141230=년월일시분), 영구 = -1)',
    15021: 'MPF삭제, MPF_type(1=마운트, 2=펫, 3=펠로우), del_type(1=도감삭제, 2=강화재료, 3=승급재료,4=사용기간만료 9=치트), ',
    15030: 'MPF 레벨 증가(=강화), MPF_type(1=마운트, 2=펫, 3=펠로우), increase_level=(레벨상승량) level=(최종레벨), skill_cid(습득한신규스킬_cid)',
    15031: 'MPF 경험치 증가 MPF_type(1=마운트, 2=펫, 3=펠로우),  increase_exp=(경험치상승량), exp=(최종경험치값)',
    15032: 'MPF 등급 증가(=승급), MPF_type(1=마운트, 2=펫, 3=펠로우), npc_grade(1=common, 2=uncommon, 3=rare, 4=epic, 5=legendary), skill_cid#1(NPC에 부여된 첫번째 스킬 CID), skill_cid#2(NPC에 부여된 두번째 스킬 CID)',
    15033: 'MPF 등급 증가 실패(=승급 실패)MPF_type(1=마운트, 2=펫, 3=펠로우), increase_rate=(성공확률상승량) rate=(최종성공확률)',
    20000: '캐릭터 생성, race_type ( 0 = AMISTAD, 1 = AQUAELF, 2 = PANTERA, 3 = IBLIS, 4 = SIREN, 5 = HABICHTS, 6 = SYLVANELF, 7 = LUPUS, 8 = FEDAYIN, 9 = MASCU ), class_type ( 0 = GUARDIAN, 1 = BERSERKER, 2 = STRIKER, 3 = RANGER, 4 = MAGE, 5 = WARLOCK, 6 = PALADIN, 7 = MYSTIC, 9 = A2MAGE), gender_type ( 0 = MALE, 1 = FEMALE ), Body_type(0=AMISTAD/HABICHTS 남자, 1=AMISTAD/HABICHTS 여자, 2=AQUAELF/SYLVANELF 남자, 3=AQUAELF/SYLVANELF 여자, 4=IBLIS/FEDAYIN 남자, 5=IBLIS/FEDAYIN 여자, 6=PANTERA 남자, 7=PANTERA 여자, 8=LUPUS 남자, 9=LUPUS 여자, 10=SIREN 남자, 11=SIREN 여자, 12= MASCU 남자, 13=MASCU 여자)',
    20001: '캐릭터 삭제',
    20010: '캐릭터 레벨 증가',
    20011: '캐릭터 경험치 증가, increase_type (0 = 사냥, 1 = PVP, 2 = 퀘스트, 3 = 몬스터북, 4=채집, 5=제작, 6 = 펠로우 미션, 9 = 치트), target_uid ( 사냥 = npc_cid, PVP = character_uid, 퀘스트 = quest_cid )',
    20012: '캐릭터 계급 변경, Change_Ranklevel=(계급상승/하락량), Ranklevel=(최종 계급 Cid), weekly_gained_exp=(주간 획득 공적)',
    20013: '캐릭터 계급 경험치 증가 increase_Rankexp=(경험치상승량), Rankexp=(최종경험치값), ',
    20020: '캐릭터 사망, die_type (  0 = 익사, 1= 낙사, 2 = HP를 cost로 사용, 3 = 진혼곡 등 abnormal status에 의해 사망) damage(죽었을 때의 데미지값)',
    20021: '캐릭터 부활, revive_type ( 0 = 제자리부활, 1 = 영혼사부활, 2 = 시체부활, 3 = 스킬부활,  4= 시스템, 5 = CQ, 6 = RO,  9 = 치트), target_uid(charater_uid, npc_cid),target_uid(charater_uid, npc_cid)',
    20030: '행동력 증가(틱당 증가는 제외) increase_AP (행동력 증가분), remain_AP (상승분이 반영된 잔여 행동력), add_type (행동력 증가사유. 1=물약사용, 2=이벤트,  3=충전, 9=치트)',
    20031: '행동력 소모. decrease_AP (행동력 감소분), remain_AP (감소분이 반영된 잔여 행동력), del_type (행동력 소모사유. 1=스킬사용, 2=적들과사냥감 반복, 3=카스트라 공방전 입장, 4=펠로우 미션 초기화, 5=전장 입장, 6=채집과인터랙션, 7=제작의뢰, 8=던전입장, 9=테이밍 10=치트,), target_uid (행동력이 쓰여진 대상. skill_CID, Mobbook_CID, …..)',
    20040: '캐릭터 채집 레벨 증가 Gather_level (변경된 채집 레벨)',
    20041: '채집숙련도증가 Increase_GatherExp (증가한 채집 경험치), GatherExp (상승분이 반영된 최종 채집 경험치)',
    20050: '캐릭터 제작 레벨 증가',
    20051: '제작 숙련도 증가 craft_type(1=제작, 2=제작의뢰)',
    20900: 'pc에게죽음,target_character_uid ( 대상 캐릭터 아이디 ), target_account_uid ( 대상 계정 아이디 )',
    20901: 'pc를죽임,target_character_uid ( 대상 캐릭터 아이디 ), target_account_uid ( 대상 계정 아이디 ), remain_HP (당시 자신이 보유하고 있던 HP량의 퍼센티지',
    21000: '몬스터에게죽음',
    21001: '일반 몬스터 사냥 enemy_count=캐릭터와 적으로 인식하고 있는 수, 파티원#n클래스=n번째 파티원(자신 포함) 각각의 클래스 코드(0=가디언,1=버서커,3=레인저,5=팔라딘), 오름차순 정렬',
    21201: '보스 몬스터 사냥 NPC_type(0=Boss, 1=Elite)',
    21202: '보스 몬스터 사냥 실패, combat_time ( 초 단위 ),NPC_type(0=Boss, 1=Elite)',
    21203: '보스 몬스터 아이템 드랍, NPC_Type(0=Boss, 1=Elite)',
    22000: '스킬 추가, add_type ( 0 = 퀘스트, 1 = 스킬북, 2 = GM,)',
    22190: '스킬 덱 잠김 해제',
    22200: '스킬 덱 잠김 해제, current_unlock_count ( 현재 해제되어 있는 개수가 기재됨 ), unlock_type (1=아이템사용, 2=기간제 유료상품, 3 = 정액제 유료상품 , 4=영구 유료상품 9 = 치트)',
    22201: '활성화 할 스킬덱 정보,  skill List =스킬덱 내의 슬롯은 13개를 한번에 저장,스킬리스트를 다음 순서대로 남김(Key skill,Active Skill 1~8, QTE skill1~2, Passive Skill 1~4)',
    22300: '인벤확장 line_index(사용가능 상태로 변경된 인벤토리 라인 넘버), addtype=(1= 기간제패키지정액상품구매, 2= 기간 구매 3=영구 구매, 9=치트)',
    22301: '인벤확장만료 line_index(사용불가 상태로 변경된 인벤토리 라인 넘버), deltype=(1= 기간제패키지 만료, 2= 기간제 만료 , 9=치트)',
    30000: '상점판매 usetoken_type ( 0= 골드 , 1= cp, 2=RP, 3=BP, 4=DP, 5=Rumena)',
    30001: '상점구매 usetoken_type ( 0= 골드 , 1= cp, 2=RP, 3=BP, 4=DP, 5=Rumena)',
    30002: '상점재구매 usetoken_type ( 0= 골드 , 1= cp, 2=RP, 3=BP, 4=DP, 5=Rumena)',
    32000: '아이템주기',
    32001: '아이템받기',
    32002: '단일 거래아이템기록 (1:1 거래 중 1종류의 아이템과 골드가 trade 된 결과 값을 로그로 저장), item_cid(거래한 아이템), gold( item_cid와 거래한 gold 량)',
    33000: '메일보내기, mail_type ( 0=일반, 1 =시스템 )',
    33001: '메일보내기에서 함께 첨부한 아이템, 아이템과 골드를 보낼시 각각 로그를 개별로 남긴다.',
    33002: 'mail_type mail_type ( 0=일반, 1 =시스템, 2=운영자 ), target_uid (  character_uid ), return_mail type(0= 반송아님 , 1=반송)',
    33003: '편지열기',
    33004: '아이템과 골드를 받을시 각각 로그를 개별로 남긴다.',
    33005: 'state_type:(0=신규, 1=읽음, 2=첨부획득), ( del_type ( 0 = 직접삭제,  1 = 기간만료삭제, 2= 반송, 3= 운영자삭제, 4 = 시스템/운영자 우편함 풀로인한 자동삭제 )',
    34000: '아이템 추가, add_type ( 0 = 스토리, 1 = 에피소드, 2 = 개인거래, 3 = 상점거래, 4 =채집, 5 = 우편, 6 = 제작, 7 = 치트, 8 = 프롭, 9 = NPC 대화, 10 = 몬스터, 11 = 몬스터북, 12 = 상점 재구매, 13 = 길드 창고, 14 = 테이밍, 15 = 미션, ,16=패키지, 17=아이템나누기로 신규생성된아이템 , 20 = 기타), target_uid ( npc_cid, character_uid, quest_cid, item_cid, monsterbook_cid, mission_cid 등 )',
    34001: '아이템 삭제, del_type ( 0 = 스토리, 1 = 에피소드, 2 = 개인거래, 3 = 상점거래, 4 = 우편, 5 =제작, 6 = 제작의뢰, 7 = 치트, 8 = 프롭, 9 = NPC 대화, 10 = 문, 11 = 파괴, 12 = 사용, 13 = 경매 , 14 = 기간 만료), target_uid ( npc_cid, character_uid, quest_cid, prop_cid, item_cid 등 )',
    34002: '아이템 나누기-나누고 남은 아이템 stack 지정 (item_uid 변경이 없이 stack 만 변경되는 아이템, 나뉜 아이템은 additem에 구분값으로 확인)',
    34100: '시스템보상, add_type ( 0 = 스토리,  1 = 에피소드, 2 = 몬스터북, 3=펠로우미션), target_uid ( story_cid, quest_cid, monsterbook_cid)',
    34101: '아이템 습득(몬스터에서아이템습득)',
    34200: '아이템사용',
    34202: '아이템 삭제(휴지통삭제)',
    34300: '아이템 장착 End_Time(기간제만료시간(EX.201508141230=년월일시분))',
    34301: '아이템 해제 (기간제만료시간(EX.201508141230=년월일시분))',
    36000: '돈 추가,add_type (0=상점거래, 1=PVEdrop, 2=Quest보상, 3=적들과사냥감, 4= 채집, 5=펠로우미션, 6=Item사용, 7 = 우편, 8=거래,  20= 치트 )',
    36001: '돈 삭제,del_type (0= 상점 거래, 1= 거점이동수단, 2=제작의뢰, 3 = 우편, 4 = 거래, 5 = 상점 재구매, 7 = 장비속성변경,  20 = 치트)',
    36030: '발견점수 추가,add_type ( 0=PveDrop, 1= 채집, 2=적들과사냥감, 3=Quest, 4=점수전환, 5=펠로우미션, 6=Item  9 = 치트,) target_uid ( npc_cid, character_uid, quest_cid, item_cid, monsterbook_cid, mission_cid  등 )',
    36031: '발견점수 삭제, del_type ( 0= 제작, 1=제작의뢰, 2=장비속성변경, 3=교환소, 9=치트), target_uid ( npc_cid, character_uid, quest_cid, item_cid, monsterbook_cid, mission_cid, GM_Uid  등 )',
    36050: '모험점수 추가, add_type ( 0=PVEdrop, 1=Quest, 2=점수전환, 3=펠로우미션, 4=item사용 9=치트), target_uid ( npc_cid, character_uid, quest_cid, item_cid, monsterbook_cid, mission_cid  등 )',
    36051: '모험점수 삭제,del_type ( 0= 제작, 1=제작의뢰, 2=장비속성변경, 3=교환소, 9=치트), target_uid ( npc_cid, character_uid, quest_cid, item_cid, monsterbook_cid, mission_cid, GM_Uid  등 )',
    36100: '명예점수 add_type (0=PVP, 1= CQ, 2=Quest, 3=점수전환, 4=펠로우미션, 5= item사용 9=치트 ), target_uid ( co_Auctioncode_id, npc_cid, character_uid, quest_cid, item_cid, monsterbook_cid, mission_cid  등 )',
    36101: '명예점수 del_type (0= 제작, 1=제작의뢰, 2=장비속성변경, 3=교환소, 9=치트), target_uid ( co_Auctioncode_id, npc_cid, character_uid, quest_cid, item_cid, monsterbook_cid, mission_cid  등 )',
    36150: '길드 영향력 add_type (1 = dailyreward, 2 = co 낙찰 실패로 인한 환급, 3 = co 낙찰성공 9=치트 ),target_uid (co_Auctioncode_id, character_uid)',
    36151: '길드영향력del_type (1 = co입찰,2= cp상점, 9=치트), target_uid ( co_Auctioncode_id, npc_cid)',
    36200: '진영주화생성 add_type (1 = CoDailyReward,2=RoDailyReward 3= RpProduct, 4 = 교환소, 5 = 특별전장, 6  = RO가 하사, 9 = 치트  ) 통치점수 code_id( 1=스페치아, 2=히에라콘, 3= 엘라노, ………..)',
    36201: '진영주화 삭제 del_type (1 = 상점구매, 2 = 다른길드에하사, 9=치트 ) code_id( 1=스페치아, 2=히에라콘, 3= 엘라노, ………..)',
    36210: '소환물생성 remain_time(해제까지의 잔여시간: 초), target_type(1=npc, 2=trap)',
    36211: '소환물해제 end_type( 1=사용시간만료 ,2= 상대진영캐릭터 공격에의한 삭제 10=운영자삭제)',
    36300: '루메나 추가. increase_Lumena (무료 루메나 증가분), remain_Lumena (증가분이 반영된 총 무료 루메나 보유량), increase_Lumena_P (유료 루메나 증가분), remain_Lumena_P (증가분이 반영된 총 유료 루메나 보유량), add_type (1 = 퀘스트, 2 =출석체크, 3 = 정액제, 4=루메나패키지, 5 = 장애보상 6= 이벤트  9= 치트), Item_cid(아이템 형태로 획득한 경우 Item_cid를 남김),target_uid (Quest_cid, item_cid, service_cid)',
    36301: '루메나 삭제. decrease_Lumena (무료 루메나 감소분), remain_Lumena (감소분이 반영된 총 무료 루메나 보유량), decrease_Lumena_P (유료 루메나 감소분), remain_Lumena_P (감소분이 반영된 총 유료 루메나 보유량), del_type (1=첫구매상점, 2=플래쉬상점, 3=컨텐츠토큰상점, 4= 물약주문서상점, 5=잡화상점, 6=동반자상점, 7=선행스킬상점, 8=행동력, 9=속성변경, 10= 특수옵션변경, 11=제자리부활, 12=인벤확장, 13=교환소, 14=커스터마이징 ,20=치트), target_uid (item_cid, item_uid, service_cid)',
    37000: '제작성공 sueecss_type(1=성공, 2=대성공),craft_type(1=제작, 2=제작의뢰)',
    38000: '속성변경  change_stat(1=strength, 2=agility, 3=intelligence, 4=wisdom, 5=stamina, 6=technique, 7=balance, 8=quickness), increase_stat (스탯 증가량), remain_stat (증가분이 반영된 스탯 수치), item parameter (증가분이 반영된 모든 스테이터스, strength; agility; intelligence; wisdom; stamina; technique; balance; quickness )--> 강화 개념의 로그 만들어서 개별속성 변경 제외한 모든 사항 담기',
    38001: '장비효과변경 ',
    40000: '파티 신청, target_character_uid ( 대상 캐릭터 아이디 ), target_account_uid ( 대상 계정 아이디 )',
    40001: '파티 신청 응답, target_character_uid ( 대상 캐릭터 아이디 ), target_account_uid ( 대상 계정 아이디 ), answer_type ( 0 = 거부, 1 = 수락 ), party_uid (초대한 파티의 UID)',
    40002: '파티 생성, party_type ( 0 = 일반, 1 = 공대 )',
    40003: '파티 해체',
    40004: '파티 입장, party_type ( 0 = 일반, 1 = 공대 ), cur_recept_count ( 현재 인원 ), max_recept_count ( 최대 인원 )',
    40005: '파티 탈퇴, captain_character_uid ( 파티장 캐릭터 아이디 ), cur_recept_count ( 현재 인원 ), max_recept_count ( 최대 인원 ), party_uid (나온 파티의 UID)',
    40006: '파티 추방, captain_character_uid ( 파티장 캐릭터 아이디 ), cur_recept_count ( 현재 인원 ), max_recept_count ( 최대 인원 ), party_uid (나온 파티의 UID)',
    40007: '파티장 변경, new_captain_character_uid ( 신규 파티장 캐릭터 아이디 ), cur_recept_count ( 현재 인원 ), max_recept_count ( 최대 인원 )',
    40008: '파티 설정 변경, acquire_type ( 0 = 자유, 1 = 순번, 2 = 지정, 3 = 주사위 ), old_acquire_type',
    42000: 'cur_recept_count ( 현재 인원 ), max_recept_count ( 최대 인원 )',
    42001: '',
    42002: 'cur_recept_count ( 현재 인원 ), max_recept_count ( 최대 인원 )',
    42003: 'leaved_type(0= 자진탈퇴, 1=길드해체)',
    42004: '',
    42005: 'target_character_uid ( 대상 캐릭터 아이디 ), target_account_uid ( 대상 계정 아이디 )',
    42006: 'target_character_uid ( 대상 캐릭터 아이디 ), target_account_uid ( 대상 계정 아이디 ), answer_type ( 0 = 거부, 1 = 수락 )',
    42008: 'grade_type( 0 = 길드장,  1 = 부길드장, 2 = 길드관리자, 3= 일반 길드원, 4= 신입길드원, 5=신규등급, 6=신규등급, 7= 신규등급, 8=신규등급, 9= 신규등급)',
    42100: '길드 레벨 증가',
    42101: '길드 경험치 증가, increase_type ( 1= 길드원 활동, 9 = 치트), target_uid ( charater_uid )',
    50000: '에피소드 시작, npc_cid ( 제공 엔피씨 ), quest_step_index ( 연퀘 순서 인덱스 ), is_repeat_quest ( 반복 퀘스트 여부 0 = 일반, 1 = 반퀘 )',
    50001: '에피소드 종료, finish_type ( 0 = 성공, 1 = 실패, 2 = 포기 )',
    50002: '에피소드 조건 달성, condition_index ( 조건 인덱스 )',
    50500: '0레벨던전 시작, start_type ( 0 =정상시작, 1= 스킵)',
    50501: '0레벨던전 종료, end_type ( 0 = 정상종료, 1 = 중단)',
    51000: '스토리 시작, npc_cid ( 제공 엔피씨 ), Story_step_index ( 연퀘 순서 인덱스 )',
    51001: '스토리 종료, Story_type ( 0 = 성공, 1 = 실패, 2 = 포기 )',
    51002: '스토리 조건 달성, condition_index ( 조건 인덱스 )',
    52000: '몬스터 북 시작',
    52001: '몬스터 북 단계 완료',
    52002: '몬스터 북 완료',
    52500: '펠로우 미션 시작, mission_cid(임무의 CID),mission_Lv(미션레벨)',
    52501: '펠로우 미션 종료, mission_cid(임무의 CID), end_type(1=완료, 2=실패) Fellow_uid(임무를 수행할 펠로우의 UID,최대 3명) (Fellow_uid1, Fellow_uid2, Fellow_uid3)',
    52502: '펠로우 미션 보상, mission_cid(임무의 CID), mission_Lv(미션레벨)',
    60000: 'CQ 참가신청, waiting_Count( 대기열 발생시 자신의 순번)',
    60001: 'CQ 참가신청취소, waiting_Count( 종료 시점 대기열 상태일 경우 자신의 순번)',
    60003: 'CQ 전장입장, remain_time(실제전장시작시간기준)',
    60004: 'CQ 전장퇴장, leave_type ( 0 = 자의에 의한 퇴장, 1 = 비정상퇴장, 2 = 운영자종료,4 = 자리비움 추방, 5 = 시스템 킥(CQ 정상 종료후 시스템 일괄 KICK처리시), 9 = 치트 ), remain_time(실제전장시작시간기준) ,result(0=승리, 1=패배, 2=중간이탈)',
    60006: 'mission_cid (datasheet war.xlsx)',
    60007: 'CQ 전장개인결과 , increase_point(추가값), remain_point(총값)',
    60008: 'CQ대포설치, Cannon_CID(설치된 포탑의 유형/CID), Cannon_UID(설치된 포탑의 고유번호/UID)',
    60101: 'CO입찰 addCP= (기존입찰금액 10%)',
    60102: 'CO낙찰실패',
    60103: 'CO경매성공',
    60200: 'RO참가신청 Attacker_type (1=공격, 2=수성), grade_type ( 0= 길드장, 1=부길드장, 2=길드원 ……….)',
    60201: 'RO전장 입장 Attacker_type (1=공격, 2=수성 3=치트), grade_type ( 0= 길드장, 1=부길드장, 2=길드원 ………. -1=GM) ,enter_type (1 = 경기 전, 2 = 경기 중) ,remain_time (경기 전 = 경기 시작까지 남은 시간, 경기 중 = 경기 종료까지 남은 시간)',
    60202: 'RO전장퇴장, leave_type ( 0 = 자의에 의한 퇴장, 1 = 비정상퇴장, 2 = 운영자종료, 3 = 팀변경 ) , result(0=승리, 1=패배, 2=중간이탈)',
    60203: 'RO참가진영변경 Attacker_type (1=공격, 2=수성)',
    60208: '1/2차Ronpc파괴 Attacker_type (1=공격, 2=수성), target_type(1=1차목표물 , 2= 2차목표물)',
    60209: 'RO오브젝트 각인시도 interact_type(0=성공 , 1= 실패) ,interaction_time( 오프젝트를 인터렉션한 시간 : 초단위)',
    200000: '채팅, chat_type(0 =일반, 1= 파티채팅, 3= 지역채팅 4=길드채팅 5=길드공지)',
    200001: '귓속말',
    300000: 'abuse_type ( 1 = 이동 핵 )',
    300100: 'BOT 신고 (character_uid= 피신고자) ,DistanceMeasure=신고시점신고자와피신고자와 거리(meter), location_ID, Loc(x.y.z)= 피신고자위치정보',
    400000: '치트'
  };

  DESC.DBGMLevelInfo = {
    gm_level: 'GM 등급',
    reg_msn: '등록한 MSN',
    id: 'ID',
    name: '이름',
    reg_date: '등록일시',
    teamname: '팀이름'
  };

  DESC.DBGameDataModifyLogInfo = {
    reg_date: '시간',
    msn: '요청한 GM MSN',
    server_id: '서버',
    character_name: '유저캐릭터명',
    edit_db: '수정할 테이블명/컬럼명',
    modify_code_name: '수정항목명',
    extra_id: 'ID',
    before_data: '이전 값',
    edit_data: '입력한 값',
    edit_memo: '메모',
    reference_url: '참고자료',
    b_approve: ' ',
    b_reject: ' ',
    approve_msn: '처리GM MSN',
    approve_date: '처리시간'
  };

  DESC.DBGameGMLevel = {
    0: 'User',
    1: 'Lv1',
    2: 'Lv2',
    3: 'Lv3',
    4: 'Lv4'
  };

  DESC.EquipSlot = {
    0: '0 무기',
    1: '1 방패',
    2: '2 투구',
    3: '3 가슴방어구',
    4: '4 허리띠',
    5: '5 하의',
    6: '6 신발',
    7: '7 어깨방어구',
    8: '8 장갑',
    11: '11 목걸이',
    12: '12 반지1',
    13: '13 반지2'
  };

  DESC.EParamType = {
    '-1': 'none',
    0: '-',
    //0:'run_forward_speed',
    1: 'run_backward_speed',
    2: 'walk_forward_speed',
    3: 'walk_backward_speed',
    4: 'full_run_forward_speed',
    5: 'jump_ability',
    6: 'max_step_height',
    7: 'stamina',
    8: 'strength',
    9: 'agility',
    10: 'intelligence',
    11: 'wisdom',
    12: 'technique',
    13: 'balance',
    14: 'quickness',
    15: 'armor',
    16: 'spell_armor',
    17: 'attack_power',
    18: 'spell_power',
    19: 'main_weapon_min_damage',
    20: 'main_weapon_max_damage',
    21: 'main_weapon_attack_period',
    24: 'weapon_spell_damage_min',
    25: 'weapon_spell_damage_max',
    29: 'hit_rating',
    30: 'dodge_rating',
    31: 'parry_rating',
    32: 'block_rating',
    33: 'block_reduce_rating',
    34: 'critical_rating',
    35: 'critical_power',
    36: 'resist_rating',
    37: 'rc_resist_rating',
    38: 'haste_rating',
    39: 'hit_chance',
    40: 'spell_hit_chance',
    41: 'dodge_chance',
    42: 'parry_chance',
    43: 'parry_amount',
    44: 'block_chance',
    45: 'block_reduce',
    46: 'spell_resist_chance',
    47: 'rc_resist_chance',
    48: 'critical_chance',
    49: 'critical_modifier',
    50: 'spell_critical_chance',
    51: 'armor_reduce',
    52: 'spell_armor_reduce',
    53: 'haste',
    54: 'auto_attack_period',
    55: 'max_hp',
    56: 'hp_regen',
    57: 'cost_type',
    58: 'max_cost',
    59: 'cost_regen',
    60: 'deal_amplification',
    61: 'heal_amplification',
    62: 'receive_deal_amplification',
    63: 'receive_heal_amplification',
    64: 'aggro_amplification',
    65: 'HP',
    66: 'cost',
    67: 'energy',
    68: 'max_energy',
    69: 'sprint_cost',
    70: 'energy_regen',
    71: 'radius',
    72: 'half_height',
    73: 'swim_forward_speed',
    74: 'swim_backward_speed',
    75: 'push_block_amount',
    76: 'physical_deal_amplification',
    77: 'magical_deal_amplification',
    78: 'receive_physical_deal_amplification',
    79: 'receive_magical_deal_amplification',
    80: 'hill_climbing_ability',
    81: 'flying_forward_speed',
    82: 'flying_backward_speed',
    83: 'melee_deal_amplification',
    84: 'range_deal_amplification',
    85: 'spell_deal_amplification',
    86: 'receive_melee_deal_amplification',
    87: 'receive_range_deal_amplification',
    88: 'receive_spell_deal_amplification',
    89: 'deal_amp_by_backattack',
    90: 'receive_deal_amp_by_backattack',
    91: 'pve_exp_coefficient',
    92: 'pvp_exp_coefficient',
    93: 'pve_gold_drop_coefficient',
    94: 'bp_coefficient',
    95: 'cp_coefficient',
    96: 'dp_coefficient'
  };

  DESC.EParamType_forMake = {
    '-1': 'none',
    0: 'run_forward_speed',
    1: 'run_backward_speed',
    2: 'walk_forward_speed',
    3: 'walk_backward_speed',
    4: 'full_run_forward_speed',
    5: 'jump_ability',
    6: 'max_step_height',
    7: 'stamina',
    8: 'strength',
    9: 'agility',
    10: 'intelligence',
    11: 'wisdom',
    12: 'technique',
    13: 'balance',
    14: 'quickness',
    15: 'armor',
    16: 'spell_armor',
    17: 'attack_power',
    18: 'spell_power',
    19: 'main_weapon_min_damage',
    20: 'main_weapon_max_damage',
    21: 'main_weapon_attack_period',
    24: 'weapon_spell_damage_min',
    25: 'weapon_spell_damage_max',
    29: 'hit_rating',
    30: 'dodge_rating',
    31: 'parry_rating',
    32: 'block_rating',
    33: 'block_reduce_rating',
    34: 'critical_rating',
    35: 'critical_power',
    36: 'resist_rating',
    37: 'rc_resist_rating',
    38: 'haste_rating',
    39: 'hit_chance',
    40: 'spell_hit_chance',
    41: 'dodge_chance',
    42: 'parry_chance',
    43: 'parry_amount',
    44: 'block_chance',
    45: 'block_reduce',
    46: 'spell_resist_chance',
    47: 'rc_resist_chance',
    48: 'critical_chance',
    49: 'critical_modifier',
    50: 'spell_critical_chance',
    51: 'armor_reduce',
    52: 'spell_armor_reduce',
    53: 'haste',
    54: 'auto_attack_period',
    55: 'max_hp',
    56: 'hp_regen',
    57: 'cost_type',
    58: 'max_cost',
    59: 'cost_regen',
    60: 'deal_amplification',
    61: 'heal_amplification',
    62: 'receive_deal_amplification',
    63: 'receive_heal_amplification',
    64: 'aggro_amplification',
    65: 'HP',
    66: 'cost',
    67: 'energy',
    68: 'max_energy',
    69: 'sprint_cost',
    70: 'energy_regen',
    71: 'radius',
    72: 'half_height',
    73: 'swim_forward_speed',
    74: 'swim_backward_speed',
    75: 'push_block_amount',
    76: 'physical_deal_amplification',
    77: 'magical_deal_amplification',
    78: 'receive_physical_deal_amplification',
    79: 'receive_magical_deal_amplification',
    80: 'hill_climbing_ability',
    81: 'flying_forward_speed',
    82: 'flying_backward_speed',
    83: 'melee_deal_amplification',
    84: 'range_deal_amplification',
    85: 'spell_deal_amplification',
    86: 'receive_melee_deal_amplification',
    87: 'receive_range_deal_amplification',
    88: 'receive_spell_deal_amplification',
    89: 'deal_amp_by_backattack',
    90: 'receive_deal_amp_by_backattack',
    91: 'pve_exp_coefficient',
    92: 'pvp_exp_coefficient',
    93: 'pve_gold_drop_coefficient',
    94: 'bp_coefficient',
    95: 'cp_coefficient',
    96: 'dp_coefficient'
  };

  DESC.citadel = {
    1: '루푸스카나',
    3: '플로린 왕국',
    4: '마르타 영지',
    5: '성지 큐리아',
    6: '오스티움 영지',
    11: '나바라 왕국',
    12: '미그달',
    13: '캄파니 영지',
    14: '테르니 영지',
    15: '샤카라'
  };

  DESC.realm = {99: "None", 0: '하이란', 1: '우니온'};
  DESC.attacker = {0: '수성', 1: '공성'};

  DESC.QuestFlag = {
    0: 'Not yet started',
    1: 'Start',
    2: 'Stopped',
    3: 'Complete'
  };

  DESC.legend_option = {
    '-1': '없음',
    1000: '철갑: 숙련',
    1001: '철갑: 전문',
    1002: '철갑: 대가',
    1003: '철갑: 달인',
    1004: '철갑: 명인',
    1005: '인내: 숙련',
    1006: '인내: 전문',
    1007: '인내: 대가',
    1008: '인내: 달인',
    1009: '인내: 명인',
    1010: '요새: 숙련',
    1011: '요새: 전문',
    1012: '요새: 대가',
    1013: '요새: 달인',
    1014: '요새: 명인',
    1015: '강인함: 숙련',
    1016: '강인함: 전문',
    1017: '강인함: 대가',
    1018: '강인함: 달인',
    1019: '강인함: 명인',
    1020: '치유 친화: 숙련',
    1021: '치유 친화: 전문',
    1022: '치유 친화: 대가',
    1023: '치유 친화: 달인',
    1024: '치유 친화: 명인',
    1025: '자각: 숙련',
    1026: '자각: 전문',
    1027: '자각: 대가',
    1028: '자각: 달인',
    1029: '자각: 명인',
    1030: '우직함: 숙련',
    1031: '우직함: 전문',
    1032: '우직함: 대가',
    1033: '우직함: 달인',
    1034: '우직함: 명인',
    1035: '노련함: 숙련',
    1036: '노련함: 전문',
    1037: '노련함: 대가',
    1038: '노련함: 달인',
    1039: '노련함: 명인',
    1040: '전투의 바람: 숙련',
    1041: '전투의 바람: 전문',
    1042: '전투의 바람: 대가',
    1043: '전투의 바람: 달인',
    1044: '전투의 바람: 명인',
    1045: '평화의 바람: 숙련',
    1046: '평화의 바람: 전문',
    1047: '평화의 바람: 대가',
    1048: '평화의 바람: 달인',
    1049: '평화의 바람: 명인',
    1050: '제 3의 눈: 숙련',
    1051: '제 3의 눈: 전문',
    1052: '제 3의 눈: 대가',
    1053: '제 3의 눈: 달인',
    1054: '제 3의 눈: 명인',
    1055: '극복: 숙련',
    1056: '극복: 전문',
    1057: '극복: 대가',
    1058: '극복: 달인',
    1059: '극복: 명인',
    1060: '냉정: 숙련',
    1061: '냉정: 전문',
    1062: '냉정: 대가',
    1063: '냉정: 달인',
    1064: '냉정: 명인',
    1065: '위기 모면: 숙련',
    1066: '위기 모면: 전문',
    1067: '위기 모면: 대가',
    1068: '위기 모면: 달인',
    1069: '위기 모면: 명인',
    1070: '굳건함: 숙련',
    1071: '굳건함: 전문',
    1072: '굳건함: 대가',
    1073: '굳건함: 달인',
    1074: '굳건함: 명인',
    1075: '반격 준비: 숙련',
    1076: '반격 준비: 전문',
    1077: '반격 준비: 대가',
    1078: '반격 준비: 달인',
    1079: '반격 준비: 명인',
    1080: '생존 본능: 숙련',
    1081: '생존 본능: 전문',
    1082: '생존 본능: 대가',
    1083: '생존 본능: 달인',
    1084: '생존 본능: 명인',
    1085: '회피: 숙련',
    1086: '회피: 전문',
    1087: '회피: 대가',
    1088: '회피: 달인',
    1089: '회피: 명인',
    1090: '다이단의 보호: 숙련',
    1091: '다이단의 보호: 전문',
    1092: '다이단의 보호: 대가',
    1093: '다이단의 보호: 달인',
    1094: '다이단의 보호: 명인',
    1095: '명상: 숙련',
    1096: '명상: 전문',
    1097: '명상: 대가',
    1098: '명상: 달인',
    1099: '명상: 명인',
    1100: '다이단의 축복: 숙련',
    1101: '다이단의 축복: 전문',
    1102: '다이단의 축복: 대가',
    1103: '다이단의 축복: 달인',
    1104: '다이단의 축복: 명인',
    1105: '매의 눈: 숙련',
    1106: '매의 눈: 전문',
    1107: '매의 눈: 대가',
    1108: '매의 눈: 달인',
    1109: '매의 눈: 명인',
    1110: '숙달: 숙련',
    1111: '숙달: 전문',
    1112: '숙달: 대가',
    1113: '숙달: 달인',
    1114: '숙달: 명인',
    1115: '반격: 숙련',
    1116: '반격: 전문',
    1117: '반격: 대가',
    1118: '반격: 달인',
    1119: '반격: 명인',
    1120: '질주: 숙련',
    1121: '질주: 전문',
    1122: '질주: 대가',
    1123: '질주: 달인',
    1124: '질주: 명인',
    1125: '질주 준비: 숙련',
    1126: '질주 준비: 전문',
    1127: '질주 준비: 대가',
    1128: '질주 준비: 달인',
    1129: '질주 준비: 명인',
    1130: '디키룩의 금은보화',
    1131: '폐허의 기운',
    1132: '화염의 보호',
    1133: '광부의 넋',
    1134: '망자의 울음',
    1135: '시체벌레의 갑주',
    1136: '치명 피해: 숙련',
    1137: '치명 피해: 전문',
    1138: '치명 피해: 대가',
    1139: '치명 피해: 달인',
    1140: '치명 피해: 명인',
    1141: '약점 공격: 숙련',
    1142: '약점 공격: 전문',
    1143: '약점 공격: 대가',
    1144: '약점 공격: 달인',
    1145: '약점 공격: 명인',
    1146: '전투 몰입: 숙련',
    1147: '전투 몰입: 전문',
    1148: '전투 몰입: 대가',
    1149: '전투 몰입: 달인',
    1150: '전투 몰입: 명인',
    1151: '주문 중독: 숙련',
    1152: '주문 중독: 전문',
    1153: '주문 중독: 대가',
    1154: '주문 중독: 달인',
    1155: '주문 중독: 명인',
    1156: '죽음의 그림자: 숙련',
    1157: '죽음의 그림자: 전문',
    1158: '죽음의 그림자: 대가',
    1159: '죽음의 그림자: 달인',
    1160: '죽음의 그림자: 명인',
    1161: '광란의 전사: 숙련',
    1162: '광란의 전사: 전문',
    1163: '광란의 전사: 대가',
    1164: '광란의 전사: 달인',
    1165: '광란의 전사: 명인',
    1166: '준: 숙련',
    1167: '조준: 전문',
    1168: '조준: 대가',
    1169: '조준: 달인',
    1170: '조준: 명인',
    1171: '깨달음: 숙련',
    1172: '깨달음: 전문',
    1173: '깨달음: 대가',
    1174: '깨달음: 달인',
    1175: '깨달음: 명인',
    1176: '깊은 상처: 숙련',
    1177: '깊은 상처: 전문',
    1178: '깊은 상처: 대가',
    1179: '깊은 상처: 달인',
    1180: '깊은 상처: 명인',
    1181: '제물: 숙련',
    1182: '제물: 전문',
    1183: '제물: 대가',
    1184: '제물: 달인',
    1185: '제물: 명인',
    1186: '흡혈: 숙련',
    1187: '흡혈: 전문',
    1188: '흡혈: 대가',
    1189: '흡혈: 달인',
    1190: '흡혈: 명인',
    1191: '	번뜩임: 숙련',
    1192: '뜩임: 전문',
    1193: '번뜩임: 대가',
    1194: '번뜩임: 달인',
    1195: '번뜩임: 명인',
    1196: '맹수: 숙련',
    1197: '맹수: 전문',
    1198: '맹수: 대가',
    1199: '맹수: 달인',
    1200: '맹수: 명인',
    1201: '디키룩의 폭탄',
    1202: '아난타의 화염',
    1203: '화염군주의 힘',
    1204: '로이사의 번개',
    1205: '루베르의 주문',
    1206: '시체벌레의 독',
    1207: '제련: 숙련',
    1208: '제련: 전문',
    1209: '제련: 대가',
    1210: '제련: 달인',
    1211: '제련: 명인',
    1212: '가시 방패: 숙련',
    1213: '가시 방패: 전문',
    1214: '가시 방패: 대가',
    1215: '가시 방패: 달인',
    1216: '가시 방패: 명인',
    1217: '날렵한 방어: 숙련',
    1218: '날렵한 방어: 전문',
    1219: '날렵한 방어: 대가',
    1220: '날렵한 방어: 달인',
    1221: '날렵한 방어: 명인',
    1222: '굳은 의지: 숙련',
    1223: '굳은 의지: 전문',
    1224: '굳은 의지: 대가',
    1225: '굳은 의지: 달인',
    1226: '굳은 의지: 명인',
    1227: '제압 돌파: 숙련',
    1228: '제압 돌파: 전문',
    1229: '제압 돌파: 대가',
    1230: '제압 돌파: 달인',
    1231: '제압 돌파: 명인',
    1232: '재기: 숙련',
    1233: '재기: 전문',
    1234: '재기: 대가',
    1235: '재기: 달인',
    1236: '재기: 명인',
    1237: '방패술: 숙련',
    1238: '방패술: 전문',
    1239: '방패술: 대가',
    1240: '방패술: 달인',
    1241: '방패술: 명인',
    1242: '기분 나쁜 보석',
    1243: '아난타의 반격',
    1244: '과열',
    1245: '로이사의 비명',
    1246: '치유 강화',
    1247: '시체벌레의 비늘',
    1248: '마법 방어: 숙련',
    1249: '마법 방어: 전문',
    1250: '마법 방어: 대가',
    1251: '마법 방어: 달인',
    1252: '마법 방어: 명인',
    1253: '저항: 숙련',
    1254: '저항: 전문',
    1255: '저항: 대가',
    1256: '저항: 달인',
    1257: '저항: 명인',
    1258: '치유: 숙련',
    1259: '치유: 전문',
    1260: '치유: 대가',
    1261: '치유: 달인',
    1262: '치유: 명인',
    1263: '마법 흡수: 숙련',
    1264: '마법 흡수: 전문',
    1265: '마법 흡수: 대가',
    1266: '마법 흡수: 달인',
    1267: '마법 흡수: 명인',
    1268: '방어 극복: 숙련',
    1269: '방어 극복: 전문',
    1270: '방어 극복: 대가',
    1271: '방어 극복: 달인',
    1272: '방어 극복: 명인',
    1273: '마력 대응: 숙련',
    1274: '마력 대응: 전문',
    1275: '마력 대응: 대가',
    1276: '마력 대응: 달인',
    1277: '마력 대응: 명인',
    1278: '마력 적응: 숙련',
    1279: '마력 적응: 전문',
    1280: '마력 적응: 대가',
    1281: '마력 적응: 달인',
    1282: '마력 적응: 명인',
    1283: '마법 방어 몰입: 숙련',
    1284: '마법 방어 몰입: 전문',
    1285: '마법 방어 몰입: 대가',
    1286: '마법 방어 몰입: 달인',
    1287: '마법 방어 몰입: 명인',
    1288: '마법 저항 몰입: 숙련',
    1289: '마법 저항 몰입: 전문',
    1290: '마법 저항 몰입: 대가',
    1291: '법 저항 몰입: 달인',
    1292: '마법 저항 몰입: 명인',
    1293: '솔플은 닥사',
    1294: '수상한 보석',
    1295: '신화의 노래',
    1296: '과열',
    1297: '응보의 갑옷',
    1298: '치유 금지',
    1299: '시체벌레의 가시',
    1300: '광란: 숙련',
    1301: '광란: 전문',
    1302: '광란: 대가',
    1303: '광란: 달인',
    1304: '광란: 명인'
  };

  DESC.Potential_level = {
    0: "없음",
    1: "자각",
    2: "연마",
    3: "돌파",
    4: "초월",
    5: "신화",
    6: "전승",
    7: "유산",
    8: "잠재력8",
    9: "잠재력9",
    10: "잠재력10"
  };

  DESC.rxpGrade = {
    0: '계급없음',
    1: '1단계/시민군/민병대',
    2: '2단계/이등병',
    3: '3단계/일등병',
    4: '4단계/상등병',
    5: '5단계/정예병',
    6: '6단계/기간병',
    7: '7단계/십부장/십인대장',
    8: '8단계/백부장/백인대장',
    9: '9단계/전위장/전위대장',
    10: '10단계/예비장교/종사',
    11: '11단계/초급장교/견습기사',
    12: '12단계/연방장교/제국기사',
    13: '13단계/고급장교/상급기사',
    14: '14단계/참모장교/정예기사',
    15: '15단계/연대장/기사대장',
    16: '16단계/여단장/기사장',
  }

  DESC.mail_type = {
    0: '일반',
    1: '운영자',
    2: '시스템'
  }

  DESC.state_type = {
    0: '신규',
    1: '읽음',
    2: '첨부 획득'
  }
  DESC.delete_type = {
    0: '직접',
    1: '만료',
    2: '반송',
    3: '운영자',
    4: '자동'
  }

  DESC.ispermanent = {
    1: '영구제',
    2: '기간제'
  }

  DESC.DBMount = {
    db_id: '마운트 UID',
    mount_cid: '마운트ID',
    grade: '등급',
    exp: '경험치',
    level: '레벨',
    ispermanent: '영구제여부',
    skill_ratio_1: 'Ratio1',
    skill_ratio_2: 'Ratio2',
    deleteColumn: '삭제',
    restoreColumn: '복구'
  }

  DESC.DBPet = {
    db_id: 'Pet UID',
    pet_cid: 'Pet ID',
    grade: '등급',
    exp: '경험치',
    level: '레벨',
    ispermanent: '영구제여부',
    skill_ratio_1: 'Ratio1',
    skill_ratio_2: 'Ratio2',
    deleteColumn: '삭제',
    restoreColumn: '복구',
    cooltime_expire_date: '쿨타임만료시간',
    skill_cid_1: '스킬1',
    skill_cid_2: '스킬2',
    fatigue: '피로도'
  }

  DESC.DBFellow = {
    db_id: '펠로우 UID',
    mount_cid: '펠로우ID',
    grade: '등급',
    exp: '경험치',
    level: '레벨',
    ispermanent: '영구제여부',
    skill_cid_1: '스킬1',
    skill_cid_2: '스킬2',
    skill_ratio_1: 'Ratio1',
    skill_ratio_2: 'Ratio2',
    deleteColumn: '삭제',
    restoreColumn: '복구',
    mission_cid: '수행중 미션'
  }

  DESC.mission_state = {
    1: '미진행',
    2: '진행중',
    3: '미션성공',
    4: '미션실패',
    5: '보상완료'
  }

  DESC.DBMission = {
    mission_cid: '미션ID',
    mission_level: '미션레벨',
    mission_option_cid: '미션옵션',
    mission_slot: '미션슬롯',
    mission_state: '미션상태',
    register_fellow_db_id_1: '수행중 팰로우 1',
    register_fellow_db_id_2: '팰로우 2',
    register_fellow_db_id_3: '팰로우 3',
    success_ratio: '성공확률',
    time_to_complete: '완료예정시각',
    total_minute_to_complete: '필요시간'
  }

  DESC.EventManagerHeader = {
    'event_id': 'Event_ID',
    'event_name': 'Event_Name',
    'event_type': 'Event_Type',
    'ref_proc': 'REFERENCE_PROCEDURE',
    'ref_table': 'REFERENCE_TABLE',
    'str_seq': 'Start_SEQ',
    'end_seq': 'End_SEQ',
    'str_date': '시작일',
    'end_date': '종료일',
    'log_type': 'Log_TYPE',
    'world_list': 'WORLD_LIST',
    'condition1': '조건1',
    'condition2': '조건2',
    'title': 'TITLE',
    'cash_item_id': 'ITEM_ID',
    'adm_name': '운영자',
    'reg_date': '등록일',
    'reg_name': '등록자'
  }

  DESC.CharConfigUserinfo = {
    userid: 'ID',
    usn: 'USN',
    connect: '접속여부',
    grade: '블래서쉽',
    gradePoint: '포인트',
    vip: '정액제',
    vipStart: '시작일',
    vipEnd: '종료일',
    viewVip: '조회',
    gmlevel: 'GMLevel',
    kickout: 'Kickout',
    trade: '거래제한',
    ban: '접속제한'
  }

  DESC.DBGuildCreature = {
    server: '서버',
    db_id: '생산물 UID',
    rp_product_cid: '생산물ID',
    type: '타입',
    type_cid: '타입ID',
    location_x: 'X',
    location_y: 'Y',
    location_z: 'Z',
    field_cid: '필드ID',
    volume_channel_cid: '채널ID',
    unreg_date: '소환시간',
    remain_time: '남은시간',
    remove: '소환해제'
  }

  DESC.CommanderWeek = {
    1: '미정산',
    0: '이번주',
    '-1': '지난주'
  }

  DESC.DBCommander = {
    rnk: '순위',
    rankname: '계급명',
    usn: 'USN',
    player_db_id: 'CSN',
    player_name: '캐릭터명',
    realm_type: '진영',
    rxp: 'RXP',
    lastsettletime: '지휘계급 신청 시작시간'
  }

  DESC.DBEvent = {
    event_no: '이벤트번호',
    title: '제목',
    world_list: '서버',
    cash_item_id: '지급꾸러미',
    str_date: '시작일',
    end_date: '종료일',
    adm_name: '등록자',
    reg_date: '등록일'
  }

  DESC.DBEventAttend = {
    event_id: '이벤트번호',
    usn: 'USN',
    login_day: '출석날짜',
    complete_cnt: 'Complete_cnt',
    cur_position: '출석날위치',
    reg_date: '등록일자'
  }

  DESC.PaiduserGiftbox = {
    giftbox_id: 'GIFTBOX_ID',
    reg_date: '받은시간',
    provider_type: '지급유형',
    provider_usn: '보낸USN',
    title: '상품명',
    status: '상태',
    expire_date: '만료일',
    cash_item_id: '꾸러미CID',
    pay_price: '결재금액',
    amount: 'Amount',
    active_world: 'World',
    active_csn: 'CSN',
    saleinfo_id: 'NBOS결재번호',
    getabck: '회수',
    withdraw: '청약철회'
  }

  DESC.PaiduserProviderType = {
    1: '구매',
    2: '선물',
    5: '이벤트지급',
    6: '장애보상',
    7: '운영자지급',
    8: '블래서쉽 등급 보상',
    9: '모바일앱 지급'
  }

  DESC.PaiduserStatus = {
    Y: '개봉',
    N: '미개봉',
    C: '청약철회',
    U: '사용요청',
  }

  DESC.PaiduserLogtype = {
    1: '선물함 사용',
    2: '청약철회',
    3: '운영자 회수',
    4: '만료 회수'
  }

  DESC.ServerHistoryType = {
    open_login: {0: '서버 닫힘', 1: '서버 열림'},
    stop_all_trade: {0: '정지 아님', 1: '정지'},
    stop_auction: {0: '정지 아님', 1: '정지'},
    stop_mail: {0: '정지 아님', 1: '정지'},
    stop_personal_trade: {0: '정지 아님', 1: '정지'},
    stop_warehouse: {0: '정지 아님', 1: '정지'},
  }

  DESC.ServerHistoryHead = {
    log_seq: '일련번호',
    server_id: '서버',
    target: '대상',
    beforevalue: '변경전',
    aftervalue: '변경후',
    reason: '메모',
    editor: '담당자',
    reg_date: '설정시간'
  }

  DESC.ServeSettingHead = {
    server_id: '서버ID',
    name: 'Name',
    max_cu: '접속자 수 제한',
    open_login: '서버상태',
    stop_all_trade: '전체',
    stop_auction: '경매',
    stop_mail: '우편',
    stop_personal_trade: '개인거래',
    stop_warehouse: '창고',
    edit: '서버제한',
    insertAuctionRestrict: '거래소제한'
  }

  DESC.TradeHead = {
    partkey_month: '파티션구분Key',
    auction_id: '거래소ID',
    usn: 'USN',
    csn: 'CSN',
    world_id: '월드ID',
    iten_cid: 'ITEM_CID',
    amount: '등록 수량',
    total_price: '전체 가격',
    expire_date: '만료 일시',
    reg_date: '등록 일시',
    datil: '상세스텟',
    withdraw: '회수',
    buy_usn: '구매자 USN',
    log_date: '로그등록시간',
    item_name: '아이템명',
    item_cid: '아이템CID',
    item_db_id: '아이템UID',
    restore: '복구',
    active_csn: '수령 CSN',
    active_world: '수령 World',
    upd_date: '업데이트시간',
    new_item_db_id: '획득후 UID',
    status: '상태',
    in_type: '수령함 유입경로',
    setnormal: '복구',
    setenddate : '만료복구',
    remove: '삭제',
    commission: '수수료'
  }

  DESC.TradeLogType = {
    outbox: {1: '구매', 2: '회수', 3: '판매', 4: '운영자 회수', 5: '운영자 복구'},
    auction: {2: '회수', 3: '구매(판매)완료', 4: '운영자 회수'}
  }

  DESC.infoTribeGender2 = {male: DESC.infoTribeGender.M, female: DESC.infoTribeGender.F};
  DESC.infoTribeType = DESC.raceTypeHud;
  DESC.infoClassType = DESC.classTypeHud;
  DESC.infoClassType2 = {
    guardian: DESC.infoClassType[0],
    berserker: DESC.infoClassType[1],
    ranger: DESC.infoClassType[3],
    assasin: DESC.infoClassType[8],
    mage: DESC.infoClassType[4],
    paladin: DESC.infoClassType[6]
  };
  DESC.infoClassType3 = {
    guardian: DESC.infoClassType[0],
    berserker: DESC.infoClassType[1],
    ranger: DESC.infoClassType[3],
    assasin: DESC.infoClassType[8],
    mage: DESC.infoClassType[4],
    paladin: DESC.infoClassType[6]
  };
  /**
   * AMD(Asynchronous Module Definition)
   */
  define([/*Require*/], DESC);

})(jQuery, this, this.document);
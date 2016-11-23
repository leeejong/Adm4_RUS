<?php

/**
 * BsqCatalogManager Class
 * @author jj2lover@neowiz.com 2015.04.02
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessCatalogManagerRU {

  use ClientTable;
  function __construct($arg1 = null, $arg2 = null) {

  }

  function doSync(array $arrTbl, array $arrCF)
  {
    $data = array();
    $db = new DB('bless_middle');

    foreach ($arrTbl as $table)
    {
      $data[$table] = $db->prepare(sprintf('SELECT * FROM %s', $table))->get();
    }

    if( Util::is_dev() ) // 개발환경인 경우 실환경으로
      $ajax_gateway = 'http://adm.nwz.kr/ajax_gateway.php';
    else // 실환경인 경우 개발환경으로
      $ajax_gateway = 'http://adm.dev.nwz.kr/ajax_gateway.php';

    //$ajax_gateway = 'http://adm.dev.nwz.kr/~jj2lover/adm4/ajax_gateway.php';

    $oClass = new EnvRemoteProcessCall();
    $result = $oClass->execSync( $data );
    //$result = $this->execSync( $data );

    return $msg.$result;

  }

  function execSync(array $data)
  {

    debug ($data);

    $arr_unique_keys = array(
      'BL_BT_MALL_ITEM' => array('cash_item_id'),
      'BL_BT_MALL_IOS_PRICEINFO' => array('cash_item_id'),
      'BL_BT_MALL_ITEM_PACKAGE' => array('cash_item_id', 'ref_type', 'ref_item_id'),
      'BL_BT_MALL_CATEGORY_INFO' => array('cat_id'),
      'BL_BT_MALL_CATEGORY_MAP' => array('cat_id', 'cash_item_id'),
      'BL_BT_MALL_DSC_INFO' => array('dsc_id'),
      'BL_BT_MALL_DSC_ITEM' => array('dsc_id', 'cash_item_id'),
      'BL_BT_GRADE' => array('grade'),
      'BL_BT_VIP' => array('level'),
    );

    $db = new DB('bless_middle');

    foreach( $data as $table => $rows ){

      $pk = $arr_unique_keys[$table];
      //$pk = (array)$db->getTableMetaData($table)['unique_columns'];

      $result .= "[".date("Y-m-d H:i:s")."] ".$table." 테이블 동기화 진행\n";
      if( !count($pk) ) error('Table PK 확인 불가 - '.$table);

      /**
       * PK를 기준으로 동기화 한다.
       */
      foreach( (array)$rows as $row ){

        $query_on = array();
        $query_up = array();
        $query_in = array();
        $query_vl = array();

        foreach( $pk as $column )
          $query_on[] = sprintf('A.%s = :o_%s', $column, $column);

        foreach( $row as $column => $value ){

          // ON DUAL 조건 컬럼은 UPDATE 불가능
          if( !in_array($column, $pk) )
            $query_up[] = sprintf('%s = :u_%s', $column, $column);

          $query_in[] = sprintf('%s', $column);
          $query_vl[] = sprintf(':i_%s', $column);

        }

        $query_on = join(' AND ', $query_on);
        $query_up = join(', ', $query_up);
        $query_in = join(', ', $query_in);
        $query_vl = join(', ', $query_vl);

        $db->prepare($q='
          MERGE INTO '.$table.' A USING (SELECT \'X\' as dual) B ON ( '.$query_on.' )
            WHEN MATCHED THEN
              UPDATE SET '.$query_up.'
            WHEN NOT MATCHED THEN
              INSERT ( '.$query_in.' )
              VALUES ( '.$query_vl.' );
        ');

        foreach( $pk as $column )
          $db->bindParam(':o_'.$column, $row[$column]);

        foreach( $row as $column => $value ){

          // ON DUAL 조건 컬럼은 UPDATE 불가능
          if( !in_array($column, $pk) )
            $db->bindParam(':u_'.$column, $value);

          $db->bindParam(':i_'.$column, $value);

        }
        $db->set();
      }

      $result .= "[".date("Y-m-d H:i:s")."] ".$table." 테이블 동기화 완료\n";

    }

    Pmang::regenCF2('bsq_item_mapping');
    return $result;
  }


  function getDscItemList($dsc_id)
  {
      $db = new DB('bless_middle');

      $r = $db->prepare('select * from dbo.BL_BT_MALL_DSC_ITEM LEFT JOIN dbo.BL_BT_MALL_ITEM ON dbo.BL_BT_MALL_DSC_ITEM.CASH_ITEM_ID = dbo.BL_BT_MALL_ITEM.CASH_ITEM_ID  where dbo.BL_BT_MALL_DSC_ITEM.dsc_id = :dsc_id')
           ->bindParam('dsc_id', $dsc_id)
           ->get();

      return $r;
  }

  function getDscList()
  {
      $db = new DB('bless_middle');
      $dsc_list = array();

      $r = $db->prepare('select * from dbo.BL_BT_MALL_DSC_INFO')->get();

      if (sizeof($r) > 0 )
      {
        $i=0;
        foreach ($r as $k=>$v)
        {
          if (date("YmdHis") < $v['start_date']) $status = "대기중";
          else if (date("YmdHis") > $v['end_date']) $status = "종료";
          else if (date("YmdHis") >= $v['start_date'] && date("YmdHis") <= $v['end_date'])
          {
            if ($v['is_open'] == 'Y') $status = "진행중";
            else $status = "임시대기";
          }

          $dsc_list[$i] = $v;
          $dsc_list[$i]['status'] = $status;
          $i++;
        }
      }
      return $dsc_list;
  }

  function addDscInfo(array $dsc_info)
  {
      $db = new DB('bless_middle');
      if ($dsc_info['dsc_id'] > 0 ) {

        return $db->prepare('update dbo.BL_BT_MALL_DSC_INFO set title = :title, start_date = :start_date, end_date = :end_date, banner_url =:banner_url, dsc_desc = :dsc_desc, bonus_item_id=:bonus_item_id, bonus_restrict_cnt=:bonus_restrict_cnt, is_open=:is_open where dsc_id = :dsc_id')
          ->bindParam('dsc_id', $dsc_info['dsc_id'])
          ->bindParam('title', $dsc_info['title'])
          ->bindParam('start_date', $dsc_info['start_date'])
          ->bindParam('end_date', $dsc_info['end_date'])
          ->bindParam('banner_url', $dsc_info['banner_url'])
          ->bindParam('dsc_desc', $dsc_info['dsc_desc'])
          ->bindParam('bonus_item_id', $dsc_info['bonus_item_id'])
          ->bindParam('bonus_restrict_cnt', $dsc_info['bonus_restrict_cnt'])
          ->bindParam('is_open', $dsc_info['is_open'])

           ->set();

      }else{

        $i = 1;
        $r = $db->prepare('select max(dsc_id) n_dsc_id from dbo.BL_BT_MALL_DSC_INFO')
           ->get();
        $n_dsc_id = $r[0]['n_dsc_id']>0?$r[0]['n_dsc_id']+1:1;
        $db->prepare('Insert into dbo.BL_BT_MALL_DSC_INFO (dsc_id, title, start_date, end_date, banner_url, dsc_desc, bonus_item_id, bonus_restrict_cnt, is_open) values(:dsc_id, :title, :start_date, :end_date, :banner_url, :dsc_desc, :bonus_item_id, :bonus_restrict_cnt, :is_open)')
          ->bindParam('dsc_id', $n_dsc_id)
          ->bindParam('title', $dsc_info['title'])
          ->bindParam('start_date', $dsc_info['start_date'])
          ->bindParam('end_date', $dsc_info['end_date'])
          ->bindParam('banner_url', $dsc_info['banner_url'])
          ->bindParam('dsc_desc', $dsc_info['dsc_desc'])
          ->bindParam('bonus_item_id', $dsc_info['bonus_item_id'])
          ->bindParam('bonus_restrict_cnt', $dsc_info['bonus_restrict_cnt'])
          ->bindParam('is_open', $dsc_info['is_open'])
           ->set();

        return $n_dsc_id;
      }
  }

  function updateDscItem($dsc_id, $cash_item_id, $tot_cnt, $cur_cnt, $restrict_cnt)
  {

    $db = new DB('bless_middle');
    return $db->prepare('update dbo.BL_BT_MALL_DSC_ITEM set tot_cnt =:tot_cnt, cur_cnt = :cur_cnt, restrict_cnt = :restrict_cnt where dsc_id = :dsc_id and cash_item_id = :cash_item_id')
          ->bindParam('tot_cnt', $tot_cnt)
          ->bindParam('cur_cnt', $cur_cnt)
          ->bindParam('restrict_cnt', $restrict_cnt)
          ->bindParam('dsc_id', $dsc_id)
          ->bindParam('cash_item_id', $cash_item_id)
           ->set();
  }

  function delDscItem($dsc_id , $cash_item_id)
  {
    $db = new DB('bless_middle');
    return $db->prepare('delete from dbo.BL_BT_MALL_DSC_ITEM where dsc_id = :dsc_id and cash_item_id = :cash_item_id')
          ->bindParam('dsc_id', $dsc_id)
          ->bindParam('cash_item_id', $cash_item_id)
           ->set();
  }

  function addDscItem($dsc_id, $cash_item_id, $tot_cnt, $cur_cnt, $coupon_id, $price, $dist_price, $restrict_cnt, $discount_info)
  {
    $db = new DB('bless_middle');
    $db->prepare('insert into dbo.BL_BT_MALL_DSC_ITEM(dsc_id, cash_item_id,  price, dist_price, tot_cnt, cur_cnt, coupon_id, restrict_cnt, discount_info) values(:dsc_id, :cash_item_id, :price, :dist_price, :tot_cnt, :cur_cnt, :coupon_id, :restrict_cnt, :discount_info)')
          ->bindParam('dsc_id', $dsc_id)
          ->bindParam('cash_item_id', $cash_item_id)
          ->bindParam('price', $price)
          ->bindParam('dist_price', $dist_price)
          ->bindParam('tot_cnt', $tot_cnt)
          ->bindParam('cur_cnt', $cur_cnt)
          ->bindParam('coupon_id', $coupon_id)
          ->bindParam('restrict_cnt', $restrict_cnt)
          ->bindParam('discount_info', $discount_info)
           ->set();

    return true;
  }

  function getCashItemMappingInfo($cash_item_id, $item_type, $ref_item_id=null){

    switch ($item_type)
    {
      case "PK":
      case "VP":
        $list_game = DB::instance('bless_middle')->prepare('SELECT \'게임아이템\' item_type, ITEM.name item_name,  PACKAGE.ref_item_id item_id, PACKAGE.item_cnt
  FROM dbo.BL_BT_MALL_ITEM_PACKAGE PACKAGE LEFT JOIN dbo.BL_BT_GAME_ITEM ITEM
  ON PACKAGE.REF_ITEM_ID = ITEM.ITEM_ID
  WHERE PACKAGE.CASH_ITEM_ID = :cash_item_id and PACKAGE.REF_TYPE = :ref_type')
              ->bindParam('cash_item_id', $cash_item_id)
              ->bindParam('ref_type', 'G')
              ->get();
        $list_cash = DB::instance('bless_middle')->prepare('SELECT \'유료상품\' item_type, ITEM.item_name item_name, PACKAGE.ref_item_id item_id, PACKAGE.item_cnt
  FROM dbo.BL_BT_MALL_ITEM_PACKAGE PACKAGE LEFT JOIN dbo.BL_BT_MALL_ITEM ITEM
  ON PACKAGE.REF_ITEM_ID = ITEM.CASH_ITEM_ID
  WHERE PACKAGE.CASH_ITEM_ID = :cash_item_id2 and PACKAGE.REF_TYPE = :ref_type2')
              ->bindParam('cash_item_id2', $cash_item_id)
              ->bindParam('ref_type2', 'C')
              ->get();

        return array_merge($list_game, $list_cash);
        break;

      case "IT":
        return DB::instance('bless_middle')->prepare('SELECT \'게임아이템\' item_type, GAME_ITEM.name item_name,  ITEM.ref_item_id item_id, ITEM.item_cnt
  FROM dbo.BL_BT_MALL_ITEM ITEM LEFT JOIN dbo.BL_BT_GAME_ITEM GAME_ITEM
  ON ITEM.REF_ITEM_ID = GAME_ITEM.ITEM_ID
  WHERE ITEM.CASH_ITEM_ID = :cash_item_id')
              ->bindParam('cash_item_id', intval($cash_item_id))
              ->get();

        break;
    }
  }

  function getCashItemListAll(){
    $r = DB::instance('bless_middle')->prepare('SELECT * FROM dbo.BL_BT_MALL_ITEM')
          ->get();
    return $r;
  }

  function getCashItemInfo($cash_item_id){
    $r = DB::instance('bless_middle')->prepare('SELECT * FROM dbo.BL_BT_MALL_ITEM A LEFT JOIN dbo.BL_BT_MALL_IOS_PRICEINFO B on A.cash_item_id  = B.cash_item_id  where A.cash_item_id = :cash_item_id')
          ->bindParam('cash_item_id', $cash_item_id)
          ->get();

    $r[0]['ItemList'] = $this->getCashItemMappingInfo($cash_item_id, $r[0]['item_type'], $r[0]['ref_item_id']);

    return $r;
  }


  function delCashItemMappingInfo($cat_id, $cash_item_id)
  {
    $ret = DB::instance('bless_middle')->prepare('delete from dbo.BL_BT_MALL_CATEGORY_MAP where cat_id = :cat_id and cash_item_id = :cash_item_id')
      ->bindParam('cat_id', $cat_id)
      ->bindParam('cash_item_id', $cash_item_id)
      ->set();

    return true;
  }

  function updateCashItemMappingInfo($cat_id, $cash_item_id, $priority, $display_yn, $icon)
  {
    //$icon = implode(",", $arr_icon);

    $ret = DB::instance('bless_middle')->prepare('update dbo.BL_BT_MALL_CATEGORY_MAP set priority = :priority, display_yn = :display_yn, icon = :icon where cat_id = :cat_id and cash_item_id = :cash_item_id')
      ->bindParam('cat_id', $cat_id)
      ->bindParam('cash_item_id', $cash_item_id)
      ->bindParam('priority', $priority)
      ->bindParam('display_yn', $display_yn)
      ->bindParam('icon', $icon)
      ->set();

    return true;
  }


  function regCashItemMappingInfo($cat_id, $cash_item_id)
  {
    $r = DB::instance('bless_middle')->prepare('select max(priority) n_priority from dbo.BL_BT_MALL_CATEGORY_MAP where cat_id = :cat_id')
       ->bindParam('cat_id', $cat_id)
       ->get();
    $n_priority = $r[0]['n_priority']>0?$r[0]['n_priority']+10:10;

    $ret = DB::instance('bless_middle')->prepare('insert into dbo.BL_BT_MALL_CATEGORY_MAP (cat_id, cash_item_id, priority, display_yn, icon) values(:cat_id, :cash_item_id, :priority, :display_yn, :icon)')
      ->bindParam('cat_id', $cat_id)
      ->bindParam('cash_item_id', $cash_item_id)
      ->bindParam('priority', $n_priority)
      ->bindParam('display_yn', 'N')
      ->bindParam('icon', '')
      ->set();

    return true;
  }

  function getCashItemMappingList($cat_id){

    $r = DB::instance('bless_middle')->prepare('SELECT * FROM dbo.BL_BT_MALL_CATEGORY_MAP LEFT JOIN dbo.BL_BT_MALL_ITEM on dbo.BL_BT_MALL_ITEM.cash_item_id = dbo.BL_BT_MALL_CATEGORY_MAP.cash_item_id where dbo.BL_BT_MALL_CATEGORY_MAP.cat_id = :cat_id')
          ->bindParam('cat_id', $cat_id)
          ->get();

    return $r;
  }


  function getCashItemList(){
    $r = DB::instance('bless_middle')->prepare('SELECT * FROM dbo.BL_BT_MALL_ITEM')
          ->get();
    return $r;
  }

  function getGameItemList(){

    return Cache::useFileCache('BL_getItemList', 3600, function(){

      $r = DB::instance('bless_middle')->prepare('SELECT * FROM dbo.BL_BT_GAME_ITEM')
              ->get();
      return $r;
    });

  }

  function getVipInfoList(){

    return Cache::useFileCache('BL_getVipInfoList', 3600, function(){

      $r = DB::instance('bless_middle')->prepare('SELECT * FROM dbo.BL_BT_VIP')
              ->get();
      return $r;
    });

  }

  function updateCashItem($cash_item_id, $cash_item_code, $name, $price, $description, $description_app, $description_wic, $short_description, $description_buy, $sale_place, $sale_yn, $lumena, $dup_yn, $ios_id, $android_id, $ios_price, $ios_sale_price)
  {

    $ret = DB::instance('bless_middle')->prepare('update  dbo.BL_BT_MALL_ITEM set cash_item_code = :cash_item_code, item_name = :item_name, price = :price, description = :description, app_description = :app_description, wic_description = :wic_description, short_description = :short_description, buy_description = :buy_description, sale_place = :sale_place, sale_yn = :sale_yn, lumena = :lumena, dup_yn =:dup_yn, ios_id =:ios_id, android_id =:android_id where cash_item_id = :cash_item_id')
      ->bindParam('cash_item_code', $cash_item_code)
      ->bindParam('item_name', $name)
      ->bindParam('price', $price)
      ->bindParam('description', $description)
      ->bindParam('short_description', $short_description)
      ->bindParam('sale_place', $sale_place)
      ->bindParam('sale_yn', $sale_yn)
      ->bindParam('lumena', $lumena)
      ->bindParam('cash_item_id', $cash_item_id)
      ->bindParam('dup_yn', $dup_yn)
      ->bindParam('ios_id', $ios_id)
      ->bindParam('android_id', $android_id)
      ->bindParam('app_description', $description_app)
      ->bindParam('wic_description', $description_wic)
      ->bindParam('buy_description', $description_buy)
      ->set();

    $ret = DB::instance('bless_middle')->prepare('MERGE INTO BL_BT_MALL_IOS_PRICEINFO A USING (SELECT \'X\' as dual) B ON ( cash_item_id = :cash_item_id )
            WHEN MATCHED THEN
              UPDATE SET IOS_PRICE = :ios_price, IOS_SALE_PRICE = :ios_sale_price
            WHEN NOT MATCHED THEN
              INSERT ( cash_item_id, ios_price, ios_sale_price )
              VALUES ( :i_cash_item_id, :i_ios_price, :i_ios_sale_price);')
      ->bindParam('cash_item_id', $cash_item_id)
      ->bindParam('ios_price', $ios_price)
      ->bindParam('ios_sale_price', $ios_sale_price)
      ->bindParam('i_cash_item_id', $cash_item_id)
      ->bindParam('i_ios_price', $ios_price)
      ->bindParam('i_ios_sale_price', $ios_sale_price)
      ->set();

    return true;

  }


  function updateCashItemSaleinfo($cash_item_id, $saleinfo_id)
  {

    $ret = DB::instance('bless_middle')->prepare('update  dbo.BL_BT_MALL_ITEM set saleinfo_id = :saleinfo_id where cash_item_id = :cash_item_id')
      ->bindParam('saleinfo_id', $saleinfo_id)
      ->bindParam('cash_item_id', $cash_item_id)
      ->set();

    return true;

  }

    function deleteCashItem($cash_item_id)
  {

    $ret = DB::instance('bless_middle')->prepare('delete from  dbo.BL_BT_MALL_ITEM where cash_item_id = :cash_item_id')
      ->bindParam('cash_item_id', $cash_item_id)
      ->set();

    $ret = DB::instance('bless_middle')->prepare('delete from  dbo.BL_BT_MALL_CATEGORY_MAP where cash_item_id = :cash_item_id')
      ->bindParam('cash_item_id', $cash_item_id)
      ->set();

    $ret = DB::instance('bless_middle')->prepare('delete from  dbo.BL_BT_MALL_DSC_ITEM where cash_item_id = :cash_item_id')
      ->bindParam('cash_item_id', $cash_item_id)
      ->set();

    $ret = DB::instance('bless_middle')->prepare('delete from  dbo.BL_BT_MALL_ITEM_PACKAGE where cash_item_id = :cash_item_id')
      ->bindParam('cash_item_id', $cash_item_id)
      ->set();

    $ret = DB::instance('bless_middle')->prepare('delete from  dbo.BL_BT_MALL_ITEM_PACKAGE where ref_item_id = :cash_item_id and ref_type=:ref_type')
      ->bindParam('cash_item_id', $cash_item_id)
      ->bindParam('ref_type', 'C')
      ->set();

    return true;

  }

  function regCashItem($item_code, $name, $item_type, $vip_level, $period_type,  $period, $price, $desc, $short_desc, $sale_place, $sale_yn, $lumena,  $item_list, $dup_yn) {

    if ($item_type == 'IT') {
      $ref_item_id  = explode("|",$item_list[0])[1];
      $item_cnt = explode("|",$item_list[0])[2];
    }else{
      $ref_item_id = 0;
      $item_cnt= 1;
    }

    $r = DB::instance('bless_middle')->prepare('select max(cash_item_id) n_cash_item_id from dbo.BL_BT_MALL_ITEM')
       ->get();
    $n_cash_item_id = $r[0]['n_cash_item_id']>0?$r[0]['n_cash_item_id']+1:1001;
    if ($item_code == 0 ) $item_code = $n_cash_item_id;
    if ($item_type != 'VP') $vip_level = 0;

    $ret = DB::instance('bless_middle')->prepare('insert into dbo.BL_BT_MALL_ITEM (cash_item_id, cash_item_code, item_name, item_type, vip_level, price, period_type, period, description, short_description, sale_place, sale_yn, lumena, ref_item_id, dup_yn, item_cnt) values(:cash_item_id, :cash_item_code, :item_name, :item_type, :vip_level, :price, :period_type, :period, :description, :short_description, :sale_place, :sale_yn, :lumena, :ref_item_id, :dup_yn, :item_cnt)')
      ->bindParam('cash_item_id', $n_cash_item_id)
      ->bindParam('cash_item_code', $item_code)
      ->bindParam('item_name', $name)
      ->bindParam('item_type', $item_type)
      ->bindParam('vip_level', $vip_level)
      ->bindParam('price', $price)
      ->bindParam('period_type', $period_type)
      ->bindParam('period', $period)
      ->bindParam('description', $desc)
      ->bindParam('short_description', $short_desc)
      ->bindParam('sale_place', $sale_place)
      ->bindParam('sale_yn', $sale_yn)
      ->bindParam('lumena', $lumena)
      ->bindParam('ref_item_id', $ref_item_id)
      ->bindParam('dup_yn', $dup_yn)
      ->bindParam('item_cnt', $item_cnt)
      ->set();

    if ($ret && ($item_type == 'PK'))
    {
      foreach ($item_list as $k=>$v)
      {
        $arrMapinfo = explode("|", $v);

        DB::instance('bless_middle')->prepare('insert into dbo.BL_BT_MALL_ITEM_PACKAGE (cash_item_id, ref_type, ref_item_id, item_cnt) values (:cash_item_id, :ref_type, :ref_item_id, :item_cnt)')
            ->bindParam('cash_item_id', $n_cash_item_id)
            ->bindParam('ref_type', $arrMapinfo[0])
            ->bindParam('ref_item_id', $arrMapinfo[1])
            ->bindParam('item_cnt', $arrMapinfo[2])
            ->set();
      }
    }

    return true;
  }


  function getCategoryList($depth, $cat_id=0)
  {
    if ($cat_id > 0 ) {

      $r = DB::instance('bless_middle')->prepare('SELECT A.* , (SELECT COUNT(*) FROM dbo.BL_BT_MALL_CATEGORY_MAP WHERE CAT_ID = A.CAT_ID) ITEM_CNT FROM dbo.BL_BT_MALL_CATEGORY_INFO A where A.parent_id = :cat_id')
            ->bindParam('cat_id', $cat_id)
            ->get();

    }else{

      if ($depth == 0 ) $depth = 1;
      $r = DB::instance('bless_middle')->prepare('SELECT A.*, (SELECT COUNT(*) FROM dbo.BL_BT_MALL_CATEGORY_INFO WHERE PARENT_ID = A.CAT_ID) SUB_CNT, (SELECT COUNT(*) FROM dbo.BL_BT_MALL_CATEGORY_MAP WHERE CAT_ID = A.CAT_ID) ITEM_CNT FROM dbo.BL_BT_MALL_CATEGORY_INFO A where depth = :depth')
            ->bindParam('depth', $depth)
            ->get();
    }
    return $r;

  }


  function getCategoryInfo($cat_id)
  {
    $r = DB::instance('bless_middle')->prepare('SELECT * FROM dbo.BL_BT_MALL_CATEGORY_INFO where cat_id = :cat_id')
          ->bindParam('cat_id', $cat_id)
          ->get();
    return $r;

  }

  function delCategoryInfo($cat_id)
  {
    $db = DB::instance('bless_middle');

    $r = $db->prepare('SELECT count(*) cnt FROM dbo.BL_BT_MALL_CATEGORY_INFO where parent_id = :cat_id')
          ->bindParam('cat_id', $cat_id)
          ->get();

    if ($r[0]['cnt'] > 0) return error('하위 카테고리를 먼저 삭제해주세요.');

    $r = $db->prepare('SELECT count(*) cnt FROM dbo.BL_BT_MALL_CATEGORY_MAP where cat_id = :cat_id')
          ->bindParam('cat_id', $cat_id)
          ->get();

    if ($r[0][''] > 0) return error('선택한 카테고리에 등록된 상품을 먼저 삭제해주세요.');

    $db->prepare('DELETE BL_BT_MALL_CATEGORY_INFO where cat_id = :cat_id')
          ->bindParam('cat_id', $cat_id)
          ->set();

    return true;
  }


  function regCategory($cat_id, $cat_name, $parent_id, $depth, $desc, $images, $type, $order_type, $is_open='Y', $display_order=0) {

    $db = DB::instance('bless_middle');

    if ($cat_id > 0 )
    {

      $ret = $db->prepare('update dbo.BL_BT_MALL_CATEGORY_INFO set cat_name = :cat_name, parent_id = :parent_id, depth = :depth, cat_desc = :cat_desc, cat_images = :cat_images, cat_type = :cat_type, order_type = :order_type where cat_id = :cat_id')
        ->bindParam('cat_id', $cat_id)
        ->bindParam('cat_name', $cat_name)
        ->bindParam('parent_id', $parent_id)
        ->bindParam('depth', $depth)
        ->bindParam('cat_desc', $desc)
        ->bindParam('cat_images', $images)
        ->bindParam('cat_type', $type)
        ->bindParam('order_type', $order_type)
        ->set();

    }else{

      $r = $db->prepare('select max(cat_id) n_cat_id from dbo.BL_BT_MALL_CATEGORY_INFO')
         ->get();
      $n_cat_id = $r[0]['n_cat_id']>0?$r[0]['n_cat_id']+1:1001;

      $r = $db->prepare('select max(display_order) n_display_order from dbo.BL_BT_MALL_CATEGORY_INFO where depth = :depth')
         ->bindParam('depth', $depth)
          ->get();
      $n_display_order = $r[0]['n_display_order']>0?$r[0]['n_display_order']+10:100;

      $ret = $db->prepare('insert into dbo.BL_BT_MALL_CATEGORY_INFO (cat_id, cat_code, cat_name, parent_id, depth, cat_desc, cat_images, cat_type, order_type, is_open, display_order) values(:cat_id, :cat_code, :cat_name, :parent_id, :depth, :cat_desc, :cat_images, :cat_type, :order_type, :is_open, :display_order)')
        ->bindParam('cat_id', $n_cat_id)
        ->bindParam('cat_code', 'MALL')
        ->bindParam('cat_name', $cat_name)
        ->bindParam('parent_id', $parent_id)
        ->bindParam('depth', intval($depth)+1)
        ->bindParam('cat_desc', $desc)
        ->bindParam('cat_images', $images)
        ->bindParam('cat_type', $type)
        ->bindParam('order_type', $order_type)
        ->bindParam('is_open', $is_open)
        ->bindParam('display_order', $display_order)
        ->set();

    }

    return true;

  }


}

?>
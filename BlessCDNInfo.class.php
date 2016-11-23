<?php

/**
 * BlessCDNInfo Class
 * @author jj2lover@neowiz.com 2016.01.15
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessCDNInfo {
  use ClientTable;
  function __construct($arg1 = null, $arg2 = null) {

  }

  function getCDNInfo() {

      $prev_date = date("Y-m-d H:i:s",strtotime("-7 days"));

      $r['cdn_list']  = DB::instance('qt_wlog')->prepare('SELECT distinct(cdn_id) cdn_id from qt_lt_cdn_speed where reg_date >= :prev_date')->bindParam('prev_date', $prev_date)->get();
      $r['cdn_cnt']   = DB::instance('qt_wlog')->prepare('SELECT left(reg_date,10) reg_date, cdn_id, count(*) cnt  FROM qt_lt_cdn_speed where reg_date >= :prev_date group by left(reg_date,10), cdn_id')->bindParam('prev_date', $prev_date)->get();
      $r['cdn_speed'] = DB::instance('qt_wlog')->prepare('SELECT left(reg_date,10) reg_date, cdn_id, sum(speed) speed, count(*) cnt FROM qt_lt_cdn_speed where speed > 10 and reg_date >= :prev_date group by left(reg_date,10), cdn_id')->bindParam('prev_date', $prev_date)->get();

      return $r;
  }

  function getCDNDownCnt() {
      return DB::instance('qt_wlog')->prepare('SELECT left(reg_date,10) reg_date, cdn_id, count(*) cnt  FROM qt_lt_cdn_speed group by left(reg_date,10), cdn_id')->get();
  }

  function getCDNDDownSpeed() {
      return DB::instance('qt_wlog')->prepare('SELECT left(reg_date,10) reg_date, cdn_id, sum(speed) speed, count(*) cnt FROM qt_lt_cdn_speed where speed > 10 group by left(reg_date,10), cdn_id')->get();
  }

}

?>
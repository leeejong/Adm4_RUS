<?php

/**
 * BlessGuide Class
 * @author bitofsky@neowiz.com 2014.06.24
 * @package
 * @subpackage
 * @encoding UTF-8
 */
class BlessGuide {

  private $ssn = 347;

  private $categoryGuideType = 1;

  private $db;

  private $guide;

  function __construct($arg1 = null, $arg2 = null) {

    $this->db    = DB::instance('saypub');
    $this->guide = Guide::instance();
    $this->guide->setActionLog( false );

  }

  /**
   * 가이드 분류별 검색엔진 반영 및 캐시갱신 일괄처리
   * @param int $guide_type
   * @return bool
   */
  function refreshGuide( int $guide_type ){

    // 1. 검색엔진 Commit
    $this->guide->commitSearchEngine( $this->ssn );

    // 2. 세션DB 모두 삭제
    $this->guide->refreshGuideTypeCache( $this->ssn, $guide_type );

    return true;

  }

  function deleteGuideTypeSearchEngine( int $guide_type ){
    $this->guide->deleteGuideTypeSearchEngine( $this->ssn, $guide_type );
  }

  function syncGuide( array $guide ){

    if( !$id = $guide[1] )
      error('Error. Please input ID.');

    $guide_type   = $guide['guide_type'];
    $category     = $guide['category'];
    $category_sub = $guide['category_sub'];
    $top_cat_srl  = $this->getTopCategory(); // 최상위 카테고리

    // 최상위 카테고리
    $top_cat_srl = $this->getTopCategory();

    // 분류 카테고리
    $type_cat_srl = $this->getCategory($category, $top_cat_srl);

    // 서브 카테고리
    if( $category_sub )
      $sub_cat_srl = $this->getCategory($category_sub, $type_cat_srl);

    $parent_srl = $sub_cat_srl ?: $type_cat_srl;

    // 현재 게임정보 ID로 등록된 가이드가 존재하는지 확인
    if( !$guide['guide_srl'] = $this->db->prepare('SELECT guide_srl FROM pub_guide_type_entity WHERE ssn = :ssn AND guide_type = :guide_type AND property_id = :pid AND value = :data_srl')
      ->bindParam('ssn', $this->ssn)
      ->bindParam('guide_type', $guide_type)
      ->bindParam('pid', 1)
      ->bindParam('data_srl', $id)
      ->getTop()['guide_srl']
    )
      $guide['guide_srl'] = $this->guide->insertGuideProc( $this->ssn, $guide_type, $guide['title'], $parent_srl, true );

    $this->db->beginTransaction();

    // 가이드 속성 갱신
    $this->guide->insertGuideEntityMulti( $this->ssn, $guide_type, $guide['guide_srl'], $guide );

    // 기본 단락
    if( $guide['text'] )
      $this->guide->insertGuideContent($this->ssn, $guide['guide_srl'], 0, 1, '기본 정보', $guide['text'], null, 0);

    // 연관 가이드 - 리스트형
    if( $guide['list'] ){
      $content_no = 90;
      foreach($guide['list'] as $table_no => $table_name)
        $this->guide->insertGuideContent($this->ssn, $guide['guide_srl'], $content_no, 3, $table_name, '', $table_no, $content_no++);
    }

    $this->db->commit();

    $this->guide->updateSearchEngineProc( $this->ssn, $guide['guide_srl'], false );

  }

  /**
   * 최상위 카테고리 guide_srl 조회/생성
   * @param string $title
   * @return int guide_srl
   */
  function getTopCategory( string $title=null ){
    $title = $title ?: '[GameData]';
    return Guide::instance()->getGuideByTitleEqual( $this->ssn, $this->categoryGuideType, $title ) ?:
           Guide::instance()->insertGuideProc( $this->ssn, $this->categoryGuideType, $title, 0 );
  }

  /**
   * 서브 카테고리 조회/생성
   * @param string $title
   * @param int $parent_srl
   * @return int guide_srl
   */
  function getCategory( string $title, int $parent_srl ){
    return Guide::instance()->getGuideByTitleEqual( $this->ssn, $this->categoryGuideType, $title ) ?:
           Guide::instance()->insertGuideProc( $this->ssn, $this->categoryGuideType, $title, $parent_srl );
  }

}

?>
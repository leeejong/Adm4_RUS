<?php
/**
 * 블레스 게임데이터 XML 리더
 * gamesvn을 통해 개발사에서 업데이트하는 최신 데이터를 직접 읽는다.
 * @author 2013.07.17 bitofsky@neowiz.com
 */


header('Content-type: text/xml');

/**
 * CORS Enable :) (Cross Origin Resource Sharing)
 */
header('Access-Control-Allow-Origin: *');

require '../../lib.php';

$filename = $_GET['filename'];

try{

  // 12시간에 한번씩 svn으로부터 캐싱한다. (60*60*12)
  echo Cache::useFileCache( 'Bless.'.$filename, 1, function() use($filename){

    svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_USERNAME, 'gameinfosvn');
    svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_PASSWORD, 'Rpdla!2vh');
    svn_auth_set_parameter(PHP_SVN_AUTH_PARAM_IGNORE_SSL_VERIFY_ERRORS, true);
    svn_auth_set_parameter(SVN_AUTH_PARAM_NON_INTERACTIVE,              true);

    if($filename == 'DestinationPointReference' || $filename == 'DesinationPointReference' ){
      return svn_cat( 'http://n3gamesvn.nwz.kr/svn/bl_kr_neowiz/trunk/server/BLServer/References/'.$filename.'.xml' );
    }
    else{
      return svn_cat( 'http://n3gamesvn.nwz.kr/svn/bl_kr_neowiz/trunk/server/BLServer/Content/ServerData/'.$filename.'.xml' );
    }

  });

}catch(Exception $e){
  header('HTTP/1.0 404 Not Found');
  print_r($e->getMessage());
}

?>
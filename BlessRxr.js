/**
 * BlessRxr
 * ADM 4.0 JavaScript Menu
 * @author gamexg@neowiz.com 2016.08.22
 * @package
 * @subpackage
 * @encoding UTF-8
 */

// http://glat.info/jscheck/
/*global $, jQuery, $adm, $E, confirm, console, alert, JSON, HTMLInputElement define */

// 명료한 Javascript 문법을 사용 한다.
"use strict";

(function($, window, document){

/**
 * AMD(Asynchronous Module Definition)
 */
define(['adm/adm.sendProcess'], function(sendProcess){
	return function BlessRxr( arg1, arg2 ){
		var menu = this;
		menu.append(' * 통치 계약 시즌 관리<br>');
		menu.clientTable(null, {
			connect: {
				menu: menu,
				db: 'bless_middle',
				table: 'dbo.BL_BT_CITADELOWNER_SCHEDULE',
				edit:['*'],						
				delete:true,
				insert:true,
				limit: 1000
			},				
			pagesize:20	
		});
		
		menu.append('<br><br> * 수도 쟁탈전 시즌 관리<br>');
		menu.clientTable(null, {
			connect: {
				menu: menu,
				db: 'bless_middle',
				table: 'dbo.BL_BT_ROGUILD_SCHEDULE',
				edit:['*'],						
				delete:true,
				insert:true,
				limit: 1000
			},				
			pagesize:20	
		});
	};
});

})(jQuery, this, this.document);

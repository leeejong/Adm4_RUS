/**
 * BlessEventAttend
 * ADM 4.0 JavaScript Menu
 * @author gamexg@neowiz.com 2016.02.01
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
define(['beans/Bless/BlessDesc'], function (Desc) {
	return function BlessEventAttend( arg1, arg2 ){
		var menu = this;
		var event_id_list = {
						1:1
		};

		var search_log = function(){
			var event_id = s_event_id.val();
			var usn = t_usn.val();
			if(usn === '') return alert('Please input USN.');

			menu.clientTable(null, {
				connect: {
					menu: menu,
					db: 'bless_middle',
					table: 'dbo.bl_pt_006_02',
					where: [
								{type:'operator', operator:'=', column:'event_id', value:event_id},
								{type:'logic', name:'and'},
								{type:'operator', operator:'=', column:'usn', value:usn},
								],
					limit: 1000
				},
				field : ['event_id', 'usn','login_day','complete_cnt','cur_position','reg_date'],
				head  : Desc.DBEventAttend,
				pagesize:20
			});
		};

		var s_event_id = $E('select').selectOptions(event_id_list);
		var t_usn = $E('text').validate({maxLength: 20});
		var u_search = $E('button').text('Search').button().click(search_log);
		menu.verticalTable([[ s_event_id,t_usn,u_search ]], {head:['event_id','USN','Search']});
	}
});
})(jQuery, this, this.document);

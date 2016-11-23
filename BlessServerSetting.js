/**
 * BlessServer
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2015.09.01
 * @package
 * @subpackage
 * @encoding UTF-8
 */

// http://glat.info/jscheck/
/*global $, jQuery, $adm, $E, confirm, console, alert, JSON, HTMLInputElement define */

// 명료한 Javascript 문법을 사용 한다.
"use strict";

(function ($, window, document) {

  /**
   * AMD(Asynchronous Module Definition)
   */
define(['beans/Bless/BlessDesc'], function (Desc) {

    /**
     * BlessServer Menu
     * @param {mixed} arg1
     * @param {mixed} arg2
     */
    return function BlessServerSetting(arg1, arg2) {

      var menu = this;
      //var adminGmlevel = GameData.getAdminGMLevel(menu);
      var desc = Desc.ServerHistoryType;

      menu.ajax({
        methodcall: ['getCU_setting', 'getServerInfo', 'getAuctionRestrictInfo'],
        success: function (jorbiCU, serverInfo, auctionRestrictInfo) {

          menu.clientTable(serverInfo,{
            title : 'Server Stting',
            field: ['server_id','name','max_cu','open_login','stop_all_trade','stop_auction','stop_mail','stop_personal_trade','stop_warehouse', 'edit' ,'insertAuctionRestrict'],
            head:  Desc.ServerSettingHead,
            cell_modify: ['max_cu','open_login'],
            cell_modify_after: function( bef, aft, c_name, row, table ){
                if( bef === aft ) return;
                modifyInfo(menu , bef, aft, c_name, row);
              },
            translate : desc,
            width: '1000',
            pagesize : 16,
            translate_realtime : {
              'insertAuctionRestrict' : function(v, cname, row){
                return $E('button').button().text('Set').css({'width':'100','height':'30'}).click(function(){
                  menu.ajaxAsync('insertAuctionRestrict', row.server_id)
                  .then(function (r) { alert('Complete.'); });
                });
              },
              'edit' : function(v, cname, row){
                return $E('button').button().text('Modify').css({'width':'100','height':'30'}).click(function(){
                   var sub_regist    = $E('div'),
                        bottom        = $E('div').css({'text-align':'center'}),
                        trade_option   = {1:'Restricted', 0:'Normal'},
                        s_all          = $E('select').selectOptions(trade_option).val(0),
                        s_auction      = $E('select').selectOptions(trade_option).val(0),
                        s_post         = $E('select').selectOptions(trade_option).val(0),
                        s_personal     = $E('select').selectOptions(trade_option).val(0),
                        s_warehouse    = $E('select').selectOptions(trade_option).val(0),
                        t_memo         = $E('textarea').css({width:70,height:40}).css("background","#E1E1E1"),
                        b_close        = $E('button').text('Close').button().click(function(){ sub_regist.dialog('close'); }),
                        b_regist       = $E('button').text('Set').button().click(function(){
                          menu.ajaxAsync('editServerTrade',row.server_id, s_all.val(), s_auction.val(), s_post.val(), s_personal.val(), s_warehouse.val(), t_memo.val() )
                            .then(function(r){
                              alert('Complete.');
                            });
                        });

                    bottom.append(b_regist, b_close);
                    sub_regist.verticalTable([[ s_all, s_auction, s_post, s_personal, s_warehouse, t_memo ]], {head: [ 'All','auction','post','personal','warehouse','Memo' ] });
                    sub_regist.append(bottom)
                      .dialog({title: row.server_id+' Server Restrict Setting'});
                });
              }
            }
          })
          .append($E('button').text('ReloadServer').css({width:1000, height:25}).button().click(function(){menu.ajaxAsync('reloadServer');}));
          menu.clientTable(auctionRestrictInfo, {
            title : 'Setting info',
            field: ['world_id', 'reg_usn', 'reg_date', 'release'],
            head: ['world_id', 'reg_msn', 'reg_date', 'release'],
            column_width : [300,300,200],
            width: '1000',
            translate_realtime: {
              'release': function (v, cname, row) {
                return $E('button').button().text('Free').css({'width': '100', 'height': '30'}).click(function () {
                  menu.ajaxAsync('removeAuctionRestrict', row.world_id)
                    .then(function (r) { alert('Complete'); });
                });
              }
            }

          });

        }
      });

      function modifyInfo( menu, bef, aft, c_name, row){
        var sub_reason      = $E('div'),
            bottom          = $E('div').css({'text-align':'center'}),
            t_modify_reason = $E('text', {size:100}).validate({required: true, maxLength: 5000}),
            b_confirm       = $E('button').text('Confirm').button().click(function(){

              if( !sub_reason.validate() ) return;
              //jorbi Maxcu, serveropen

              menu.ajax({
                arrayArguments : true,
                methodcall: 'modifyServerInfo',
                data : [ row.server_id, c_name, bef, aft, t_modify_reason.val() ],
                success : function(r){
                  if(r==true) sub_reason.dialog('close');
                }
              });
            });

        bottom.append(b_confirm);
        sub_reason
          .verticalTable([[t_modify_reason]], {head: ['Reason']})
          .append(bottom)
          .dialog({title: 'Modify Server State'});

     }





    };

  });

})(jQuery, this, this.document);
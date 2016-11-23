/**
 * BsqCatalogManager
 * ADM 4.0 JavaScript Menu
 * @author jj2lover@neowiz.com 2015.04.02
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
define([/*Require*/], function(){

  /**
   * BsqCatalogManager Menu
   * @param {mixed} arg1
   * @param {mixed} arg2
   */
  return function BlessCatalogManagerRU( arg1, arg2 ){

    var menu = this;

    function set_comma(n){
      return Number( n ).toLocaleString().split(".")[0];
    }

    var dsc_list = [],
        itemreg_list = [],
        info_couponlist = [],
        info_dsclist = [],
        gameitem_list = [];

    if ($adm.getConfig().Server.EnvLocation == 'dev')
    {
      info_couponlist = {
        'NO_DSC'      : {'name' : '[--] 할인없음' , 'type' : 'RT' , 'amount' : '0' },
        '1600005788' : {'name' : '[20%] 할인쿠폰' , 'type' : 'RT' , 'amount' : '20' },
        '1600005792' : {'name' : '[6,000원] 할인쿠폰' , 'type' : 'MT' , 'amount' : '6000' },
        '1600005791' : {'name' : '[28,100원] 할인쿠폰' , 'type' : 'MT' , 'amount' : '28100' },
      };
    }else{
      info_couponlist = {
        'NO_DSC'      : {'name' : '[--] 할인없음' , 'type' : 'RT' , 'amount' : '0' },
        '1600005788' : {'name' : '[20%] 할인쿠폰' , 'type' : 'RT' , 'amount' : '20' },
        '1600005792' : {'name' : '[6,000원] 할인쿠폰' , 'type' : 'MT' , 'amount' : '6000' },
        '1600005791' : {'name' : '[28,100원] 할인쿠폰' , 'type' : 'MT' , 'amount' : '28100' },
      };
    };

    var info_tbl = {
      'BL_BT_MALL_ITEM'           : '상품 정보',
      'BL_BT_MALL_IOS_PRICEINFO'   : '상품 IOS 가격 정보',
      'BL_BT_MALL_ITEM_PACKAGE'   : '상품 패키징 정보',
      'BL_BT_MALL_CATEGORY_INFO'  : '카테고리 정보',
      'BL_BT_MALL_CATEGORY_MAP'   : '카테고리 상품 진열 정보',
      'BL_BT_MALL_DSC_INFO'       : '할인 이벤트 정보',
      'BL_BT_MALL_DSC_ITEM'       : '할인 대상 상품 정보',
      'BL_BT_GRADE'               : '블레서쉽 등급 관리',
      'BL_BT_VIP'                 : 'VIP 혜택 관리',
    };

    var info_cf = {
      'DEV' : '개발환경 CF 생성'
    }

    var info_cat_type = {
      'N' : '일반',
      'D' : '할인'
    };

    var info_guide = {
1 : '<br>▶ Make an item for sale or sending<br><br> <b>- An item for sale</b> : An item to sell in the web store after registering the sales item information(SALEINFO_ID) in the billing system. The selling price is required<br> \n\
<b>- An item for sending </b> : It is given to users as a component of a package item, and selling as single item is impossible. <br><b>- Sales item number</b> : It refers to SALEINFO_ID of the billing system(NBOS).',
     2 : '<br>▶ View the list of items for sale or sending and modify some information. <br><br> <b> Warning!! You cannot change the composition of a sending item once it is registered. If it is yet to be sold, ask the manager to change it. </b><br><br>\n\
<b>- Issue sales item number(SALEINFO_ID) </b> : The process of registering the payment information of an item for sale in the billing system(NBOS). The price of the item should be setup(issuable), and the item information is automatically registered in the billing system as the registered information. After the information is registered, sales item number is updated in game DB.',
     3 : '<br>▶ Constitute the category menu of the web store, and display sales items in the place you want. <br><br><b>- Category menu </b> : Categorize the items of the web store by feature and purpose. Right-click to add/modify/delete the category menu. Setting up to 2 levels of category menu is possible. <br>\n\
<b>- Items registered in category</b> : View the item information registered in the selected category. The higher the exposure order, the higher the place that the item appears. Click [Delete] button to drop an item.<br>\n\
<b>- Total sales item </b> : View the item information which has sales item number. Click [Register an item] to display the items. <br>\n\
<b>- Discount item category</b> : The items displayed in a category are associated with sales event, so the sale of the item ends as the event expires.',
     4 : '<br>▶ Manage sales event(discount, limited sales) <br><br> <b>- Event information </b> : View and modify the details of an event. <br>\n\
<b>- Manage discount items</b>: Register the discount items of the selected event. <br><br>\n\
<b>- The way to register a discount item</b><br>1. Register new event information. You can set the event period and bonus item information. <br>2. Select the sales event you want in the [Manage sales items]. <br>3. Select the items to apply discount in the bottom of the category menu.\n\
<br>4. After viewing the item information, click [Apply discount] button.<br><br>\n\
<b>- Limited sales item </b>: If the number of limited sales items is greater than 0, selling the items is no longer possible after all items are sold during the present event.<br>\n\
<b>- Discount item </b>: If the number of limited sales items is set as 0, discount applies to the items during the present event.'
    }

    var packageInfoHead = {
      'sel' : 'AddList',
      'seq_num' : 'Seq_num',
      'service' : 'service',
      'idx': 'ITEM ID',
      'code_name': 'Code_name',
      'buff_exp': 'EXP',
      'buff_gold' : 'GOLD',
      'booster_start' : 'Startday',
      'booster_end' : 'Expireday'
    }

    var info_cat_id = {
     'PK' : '1000019302', //'[PK] 패키지 상품',
     'IT' : '1000019300', //'[IT] 게임아이템 단품',
     'LM' : '1000019301', //'[LM] 루메나 상품',
     'VP' : '1000019303' //'[VP] VIP 상품',
    };

    var info_sale_cat_id = {
     'PK' : '2000019291', //'[PK] 패키지 상품',
     'IT' : '2000019289', //'[IT] 게임아이템 단품',
     'LM' : '2000019290', //'[LM] 루메나 상품',
     'VP' : '2000019292' //'[VP] VIP 상품',
    };

    var info_restrict_cnt = {
     0 : 'No Limit',
     1 : '1EA',
     2 : '2EA',
     3 : '3EA',
     4 : '4EA',
     5 : '5EA',
     10: '10EA'
    };

    var info_order_type = {
      'LIST' : 'LIST',
      'TOP'  : 'THEME'
    };

    var info_dup_yn = {
      'Y' : 'Available',
      'N' : 'Not Available'
    };

    var info_icon = {
     'N' : 'New(N)',
     'S' : 'Special(S)',
     'L' : 'Limited(L)',
     'H' : 'Hot(H)',
     'D' : 'Discount(D)',
     '' : 'None'
    };

    var info_item_type = {
     'PK' : '[PK] Package',
     //'BT' : '부스터 아이템',
     'IT' : '[IT] Gameitem',
     'LM' : '[LM] Lumena',
     'VP' : '[VP] VIP',
    }

    var info_item_type_give = {
     'BT' : 'Boost item',
     'IT' : 'Gameitem',
    };

    var info_period_type = {
    'D' : 'Day(D)',
    'M' : 'Month(M)',
    'Y' : 'Year(Y)'
    };

    var info_vip_level = {};

    /*
    var info_vip_level = {
    '1' : '퍼플 패키지(1등급)',
    '2' : '블루 패키지(2등급)',
    '3' : '그린 패키지(3등급)'
    };
    */

    menu.ajax({
      //arrayArguments : true,
      async : false,
      methodcall : ['getVipInfoList'],
      data       : [],
      success    : function( result ){
        for( var i in result ){
          info_vip_level[result[i].level] = '(' + result[i].level + ') ' + result[i].vip_name;
        }
      }
    });

    var info_sale_place = {
    'W' : 'for Web',
    'C' : 'for Client',
    'M' : 'for Mobile',
    'A' : 'All',
    };

    var info_sale_yn = {
    'Y' : 'inSale',
    'N' : 'notInSale',
    };

    var info_period = {
      '0' : 'Permanent'
    }

    var info_service = {
    '1' : 'Live',
    '0' : 'End',
    };


    // 여기서부터 메뉴를 구성 하세요.
    var sub_options = $E('div').win({
      title         : 'Menu',
      parent        : menu,
      top           : 0,
      left          : 0,
      width         : 230,
      height        : 300,
      buttonpane    : false,
      close         : false,
      screen_toggle : false,
      minimum       : false,
      status        : false,
      resizable     : false,
      draggable     : false,
      'extends'     : false
    });

    var sub_contents_dual = $E('div').win({
      title         : 'Catalog System',
      parent        : menu,
      top           : 0,
      left          : 240,
      width         : 1350,
      height        : 725,
      buttonpane    : false,
      close         : false
    });

    var sub_contents = $E('div').win({
      title         : 'Catalog System',
      parent        : menu,
      top           : 0,
      left          : 240,
      width         : 1350,
      height        : 725,
      buttonpane    : false,
      close         : false
    });

    var b_menu_1  = $E('button').text('1. Make product').css({'width':210, 'text-align':'left'}).button().click(function(){  goMakeCashItem() }),
        b_menu_2  = $E('button').text('2. Manage Billing Infomation').css({'width':210, 'text-align':'left'}).button().click(function(){ goManageCashItem() }),
        b_menu_3  = $E('button').text('3. Show product').css({'width':210, 'text-align':'left'}).button().click(function(){ goManageCategory()  }),
        b_menu_4  = $E('button').text('4. Manage discount event').css({'width':210, 'text-align':'left'}).button().click(function(){ goManageDscInfo()  }),
        b_menu_5  = $E('button').text('7. Sync process').css({'width':210, 'text-align':'left'}).button().click(function(){ goManageSync()  }),
        b_menu_6  = $E('button').text('5. Manage Blessership level').css({'width':210, 'text-align':'left'}).button().click(function(){ goManageGrade()  }),
        b_menu_7  = $E('button').text('6. Manage VIP effects').css({'width':210, 'text-align':'left'}).button().click(function(){ goManageVip()  });

    sub_options.append(b_menu_1, b_menu_2, b_menu_3, b_menu_4, b_menu_6, b_menu_7, b_menu_5);

    var div_guide = $E('div');
    sub_contents_dual.win('hide');
    sub_contents.win('show');

    //사용법 가이드
    div_guide.verticalTable([[ $E('lable').html(info_guide[1]), $E('lable').html(info_guide[2])]], {head_width : 240, head:
              [ '1.', '2.', '3.', '4.', '5.', '6.', '7.' ] , 'width':1300});
    sub_contents.append(div_guide);

    function _drawWin(title, parent, top, left, width, height)
    {
      return $E('div').win({
            title         : title,
            parent        : parent,
            top           : top,
            left          : left,
            width         : width,
            height        : height,
            buttonpane    : false,
            close         : false,
            screen_toggle : false,
            minimum       : false,
            status        : false,
            resizable     : false,
            draggable     : false,
            'extends'     : false
          })
    }

    function goManageGrade()
    {
      sub_contents.win('remove_child');
      div_guide.empty();
      var sub_seletwin  = _drawWin( 'Manage Blessership level',sub_contents, 0, 10, 1310, 650);

      sub_seletwin.clientTable(null,{
        connect     : {
          menu      : menu,
          db        : 'bless_middle',
          table     : 'dbo.BL_BT_GRADE',
          edit      : ['*'],
          insert    : true,
          'delete'  : true,
          limit     : 1000
        },
        field       : ['grade', 'grade_name', 'str_value', 'end_value', 'cash_item_id', 'bonus_lumena','reg_date'],
        head: {
            'grade' : '블레서쉽등급',
            'grade_name' : '등급명',
            'str_value' : '구매누적금액 (from)',
            'end_value' : '구매누적금액 (to)',
            'cash_item_id' : '보너스 지급 상품',
            'bonus_lumena' : '루메나 추가 지급 퍼센트(%)',
            'reg_date' : '등록일시'
        },
        width       : '95%',
        footer      :false,
        filter_view : true,
        pagesize    : 30,
        sort_field  : 'grade',
      });


    }

    function goManageVip()
    {
      sub_contents.win('remove_child');
      div_guide.empty();
      var sub_seletwin  = _drawWin( 'VIP혜택 관리',sub_contents, 0, 10, 1310, 650);

      sub_seletwin.clientTable(null,{
        connect     : {
          menu      : menu,
          db        : 'bless_middle',
          table     : 'dbo.BL_BT_VIP',
          edit      : ['*'],
          insert    : true,
          'delete'  : true,
          limit     : 1000
        },
        field       : ['level', 'vip_name', 'cash_item_id', 'reg_date'],
        head: {
            'level' : 'VIP레벨',
            'vip_name' : 'VIP레벨명칭',
            'cash_item_id' : '일일 보너스 지급 상품',
            'reg_date' : '등록일시'
        },
        width       : '95%',
        footer      :false,
        filter_view : true,
        pagesize    : 30,
        sort_field  : 'level',
      });


    }

    function goManageSync()
    {

      sub_contents.win('remove_child');
      div_guide.empty();
      var sub_seletsync  = _drawWin( '동기화 관리',sub_contents, 0, 10, 1310, 650);

      sub_contents_dual.win('hide');
      sub_contents.win('show');

      var div_info     = $E('div'),
          d_cf         = $E('div'),
          d_command    = $E('div');
      var t_log        = $E('textarea').css({width:950,height:330}).attr('readonly', true).css("background","#eeeeee");

      var d_command    = $E('div').css({'width':650, 'height':'auto', 'text-align':'left'});
      for ( var tbl in info_tbl )
      {
        d_command.append($E('checkbox').addClass('command_c').attr("checked", false).val(tbl));
        d_command.append($E('lable').text(info_tbl[tbl] + ' (' + tbl + ')'), '<br/>' );
      }

      var d_cf    = $E('div').css({'width':650, 'height':'auto', 'text-align':'left'});
      var b_sync   = $E('button').text('동기화 실행').button({icons:{primary:'ui-icon-refresh'}}).css({width:150,height:35}).click(function(){

       if ($adm.getConfig().Server.EnvLocation == 'dev'){
          if (!confirm("동기화(개발 -> 실)를 실행 하시겠습니까?")) return;
        }else{
          if (!confirm("동기화(실 -> 개발)를 실행 하시겠습니까?")) return;
        }

        var command_value = $('input:checkbox:checked.command_c').map(function () {
          return this.value;
        }).get();

        var cf_value = $('input:checkbox:checked.cf_c').map(function () {
          return this.value;
        }).get();

        menu.ajax({
          arrayArguments : true,
          methodcall : ['doSync'],
          data       : [ command_value, cf_value ],
          success    : function( result ){
            t_log.val(result);
          }
        });

      });

      d_cf.append(b_sync);

      for ( var cf in info_cf )
      {
        d_cf.append($E('checkbox').addClass('cf_c').attr("checked", false).val(cf));
        d_cf.append($E('lable').text(info_cf[cf]), '<br/>' );
      }


      div_info.verticalTable([[ d_command, t_log, d_cf.append(b_sync)]], {head: ['동기화 대상 테이블', '작업 로그', '-']}).appendTo(div_info);
      sub_seletsync.append(div_info);
    }


    function goManageDscInfo()
    {

      sub_contents.win('remove_child');
      div_guide.empty();
      var sub_selectevent  = _drawWin( '할인 이벤트 관리',sub_contents, 0, 10, 1310, 650);
      var sub_selectitem   = _drawWin( '할인 상품 관리',sub_contents_dual, 0, 10, 1310, 650);

      sub_contents_dual.win('hide');
      sub_contents.win('show');


      function getDscItem(dsc_id)
      {
        sub_contents_dual.win('show');
        sub_contents.win('hide');

        sub_contents_dual.win('remove_child');
        var sub_selecteventlist  = _drawWin( '할인이벤트 회차', sub_contents_dual, 0, 10, 460, 320);
        var sub_selectinfo       = _drawWin( '할인이벤트 상품', sub_contents_dual, 0, 475, 855, 320);
        var sub_selectcategory   = _drawWin( '카테고리 메뉴', sub_contents_dual, 330, 10, 460, 340);
        var sub_selectall        = _drawWin( '카테고리 등록 상품', sub_contents_dual, 330, 475, 855, 340);

        var info;
        for (var i = 0;i<dsc_list.length;i++)
        {
          if (dsc_list[i].dsc_id == dsc_id)
          {
            info = dsc_list[i];
            break;
          }
        };

        if (dsc_id == 0 ) info = {'dsc_id':0, 'start_date':'', 'end_date':''};

        if( sub_selecteventlist != null ) sub_selecteventlist.empty();
        var div_info = $E('div'),
            div_bottom = $E('div').css({'text-align':'center'});

        var t_start_date    = $E('text').val( $adm.getDate('Y-m-d H:i:s',info.start_date)).attr('readonly', true),
            t_end_date      = $E('text').val( $adm.getDate('Y-m-d H:i:s',info.end_date)).attr('readonly', true),
            l_title         = $E('lable').text(info.title).css({'width':350}),
            l_banner_url    = $E('lable').text(info.banner_url),
            l_is_open       = $E('lable').text(info.is_open),
            l_status        = $E('lable').text(info.status),
            l_bonus_item_id = $E('lable').text(info.bonus_item_id),
            s_dsc_id        = $E('select').css({'width':150}).selectOptions( info_dsclist, {sort:'value'} ).change(function() {

            dsc_id = this.value;
            if (dsc_id > 0) {

              for (var i = 0;i<dsc_list.length;i++)
              {
                if (dsc_list[i].dsc_id == this.value)
                {
                  t_start_date.val( $adm.getDate('Y-m-d H:i:s', dsc_list[i].start_date) );
                  t_end_date.val( $adm.getDate('Y-m-d H:i:s', dsc_list[i].end_date));
                  l_title.text(dsc_list[i].title);
                  l_banner_url.text(dsc_list[i].banner_url);
                  l_status.text(dsc_list[i].status);
                  l_is_open.text(dsc_list[i].is_open);
                  l_bonus_item_id.text(dsc_list[i].bonus_item_id);
                }
              };

            }else {
              t_start_date.val( '정보가 없습니다.');
              t_end_date.val( '정보가 없습니다.' );
            }

            getDscRegItemList(dsc_id);

            }).val(dsc_id);
            var b_list  = $E('button').text('목록으로 돌아가기').button({icons:{primary:'ui-icon-refresh'}}).css({height:50, align:'center'}).click(function(){ sub_contents_dual.win('hide');sub_contents.win('show'); });

        div_info.verticalTable([[s_dsc_id, l_title, l_banner_url, l_is_open, l_status, l_bonus_item_id,  t_start_date, t_end_date, b_list]], {head: ['회차번호', '이벤트 명칭', '배너링크', '오픈여부', '진행여부', '보너스상품', '시작일', '종료일', '-'] , 'width':430});
        sub_selecteventlist.append(div_info);
        //getPopupRegItemList(popup_id);

        var context = $E('div');
        var sub_menu = [];
        var sel_cat_id = 0;
         menu.ajax({
           arrayArguments : true,
           async : false,
           methodcall : ['getCategoryList'],
           data       : [ 1, 0 ],
           success    : function( result ){
             for( var i in result ){
               sub_menu.push({
                 title: '[' + result[i].cat_id + '] ' + result[i].cat_name + ' (' + result[i].item_cnt + '개,' + info_cat_type[result[i].cat_type] + ')',
                 isFolder: result[i].sub_cnt,
                 isLazy: true,
                 thread_id : result[i].cat_id,
                 display_order: result[i].display_order,
                 depth : result[i].depth,
               });
             }
           }
         });

         sub_selectcategory.dynatree({
           children        : [ {title: '상점 홈(HOME)', isFolder:true, isLazy:true, thread_id:0, display_order: 0, depth:0,
             children : sub_menu
           }
         ],
         clickFolderMode : 2,
         minExpandLevel  : 1,
         checkbox        : false,
         onClick: function(node){  if (sel_cat_id != node.data.thread_id) { sel_cat_id = node.data.thread_id; getCashItemMappingList(sel_cat_id); }},
         onLazyRead: function(node){

            var thread_id = node.data.thread_id;
            if( thread_id < 0 )
              return false;

            node.setLazyNodeStatus(1);
            var child = [];

            menu.ajax({
              arrayArguments : true,
              async : false,
              methodcall : ['getCategoryList'],
              data       : [ node.data.depth, node.data.thread_id ],
              success    : function( result ){
                for( var i in result ){
                  child.push({
                    title: '[' + result[i].cat_id + '] ' + result[i].cat_name + ' (' + result[i].item_cnt + '개,' + info_cat_type[result[i].cat_type] + ')',
                    isFolder: result[i].sub_cnt,
                    isLazy: true,
                    thread_id : result[i].cat_id,
                    display_order: result[i].display_order,
                    depth : result[i].depth,
                  });
                }
              }
            });

            node.addChild(child);
            node.setLazyNodeStatus(0);
         }
      });

      sub_selectcategory.dynatree("getRoot").childList[0].expand(true);


      function getDscRegItemList(dsc_id) {

        menu.ajax({
          arrayArguments : true,
          async : false,
          methodcall : ['getDscItemList'],
          data       : [dsc_id],
          success    : function( result ){
            itemreg_list = result;

            sub_selectinfo.empty().clientTable(itemreg_list, {
              width: '100%',
              pagesize: 7,
              column_width: [70, null, 85, 85, 85, 85, 120, 80, 120, 120],
              field: [ 'del', 'item_name', 'saleinfo_id', 'price', 'dist_price', 'tot_cnt', 'cur_cnt', 'detail'],
              head: {
                  'del' : '삭제',
                  'item_name' : '상품명',
                  'saleinfo_id' : '상품판매번호',
                  'price' : '할인전가격',
                  'dist_price' : '할인후가격',
                  'tot_cnt' : '한정판매수량',
                  'cur_cnt' : '현재판매수량',
                  'detail' : '상세정보'
              },
              footer      : false,
              translate: {
                reg_date        : $adm.values.DATEFORMAT,
                dist_price: function(v, cname, row){
                  return $E('lable').text( set_comma(v) + '$').css({'color':'red'});
                 },
                price: function(v, cname, row){
                  return $E('lable').text( set_comma(v) + '$').css({'color':'red'});
               }
              },

              add_column: {
                  'detail': function(row){
                    var b_manage = $E('button').text('Info').css({width:80,height:35}).button({icons:{primary:'ui-icon-zoomin'}}).click(function(){

                      var div_info = $E('div'),
                          div_bottom = $E('div').css({'text-align':'center'});

                      var l_dsc_id      = $E('lable').text(row.dsc_id),
                          l_cash_item_id= $E('lable').text(row.cash_item_id),
                          t_name        = $E('text').val(row.item_name).css({'width':240, 'background':'#eeeeee'}).attr('readonly', true),

                          s_restrict_cnt= $E('select').css({'width':120}).selectOptions( info_restrict_cnt, {sort:'value'} ).val(row.restrict_cnt),

                          l_coupon_id   = $E('lable').text(row.coupon_id),
                          t_price       = $E('text').val(row.price).attr('readonly', true).validate({required: true, onlynumber: true}).css({'background':'#eeeeee'}),
                          t_dist_price  = $E('text').val(row.dist_price).attr('readonly', true).validate({required: true, onlynumber: true}).css({'color':'red', 'background':'#eeeeee'}),

                          t_tot_cnt     = $E('text').val(row.tot_cnt).validate({required: true, onlynumber: true}),
                          t_cur_cnt     = $E('text').val(row.cur_cnt).validate({required: true, onlynumber: true}),

                          l_reg_date    = $E('lable').text($adm.getDate('Y-m-d H:i:s',row.reg_date)),
                          b_add         = $E('button').text('수정').button({icons:{primary:'ui-icon-check'}}).css({height:50}).click(function(){

                            menu.ajax({
                              arrayArguments : true,
                              methodcall : ['updateDscItem'],
                              data       : [ row.dsc_id , row.cash_item_id, t_tot_cnt.val(), t_cur_cnt.val(), s_restrict_cnt.val() ],
                              success    : function( result ){
                                alert('할인 이벤트 상품의 정보가 성공적으로 수정 되었습니다.');
                                getDscRegItemList(row.dsc_id);
                                div_info.dialog('close');
                              }
                            });

                          }).appendTo(div_bottom),
                          b_cancel      = $E('button').text('취소').button({icons:{primary:'ui-icon-close'}}).css({height:50}).click(function(){ div_info.dialog('close'); }).appendTo(div_bottom);

                      div_info.verticalTable([[l_dsc_id, l_cash_item_id,  t_name, l_coupon_id, t_price, t_dist_price, $E('div').append(t_tot_cnt, $E('lable').text(' (0은 수량 제한 없음)')), t_cur_cnt, s_restrict_cnt, l_reg_date ]], {head: ['회차번호', '상품번호', '상품명', '쿠폰번호', '할인전가격', '할인후가격', '한정판매수량', '현재판매수량', '1인당 구매제한', '등록일']})
                              .append('<br>', div_bottom)
                              .dialog({
                                  title: '할인아이템 정보',
                                  stick: {
                                      right: b_manage
                                  }

                              });

                    });
                    return b_manage;
                  },
                  'del': function(row){
                    var b_manage = $E('button').text('삭제').button({icons:{primary:'ui-icon-trash'}}).css({width:65,height:35}).click(function(){

                      if (!confirm("선택한 상품의 할인정보를 삭제하시겠습니까?")) return;

                        menu.ajax({
                          arrayArguments : true,
                          methodcall : ['delDscItem'],
                          data       : [ row.dsc_id , row.cash_item_id ],
                          success    : function( result ){
                            alert('할인이벤트 상품 정보가 삭제 되었습니다.');
                            getDscRegItemList(row.dsc_id);
                          }
                        });

                    });
                    return b_manage;
                  }
              },
              //sort_field        : 'cash_item_id',                       // 기본 정렬 컬럼 명
              //sort_asc          : false                                // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
          }

            );
          }
        });
      }

      function getCashItemMappingList(cat_id)
      {
        var list = [];
        menu.ajax({
          async      : false,
          methodcall : ['getCashItemMappingList'],
          data       : [cat_id],
          success    : function( result ){
            list = result;
          }
        });

        sub_selectall.empty().clientTable( list, {
              width: '100%',
              pagesize: 7,
              field: [ 'sel', 'cash_item_id', 'saleinfo_id', 'item_name', 'price', 'icon', 'priority', 'display_yn'],
              head: packageInfoHead,
              translate: {
                item_type      : info_item_type,
                //icon           : info_icon,

                price: function(v, cname, row){
                  return $E('lable').text( set_comma(v) + '$').css({'color':'red'});
                 },
              },

              add_column: {
                  'sel' : function(row){
                    var b_manage = $E('button').text('할인추가').button({icons:{primary:'ui-icon-plus'}}).css({width:90,height:35}).width('100px').click(function(){
                      //try {

                        if (sel_cat_id <= 0) return alert("카테고리를 먼저 선택해 주세요.");
                        if (dsc_id <= 0) return alert("할인이벤트 회차를 먼저 선택해 주세요.");

                        var regCashItemList = sub_selectinfo.find('TABLE').clientTable('getData');

                        for (var idx in regCashItemList)
                        {
                         if (regCashItemList[idx].cash_item_id == row.cash_item_id)
                          return alert(row.item_name + "는(은) 이미 할인 적용되어 있는 상품 입니다.");
                        }


                        var info_couponname = [],
                        l_dsc_id        = $E('lable').text(dsc_id + '회차'),
                        t_item_name     = $E('text').val(row.item_name).attr('readonly', true).css({'width':220}).css("background","#eeeeee"),
                        div_bottom      = $E('div').css({'text-align':'center'}),
                        d_sel_item      = $E('div'),
                        div_info        = $E('div'),
                        t_tot_cnt       = $E('text').val(0).validate({required: true, onlynumber: true}),
                        t_cur_cnt       = $E('text').val(0).validate({required: true, onlynumber: true}),
                        s_restrict_cnt  = $E('select').css({'width':120}).selectOptions( info_restrict_cnt, {sort:'value'} );

                        var price_list = [],
                            dist_price;

                        for (var coupon_id in info_couponlist)
                        {
                          if (info_couponlist[coupon_id].type == "MT")
                            dist_price = row.price - info_couponlist[coupon_id].amount;
                          else
                            dist_price = row.price - (row.price*(info_couponlist[coupon_id].amount/100));
                          price_list.push({price : row.price, coupon_id : coupon_id, dist_price : dist_price, discount_name : info_couponlist[coupon_id].name })
                        }

                        console.log(price_list);
                        console.log(info_couponlist);

                        d_sel_item.empty().clientTable(price_list, {
                          width: '100%',
                          pagesize: 10,
                          field: [ 'coupon_id', 'price', 'dist_price', 'discount_name'],
                          cell_align : 'right',
                          head: {
                              'coupon_id': '선택',
                              'price' :'할인전 가격 ',
                              'dist_price' : ' ▶ 할인후 가격',
                              'discount_name' : ' 할인정보'
                            },
                           translate_realtime: {
                            coupon_id : function(v, name, r ){
                              var b_sel =  $E('radio',{name:'sel_price'}).val(v);
                              if (parseInt(r.dist_price) <=0) { b_sel.attr("disabled", true); }
                              return b_sel;
                             },
                             price: function(v){
                              return $E('lable').text( set_comma(v) + '$').css({'color':'black', 'text-align':'right'});
                             },
                             dist_price: function(v, name, row){
                              return $E('lable').text( set_comma(v) + '$').css({'color':'red', 'text-align':'right'});
                             }
                           },
                          'footer': false
                          }
                        );


                       var b_add           = $E('button').text('할인상품 등록').button({icons:{primary:'ui-icon-check'}}).css({height:50}).click(function(){

                       var sel_coupon_id = $('input[name=sel_price]:checked').val() || 0;
                       if (sel_coupon_id <= 0 ) return alert('상품의 할인 가격을 선택해주세요.');
                       var coupon_info = info_couponlist[sel_coupon_id],
                           dist_price  = row.price;

                      if (coupon_info.type == "MT")
                        dist_price = row.price - coupon_info.amount;
                      else
                        dist_price = row.price - (row.price*(coupon_info.amount/100));

                       if (t_tot_cnt.val() == "" || isNaN(t_tot_cnt.val()) == true ) return alert('한정 판매수량은 숫자만 입력해 주세요.');
                       if (t_cur_cnt.val() == "" || isNaN(t_cur_cnt.val()) == true ) return alert('현재 판매수량은 숫자만 입력해 주세요.');

                       menu.ajax({
                         arrayArguments : true,
                         methodcall : ['addDscItem'],
                         data       : [ dsc_id, row.cash_item_id, t_tot_cnt.val(), t_cur_cnt.val(), sel_coupon_id, row.price, dist_price, s_restrict_cnt.val(), coupon_info.type + '|' + coupon_info.amount  ],
                         success    : function( result ){
                           alert('할인 이벤트 상품이 성공적으로 등록 되었습니다.');
                           div_info.dialog('close');
                           getDscRegItemList(dsc_id);
                         }
                       });

                     }).appendTo(div_bottom),
                     b_cancel      = $E('button').text('취소').button({icons:{primary:'ui-icon-close'}}).css({height:50}).click(function(){ div_info.dialog('close'); }).appendTo(div_bottom);


                    div_info.empty().verticalTable([[l_dsc_id,  t_item_name, $E('div').append(t_tot_cnt, $E('lable').text(' (0은 수량 제한 없음)')), t_cur_cnt, d_sel_item, s_restrict_cnt]], {head: ['회차번호', '상품명', '한정 판매수량', '현재 판매수량', '가격정보', '1인당 구매제한' ]})
                            .append('<br>', div_bottom)
                            .dialog({
                                tle: '할인 이벤트 상품 등록'
                            });


                      //}catch(e) {alert("[오류!] 상품 정보를 갖고올 수 없습니다.")};
                    });
                    return b_manage;
                  }
              },

              sort_field        : 'priority',                         // 기본 정렬 컬럼 명
              sort_asc          : false,                              // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
              footer            : false
          });
      }

      getCashItemMappingList(0);
      getDscRegItemList(dsc_id);

     }

      function getDscList()
      {
        var cur_cnt=0;
        menu.ajax({
          arrayArguments : true,
          async : false,
          methodcall : ['getDscList'],
          data       : [],
          success    : function( result ){
            dsc_list = result;
            info_dsclist[0] = "회차를 선택해주세요.";
            for (var i = 0;i<result.length;i++)
            {
              info_dsclist[result[i].dsc_id] = result[i].dsc_id + "회차";
              if (dsc_list[i].status == "진행중")
                cur_cnt++;
            }
          }
        });
        if (cur_cnt > 1) alert("현재 진행중인 할인이벤트가 2개 이상입니다.\n기간을 변경하여 주세요.");
        fn_makeDscListTable();
      }

      function fn_GetDscInfo(info, component){

          if (info  == null) {
            info = {
              'dsc_id' : 0,
              'title'  : '',
              'is_open': 'Y',
              'bonus_item_id' : 0
            }
          }

          var div_info = $E('div'),
              div_bottom = $E('div').css({'text-align':'center'});

          var t_title       = $E('text').css({'width':'300px'}).val(info.title);

              if (info.dsc_id == 0) {
                var t_start_date  = $E('text').validate({required:true, date:'+0d'}),
                l_dsc_id      = $E('lable').text('신규생성'),
                t_end_date    = $E('text').validate({required:true, date:'+30d'}),
                t_start_time  = $E('text', {size: 6}).validate({required:true, time:true}).val('000000'),
                t_end_time    = $E('text', {size: 6}).validate({required:true, time:true}).val('235959');
               }else{
                var t_start_date  = $E('text').validate({required:true, date:'+0d'}).val(info.start_date.substring(0,8)),
                l_dsc_id      = $E('lable').text(info.dsc_id),
                t_start_time  = $E('text', {size: 6}).validate({required:true, time:true}).val(info.start_date.substring(8,14)),
                t_end_date    = $E('text').validate({required:true, date:'+30d'}).val(info.end_date.substring(0,8)),
                t_end_time    = $E('text', {size: 6}).validate({required:true, time:true}).val(info.end_date.substring(8,14));
             }

              var s_is_open     = $E('select').css({'width':120}).selectOptions( {'Y':'Y', 'N':'N'}, {sort:'value'} ).val(info.is_open),

              t_dsc_desc        = $E('textarea').css({width:350,height:70}).css("background","#E1E1E1").validate({maxLength: 200}).val(info.dsc_desc),

              t_bonus_item_id     = $E('text', {size: 10}).validate({onlynumber: true}).val(info.bonus_item_id),
              s_bonus_restrict_cnt= $E('select').css({'width':120}).selectOptions( info_restrict_cnt, {sort:'value'} ).val(info.bonus_restrict_cnt),

              div_1 = $E('div'),

              t_banner_url  = $E('text').css({'width':'300px'}).val(info.banner_url),

              b_add         = $E('button').text('수정').button({icons:{primary:'ui-icon-check'}}).css({height:50}).click(function(){ updateItem(); }).appendTo(div_bottom),
              b_cancel      = $E('button').text('취소').button({icons:{primary:'ui-icon-close'}}).css({height:50}).click(function(){ div_info.dialog('close'); }).appendTo(div_bottom);

              $E('lable').text('▶ 보너스 상품 번호 :').appendTo(div_1);
              div_1.append(t_bonus_item_id);

              $E('lable').text('▶ 지급제한 :').appendTo(div_1);
              div_1.append(s_bonus_restrict_cnt);

          div_info.verticalTable([[l_dsc_id, t_title, t_banner_url, s_is_open, t_dsc_desc, div_1, t_start_date.add(t_start_time), t_end_date.add(t_end_time)]], {head: ['회차번호', '이벤트명칭', '배너링크', '오픈여부', '이벤트설명', '보너스상품','시작일', '종료일']})
                  .append('<br>', div_bottom)
                  .dialog({
                      title: '할인 이벤트 회차정보',
                      stick: {
                          right: component
                      }

                  });

          function updateItem(){

            if( t_title.val() == "")  return alert('이벤트 명칭을 입력해주세요.');
            if( t_banner_url.val() == "")  return alert('배너이미지 링크 주소를 입력해주세요.');
            //if( s_bonus_restrict_cnt.val() != "" && t_bonus_item_id.val() == "")  return alert('보너스 상품의 상품번호를 입력해주세요.');
            if (t_bonus_item_id.val() != "" && isNaN(t_bonus_item_id.val()) == true ) return alert('보너스 상품의 상품번호는 숫자만 입력해 주세요.');

            var new_item = {
                  'dsc_id' : info.dsc_id,
                  'start_date': t_start_date.val() +  t_start_time.val(),
                  'end_date': t_end_date.val() +  t_end_time.val(),
                  'title' : t_title.val(),
                  'is_open' : s_is_open.val(),
                  'dsc_desc' : t_dsc_desc.val(),
                  'bonus_item_id' : t_bonus_item_id.val(),
                  'bonus_restrict_cnt' : s_bonus_restrict_cnt.val(),
                  'banner_url' : t_banner_url.val()
                };

            menu.ajax({
              arrayArguments : true,
              methodcall : ['addDscInfo'],
              data       : [ new_item ],
              success    : function( result ){
                div_info.dialog('close');
                menu.ajax({
                  arrayArguments : true,
                  async : false,
                  methodcall : ['getDscList'],
                  data       : [],
                  success    : function( result ){
                    dsc_list = result;
                  }
                });
                fn_makeDscListTable();
                alert('할인이벤트 정보가 성공적으로 등록/수정 되었습니다.');
              }
            });

          }
      }

      function fn_makeDscListTable(){
        sub_selectevent.empty().clientTable( dsc_list, {
            width: '100%',
            pagesize: 15,
            column_width: [80, 200, 150, 150, 150, 100, 120, 150, 150, 160, 160],
            field: [ 'dsc_id', 'title' , 'start_date', 'end_date', 'reg_date', 'is_open', 'status', 'bonus_item_id', 'detail', 'manage'],
            head: {
                'dsc_id' : '회차번호',
                'title' : '이벤트명칭',
                'start_date': '판매시작일',
                'end_date': '판매종료일',
                'reg_date': '등록일',
                'is_open' : '오픈여부',
                'status' : '기간 진행여부',
                'detail' : '상세정보',
                'bonus_item_id' : '보너스 상품번호',
                'manage' : '할인상품 관리'
            },
            translate: {
              start_date      : $adm.values.DATEFORMAT,
              end_date        : $adm.values.DATEFORMAT,
              reg_date        : $adm.values.DATEFORMAT,
              status          : function(value, name, row) {
                var _com = $E("lable").text(value).css({'width':80});

                if (value == "진행중") _com.css("color","red");
                else if (value == "종료") _com.css("color","black");
                else if (value == "대기중") _com.css("color","green");

                return _com;
              }
            },

            add_column: {
                'manage': function(row){
                  var b_manage = $E('button').text('상품 관리').button({icons:{primary:'ui-icon-cart'}}).css({width:120,height:30}).click(function(){
                    getDscItem(row.dsc_id);
                  });
                  return b_manage;
                },

                'detail' : function(row){
                  var b_manage = $E('button').text('이벤트 정보').button({icons:{primary:'ui-icon-zoomin'}}).css({width:120,height:30}).click(function(){
                    try {
                      fn_GetDscInfo(row, b_manage);
                    }catch(e) {alert("[오류!] 할인이벤트 정보를 갖고올 수 없습니다.")};
                  });
                  return b_manage;
                }
            },

            filter_view       : true,
            sort_field        : 'dsc_id',                            // 기본 정렬 컬럼 명
            sort_asc          : false                                // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
        });

      var  div_info        = $E('div'),
           div_bottom      = $E('div').css({'text-align':'left'}),
           b_sel_reg       = $E('button').text('신규 등록').button({icons:{primary:'ui-icon-check'}}).css({height:50}).click(function(){ fn_GetDscInfo( null, b_sel_reg) }).appendTo(div_bottom);
           sub_selectevent.append(div_bottom);
      }

      getDscList();

    }

    function goManageCategory()
    {
      div_guide.empty();
      sub_contents.win('remove_child');
      sub_contents_dual.win('hide');
      sub_contents.win('show');

      var sub_selectcategory   = _drawWin( '카테고리 메뉴', sub_contents, 0, 10, 460, 320);
      var sub_selectinfo       = _drawWin( '카테고리 등록 상품', sub_contents, 0, 475, 855, 320);
      var sub_selectall        = _drawWin( '전체 판매 상품', sub_contents, 330, 10, 1320, 340);

      var context = $E('div');
      var sub_menu = [];
      var sel_cat_id = 0;
       menu.ajax({
         arrayArguments : true,
         async : false,
         methodcall : ['getCategoryList'],
         data       : [ 1, 0 ],
         success    : function( result ){
           for( var i in result ){
             sub_menu.push({
               title: '[' + result[i].cat_id + '] ' + result[i].cat_name + ' (' + result[i].item_cnt + '개,' + info_cat_type[result[i].cat_type] + ')',
               isFolder: result[i].sub_cnt,
               isLazy: true,
               thread_id : result[i].cat_id,
               display_order: result[i].display_order,
               depth : result[i].depth,
             });
           }
         }
       });

       sub_selectcategory.dynatree({
         children        : [ {title: '상점 홈(HOME)', isFolder:true, isLazy:true, thread_id:0, display_order: 0, depth:0,
           children : sub_menu
         }
       ],
       clickFolderMode : 2,
       minExpandLevel  : 1,
       checkbox        : false,
       onClick: function(node){  if (sel_cat_id != node.data.thread_id) { sel_cat_id = node.data.thread_id; getCashItemMappingList(sel_cat_id); }},
       onLazyRead: function(node){

          var thread_id = node.data.thread_id;
          if( thread_id < 0 )
            return false;

          node.setLazyNodeStatus(1);
          var child = [];

          menu.ajax({
            arrayArguments : true,
            async : false,
            methodcall : ['getCategoryList'],
            data       : [ node.data.depth, node.data.thread_id ],
            success    : function( result ){
              for( var i in result ){
                child.push({
                  title: '[' + result[i].cat_id + '] ' + result[i].cat_name + ' (' + result[i].item_cnt + '개,' + info_cat_type[result[i].cat_type] + ')',
                  isFolder: result[i].sub_cnt,
                  isLazy: true,
                  thread_id : result[i].cat_id,
                  display_order: result[i].display_order,
                  depth : result[i].depth,
                });
              }
            }
          });

          node.addChild(child);
          node.setLazyNodeStatus(0);
       },

       onCreate: function(node, span){

          $adm(span).bind('contextmenu', function(){

            var buttons;

            if( node.data.thread_id >= 0 ){
              buttons = [
                $adm('<button type="button"/>').text('하위 카테고리 추가'.t('Menu')).button().click( node, fn_AddCategory )
              ];

              if( node.data.thread_id > 0 ) {
                buttons.push( $adm('<button type="button"/>').text('카테고리 수정'.t('Menu')).button().click( node, fn_ModifyCategory) );
                buttons.push( $adm('<button type="button"/>').text('카테고리 삭제'.t('Menu')).button().click( node, fn_DelCategory) );
              }
            }
            else{
              buttons = [
                $adm('<button type="button"/>').text('권한 없음'.t('Menu')).button()
              ];
            }

            buttons.push();

            context.admMenu(buttons, {
              position: {
                my : 'left top',
                at : 'right top',
                of : this
              }
            }).mouseleave(function(){ fn_closeContext(); });

            return false;

          });

        }
    });

    sub_selectcategory.dynatree("getRoot").childList[0].expand(true);
    //sub_selectcategory.dynatree("getRoot").childList[0].childList[0].expand(true);
    //sub_selectcategory.dynatree("getRoot").childList[0].childList[1].expand(true);
    //sub_selectcategory.dynatree("getRoot").childList[0].childList[2].expand(true);


      function getCashItemMappingList(cat_id)
      {
        var list = [];
        menu.ajax({
          async      : false,
          methodcall : ['getCashItemMappingList'],
          data       : [cat_id],
          success    : function( result ){
            list = result;
          }
        });

        sub_selectinfo.empty().clientTable( list, {
              width: '100%',
              pagesize: 7,
              field: [ 'del', 'cash_item_id', 'saleinfo_id', 'item_name', 'price', 'icon', 'priority', 'display_yn', 'detail'],
              head: {
                  'del' : '삭제',
                  'cash_item_id': '상품번호',
                  'saleinfo_id' : '상품판매번호',
                  'item_name' : '상품명',
                  //'item_type': '상품유형',
                  'price': '가격',
                  'icon' : '아이콘',
                  'priority' : '노출순서',
                  'display_yn' : '노출여부',
                  'detail' : '상세정보'
              },
              translate: {
                item_type      : info_item_type,
                display_yn     : info_sale_yn,
                icon           : info_icon,
                /*
                icon           : function (v, cname, row) {

                  v = v.replace("new", "N");
                  v = v.replace("special", "S");
                  v = v.replace("hot", "H");
                  v = v.replace("limited", "L");
                  v = v.replace("sale", "D");

                  return $E('lable').text(v);

                },
                */
                price: function(v, cname, row){
                  return $E('lable').text( set_comma(v) + '$').css({'color':'red'});
                 },
              },
              add_column: {

                'detail' : function(row){
                  var b_manage = $E('button').text('상세정보').button({icons:{primary:'ui-icon-zoomin'}}).css({width:90,height:35}).click(function(){
                    try {

                      var div_info    = $E('div'),
                          div_bottom  = $E('div').css({'text-align':'center'}).append('<br>');

                      var l_cash_item_id        = $E('lable').text(row.cash_item_id),
                          l_saleinfo_id         = $E('lable').text(row.saleinfo_id),
                          l_name                = $E('lable').text(row.item_name).css({'width':240}),
                          l_item_type           = $E('lable').text(info_item_type[row.item_type]),
                          l_price               = $E('lable').text(set_comma(row.price)+'$'),

                          t_priority            = $E('text').val(row.priority).validate({required: true, onlynumber: true}),
                          s_display_yn          = $E('select').css({'width':120}).selectOptions( {'Y':'Y', 'N':'N'}, {sort:'value'} ).val(row.display_yn),
                          s_icon                = $E('select').css({'width':120}).selectOptions(info_icon).val(row.icon),

                          /*
                          d_icon                = $E('div').css({'width':330, 'height':'auto', 'text-align':'left'});
                          for ( var icon in info_icon )
                          {
                            if (row.icon.indexOf(icon) >= 0 )
                              d_icon.append($E('checkbox').addClass('icon_c').attr("checked", true).val(icon));
                            else
                              d_icon.append($E('checkbox').addClass('icon_c').attr("checked", false).val(icon));

                            d_icon.append($E('lable').text(info_icon[icon]), '<nbsp;>' );
                          }
                          */

                          b_add         = $E('button').text('판매정보 수정').button({icons:{primary:'ui-icon-check'}}).css({height:50}).appendTo(div_bottom).click(function(){

                            if (t_priority.val() == "" || isNaN(t_priority.val()) == true ) return alert('노출 순서는 숫자만 입력해 주세요.');

                            var icon_value = $('input:checkbox:checked.icon_c').map(function () {
                              return this.value;
                            }).get();

                            menu.ajax({
                              arrayArguments : true,
                              methodcall : ['updateCashItemMappingInfo'],
                              data       : [sel_cat_id , row.cash_item_id, t_priority.val(), s_display_yn.val(), s_icon.val() ],
                              success    : function( result ){
                                alert('상품 판매정보가 성공적으로 수정 되었습니다.');
                                div_info.dialog('close');
                                getCashItemMappingList(sel_cat_id);
                              }
                            });
                          }),

                          b_cancel         = $E('button').text('취소').button({icons:{primary:'ui-icon-close'}}).css({height:50}).appendTo(div_bottom).click(function(){

                            div_info.dialog('close');

                          });

                          var div_info      = $E('div');
                          div_info.verticalTable([[l_cash_item_id, l_saleinfo_id, l_name, l_item_type, l_price, t_priority , s_display_yn, s_icon  ]], {width:'450' , head: ['상품번호', '상품판매번호', '상품명', '상품유형', '가격', '노출순서', '노출여부', '아이콘']}).append(div_bottom)
                          .dialog({
                              title: '상품 판매/노출 정보',
                              stick: {
                                  down: b_manage
                              }
                          });

                    }catch(e) {alert("[오류!] 상품 정보를 갖고올 수 없습니다.")};
                  });
                  return b_manage;
                },

                'del': function(row){
                  var b_manage = $E('button').text('삭제').button({icons:{primary:'ui-icon-trash'}}).css({width:65,height:35}).click(function(){

                    if (!confirm("선택한 상품을 삭제하시겠습니까?")) return;

                      menu.ajax({
                        arrayArguments : true,
                        methodcall : ['delCashItemMappingInfo'],
                        data       : [ sel_cat_id , row.cash_item_id ],
                        success    : function( result ){
                          alert('선택한 상품이 성공적으로 삭제 되었습니다.');
                          getCashItemMappingList(sel_cat_id);
                        }
                      });

                  });
                  return b_manage;
                }

              },

              //filter_view       : true,
              sort_field        : 'priority',                         // 기본 정렬 컬럼 명
              sort_asc          : false,                              // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
              footer            : false
          });
      }

      function getCashItemList(filter)
      {
        var list = [];
        menu.ajax({
          async      : false,
          methodcall : ['getCashItemListAll'],
          data       : [],
          success    : function( result ){
            for( var i in result ){
               if (result[i].saleinfo_id > 0 )
                list.push(result[i]);
             }
          }
        });

        sub_selectall.empty().clientTable( list, {
              width: '100%',
              pagesize: 7,
              field: [ 'sel', 'cash_item_id', 'cash_item_code', 'item_name', 'item_type', 'price', 'saleinfo_id', 'lumena', 'sale_yn', 'sale_place'],
              head: packageInfoHead,
              translate: {
                item_type      : info_item_type,
                sale_yn        : info_sale_yn,
                period_type    : info_period_type,
                period         : info_period,
                sale_place     : info_sale_place,

                price: function(v, cname, row){
                  return $E('lable').text( set_comma(v) + '$').css({'color':'red'});
                 },
              },
              add_column: {
                  'sel' : function(row){
                    var b_manage = $E('button').text('상품 올리기').button({icons:{primary:'ui-icon-plus'}}).css({width:130,height:35}).click(function(){
                      try {
                        if (sel_cat_id <= 0) return alert("카테고리를 먼저 선택해 주세요.");

                        var regCashItemList = sub_selectinfo.find('TABLE').clientTable('getData');

                        for (var idx in regCashItemList)
                        {
                         if (regCashItemList[idx].cash_item_id == row.cash_item_id)
                          return alert(row.item_name + "는(은) 이미 등록되어 있는 상품 입니다.");
                        }

                          menu.ajax({
                            async      : false,
                            methodcall : ['regCashItemMappingInfo'],
                            data       : [sel_cat_id, row.cash_item_id],
                            success    : function( result ){
                              getCashItemMappingList(sel_cat_id);
                            }
                          });

                      }catch(e) {alert("[오류!] 상품 정보를 갖고올 수 없습니다.")};
                    });
                    return b_manage;
                  }
              },

              filter_view       : true,
              sort_field        : 'cash_item_id',                         // 기본 정렬 컬럼 명
              sort_asc          : false,                                // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
              footer            : false
          });
       }

      function delCategoryInfo(cat_id, node)
      {
        menu.ajax({
          async      : false,
          methodcall : ['delCategoryInfo'],
          data       : [cat_id],
          success    : function( result ){
            node.getParent().resetLazy();
            node.getParent().expand(true);
          }
        });

      }

      function showCategoryInfo(cat_id, node)
      {
        var row = {
          'parent_id' : node.data.thread_id,
          'depth' : node.data.depth,
          'cat_type' : 'N',
          'order_type' : 'LIST'
        },
        cat_str;

        if (cat_id > 0 ) {
          cat_str = cat_id
          menu.ajax({
            async      : false,
            methodcall : ['getCategoryInfo'],
            data       : [cat_id],
            success    : function( result ){
              if (result[0]) row = result[0];
            }
          });
        }else {
          cat_str = '신규생성';
          cat_id  = 0;
        }


      var div_info    = $E('div'),
          div_bottom  = $E('div').css({'text-align':'center'}).append('<br>');


      var l_cat_id             = $E('lable').text(cat_str),
          l_cat_code           = $E('lable').text('MALL'),
          t_cat_name           = $E('text').css({'width':250}).val(row.cat_name),

          t_parent_id          = $E('text').val(row.parent_id).css("background","#E1E1E1").attr('readonly',true),

          t_images             = $E('text').css({'width':250}).val(row.cat_image),
          t_desc               = $E('textarea').css({width:350,height:80}).validate({maxLength: 1000}).val(row.cat_desc),

          s_cat_type           = $E('select').css({'width':120}).selectOptions( info_cat_type, {sort:'value'} ).val(row.cat_type),
          s_order_type         = $E('select').css({'width':120}).selectOptions( info_order_type, {sort:'value'} ).val(row.order_type),

          b_add                = $E('button').text('카테고리 정보 등록/수정').button({icons:{primary:'ui-icon-check'}}).css({height:50}).appendTo(div_bottom).click(function(){

            if (t_cat_name.val() == '') return alert('카테고리 이름을 입력해 주세요.');
            menu.ajax({
              arrayArguments : true,
              methodcall : ['regCategory'],
              data       : [ cat_id, t_cat_name.val(), t_parent_id.val(), row.depth, t_desc.val(), t_images.val(), s_cat_type.val(), s_order_type.val()],
              success    : function( result ){
                alert('카테고리정보가 성공적으로 등록/수정 되었습니다.');
                div_info.dialog('close');

                if (cat_id > 0 ) {
                  node.getParent().resetLazy();
                  node.getParent().expand(true);
                }else {
                  node.resetLazy();
                  node.expand(true);
                }

              }
            });

          }),

          b_cancel         = $E('button').text('취소').button({icons:{primary:'ui-icon-close'}}).css({height:50}).appendTo(div_bottom).click(function(){

            div_info.dialog('close');

          });

          var div_info      = $E('div');
          div_info.verticalTable([[ l_cat_id, l_cat_code, t_cat_name, t_parent_id, t_desc, t_images, s_cat_type, s_order_type  ]], {head: ['카테고리ID', '카테고리코드', '카테고리 이름', '상위 카테고리ID', '카테고리설명', '이미지경로', '카테고리유형', '노출유형']}).append(div_bottom)
          .dialog({
              title: '상품 상세 정보',
              stick: {right: node.span},
          });
      }

      function fn_closeContext(){
        context.empty().hide();
      }

      function fn_AddCategory(event){

        fn_closeContext();
        var node = event.data;
        if (node.data.depth >=2) return alert("더 이상 메뉴를 추가할 수 없습니다.");
        showCategoryInfo(null, node);

        console.log(node);

      }

      function fn_ModifyCategory(event){

        fn_closeContext();
        var node = event.data;
        showCategoryInfo(node.data.thread_id, node);

      }

      function fn_DelCategory(event){

        fn_closeContext();
        var node = event.data;
        if (node.data.depth < 0) return alert("메뉴를 삭제할 수 없습니다.");
        if (!confirm("선택한 카테고리를 삭제하시겠습니까?")) return false;
        delCategoryInfo(node.data.thread_id, node);

      }

      getCashItemList();
      getCashItemMappingList(0);

    }

    function goManageCashItem()
    {
      div_guide.empty();
      sub_contents.win('remove_child');
      sub_contents_dual.win('hide');
      sub_contents.win('show');

      var sub_selectitem  = _drawWin( '상품 관리',sub_contents, 0, 10, 1310, 650);

      function goRegAll()
      {
         var msg="선택한 상품의 상품판매번호를 발급하시겠습니까?\n\n(상품이 많을경우 현재 화면에 표시된 상품만 등록되며\n페이지를 스크롤하여 계속 상품을 등록하세요.)",
             data={},
             cnt=0,
             bProcess;

         var  ItemInfo,
              ItemList = sub_selectitem.find('TABLE').clientTable('getData');

         if (bProcess == true)
           return false;

         if (!confirm(msg))
           return false;
         else{

           bProcess = true;
           sub_selectitem.find('TABLE > TBODY > TR').each(function(i,tr){

             if ($(tr).css("display") == "none") {
               bProcess = false;
               return;
             }

             if (sub_selectitem.find(":checkbox").eq(i).prop("checked") == true)
             {
              cnt++;
              for( var idx in ItemList ){
               if (ItemList[idx].cash_item_id == tr.children[1].innerText)
               {
                   ItemInfo = ItemList[idx];
                   break;
               }
              }

              data              = {};
              data.ssn          = 347;
              data.cash_item_id = ItemInfo.cash_item_id;
              data.name         = ItemInfo.item_name;
              data.price        = ItemInfo.price;
              data.cat_id       = info_cat_id[ItemInfo.item_type];
              data.sale_cat_id  = info_sale_cat_id[ItemInfo.item_type];

              regSaleinfo(data, i);

             }
           });
           bProcess = false;
         }

         if (cnt == 0) alert ("선택된 상품이 없습니다. 상품을 다시 선택해 주세요.");
      }

      function regSaleinfo(item, i)
      {
        if (!item.name || !item.price || item.price <=0)
          return;

        sub_selectitem.find('TABLE > TBODY > TR').eq(i).find('input').val('발급중...');

        //sub_selectitem.find(':input[name=saleinfo_id]').eq(i).val("발급중...");
        //if ($adm.getConfig().Server.EnvLocation == 'dev') var url = 'http://pub.dev.nwz.kr/~jj2lover/admintoolv2/admin_global/pubgame_regsaleitem.nwz';
        //else var url = 'http://admintool.pmang.com/admin_global/admintool_ajax.nwz';
        //var url = 'http://pub.dev.nwz.kr/~jj2lover/admintoolv2/admin_global/pubgame_regsaleitem.nwz';
        var url = 'http://admintool.pmang.com/admin_global/pubgame_regsaleitem.nwz';

        $.ajax({
          url:url,
          async:false,
          dataType:"jsonp",
          data:"ssn=" + item.ssn + "&name=" + item.name + "&cat_id=" + item.cat_id + "&price=" + item.price + "&sale_cat_id=" + item.sale_cat_id,
          crossDomain : true,
          success:function(json) {

          if (json.retmsg == "OK")
          {
            menu.ajax({
              arrayArguments : true,
              async : false,
              methodcall : ['updateCashItemSaleInfo'],
              data       : [ item.cash_item_id, json.saleinfo_id],
              success    : function( result ){
                sub_selectitem.find('TABLE > TBODY > TR').eq(i).find('input').val(json.saleinfo_id).css({'color':'blue'});
                sub_selectitem.find('TABLE > TBODY > TR').eq(i).find(':checkbox').attr('disabled', true);
              }
            });

          }else{
            sub_selectitem.find('TABLE > TBODY > TR').eq(i).find('input').val('발급실패');
          }

        }});
      }

      function showCashItemDetail(cash_item_id)
      {

        var row = {};
        var Mappinglist = {};

        menu.ajax({
          async      : false,
          methodcall : ['getCashItemInfo'],
          data       : [cash_item_id],
          success    : function( result ){
            row = result[0];
            Mappinglist[0] = (row.ref_item_id==0)?'없음':row.ref_item_id + '|' + row.item_cnt;
            for( var i in row.ItemList ){
               Mappinglist[i] = row.ItemList[i].item_type + '|' + row.ItemList[i].item_name + ' (' + row.ItemList[i].item_id + '|' + row.ItemList[i].item_cnt + '개)';
             }
          }
        });

        /*
        menu.ajax({
          async      : false,
          methodcall : ['getCashItemMappingInfo'],
          data       : [cash_item_id, row.item_type, row.ref_item_id],
          success    : function( result ){
            for( var i in result ){
               Mappinglist[i] = result[i].item_name;
             }
          }
        });
        */

      var div_info    = $E('div'),
          div_bottom  = $E('div').css({'text-align':'center'}).append('<br>');


/*
          var s_vip_level       = $E('select').css({'width':180}).selectOptions( info_vip_level, {sort:'value'} ).val('1'),
          s_period_type         = $E('select').css({'width':180}).selectOptions( info_period_type, {sort:'value'} ).val('P'),
          t_period              = $E('text').val('0').validate({required: true, onlynumber: true}),
          t_price               = $E('text').val('0').validate({onlynumber: true}),
          t_saleinfo_id         = $E('lable').text('상품 및 빌링(NBOS)정보 관리 - 메뉴에서 발급 가능 합니다.').css({'color':'red'}),
          t_description         = $E('textarea').css({width:350,height:80}).validate({maxLength: 4000}).val(''),
          t_short_description   = $E('textarea').css({width:350,height:40}).validate({maxLength: 1000}).val(''),

          s_sale_place          = $E('select').css({'width':180}).selectOptions( info_sale_place, {sort:'value'} ).val('W'),
          s_sale_yn             = $E('select').css({'width':180}).selectOptions( info_sale_yn, {sort:'value'} ).val('Y'),

          t_ref_item_id         = $E('select').css({'width':350, 'height':60}).attr({'multiple':'multiple'}),
          t_reward_money        = $E('text').val('0').validate({required: true, onlynumber: true}),
          //t_reward_medal        = $E('text').val('0').validate({required: true, onlynumber: true}),
          c_dup_yn              = $E('checkbox').attr("checked", false).val("Y"),
*/

      var l_cash_item_id        = $E('lable').text(row.cash_item_id),
          t_cash_item_code      = $E('text').css({'width':120}).val(row.cash_item_code).validate({required: true, onlynumber: true}),
          t_name                = $E('text').css({'width':250}).val(row.item_name),

          s_item_type           = $E('lable').text( info_item_type[row.item_type]), t_vip_info;

          if (row.item_type == 'VP')
            t_vip_info          = $E('lable').text(   info_vip_level[row.vip_level] + ' - ' + row.period + info_period_type[row.period_type]   );
          else
            t_vip_info          = $E('lable').text('해당없음');

          var t_price           = $E('text').val(row.price).validate({onlynumber: true}),

          t_saleinfo_id         = $E('text').val(row.saleinfo_id).css("background","#E1E1E1").attr('readonly',true),

          t_ios_id              = $E('text').val(row.ios_id),
          t_ios_price           = $E('text').val(row.ios_price),
          t_ios_sale_price      = $E('text').val(row.ios_sale_price),
          t_android_id          = $E('text').val(row.android_id),

          t_description         = $E('textarea').css({width:350,height:80}).validate({maxLength: 8000}).val(row.description),
          t_description_app     = $E('textarea').css({width:350,height:80}).validate({maxLength: 4000}).val(row.app_description),
          t_description_wic     = $E('textarea').css({width:350,height:80}).validate({maxLength: 8000}).val(row.wic_description),
          t_short_description   = $E('textarea').css({width:350,height:40}).validate({maxLength: 8000}).val(row.short_description),
          t_buy_description     = $E('textarea').css({width:350,height:40}).validate({maxLength: 8000}).val(row.buy_description),

          s_sale_place          = $E('select').css({'width':120}).selectOptions( info_sale_place, {sort:'value'} ).val(row.sale_place),
          s_sale_yn             = $E('select').css({'width':120}).selectOptions( info_sale_yn, {sort:'value'} ).val(row.sale_yn);

          debug(Mappinglist);

          var t_ref_item_id         = $E('select').css({'width':350, 'height':90}).selectOptions(Mappinglist).attr( {'multiple':'multiple'}).css("background","#E1E1E1"),
          t_reward_money        = $E('text').val(row.lumena).validate({required: true, onlynumber: true}),
          //t_reward_medal        = $E('text').val(row.reward_medal).validate({required: true, onlynumber: true}),
          c_dup_yn              = $E('checkbox').attr("checked", (row.dup_yn=="Y"?true:false)).val("Y"),

          b_add         = $E('button').text('상품정보 수정').button({icons:{primary:'ui-icon-check'}}).css({height:50}).appendTo(div_bottom).click(function(){

            if (t_cash_item_code.val() == '') return alert('상품코드를 입력해 주세요.')
            if (t_name.val() == '') return alert('상품명을 입력해 주세요.');
            if (t_price.val() == "" || isNaN(t_price.val()) == true ) return alert('판매가격은 숫자만 입력해 주세요.');

            var dup_yn = c_dup_yn.is(":checked") == true?"Y":"N";
            menu.ajax({
              arrayArguments : true,
              methodcall : ['updateCashItem'],
              data       : [ cash_item_id, t_cash_item_code.val(), t_name.val(), t_price.val(), t_description.val(), t_description_app.val(), t_description_wic.val(), t_short_description.val(), t_buy_description.val(), s_sale_place.val(), s_sale_yn.val(),  t_reward_money.val(), dup_yn, t_ios_id.val(), t_android_id.val(), t_ios_price.val(), t_ios_sale_price.val() ],
              success    : function( result ){
                alert('상품정보가 성공적으로 수정 되었습니다.');
                div_info.dialog('close');
                getCashItemList();
              }
            });
          }),

          b_cancel         = $E('button').text('취소').button({icons:{primary:'ui-icon-close'}}).css({height:50}).appendTo(div_bottom).click(function(){

            div_info.dialog('close');

          });

          if (row.saleinfo_id > 0) t_price.attr('readonly', true).css("background","#E1E1E1");

          var div_info      = $E('div');
          div_info.verticalTable([[l_cash_item_id, t_cash_item_code, t_name, s_item_type, t_vip_info, t_price, t_saleinfo_id, t_ios_id, t_ios_price, t_ios_sale_price, t_android_id, t_description, t_description_app, t_description_wic, t_short_description, t_buy_description, s_sale_place, s_sale_yn, $E('div').append(t_ref_item_id), t_reward_money, $E('div').append(c_dup_yn, $E('lable').text('중복구매 불가 상품'))  ]], {head: ['상품 고유 번호', '상품 코드', '상품명', '상품 유형', '*VIP 정보', '판매 가격', '상품판매번호', 'IOS_상품번호', 'IOS_원가격', 'IOS_판매가격', 'ANDROID_상품번호', '상세 설명(PC)','상세 설명(APP)','상세 설명(WIC)', '짧은 설명', '구매/선물 설명', '판매 위치', '판매 유무', '지급 아이템', '루메나', '구매 옵션']}).append(div_bottom)
          .dialog({
              title: '상품 상세 정보'
          });

      }

      function getCashItemList(filter)
      {
        var list = {};
        menu.ajax({
          async      : false,
          methodcall : ['getCashItemListAll'],
          data       : [],
          success    : function( result ){
            list = result;
            for( var i in list ){
               list[i].sel         = (list[i].saleinfo_id>0 || list[i].price<=0 )?$E("checkbox").prop("disabled","true"):$E("checkbox");
             }
          }
        });

        sub_selectitem.empty().clientTable( list, {
              width: '100%',
              pagesize: 10,
              field: [ 'sel', 'cash_item_id', 'cash_item_code', 'item_name', 'item_type', 'price', 'saleinfo_id', 'ios_id', 'android_id',  'lumena', 'sale_yn', 'sale_place', 'detail' ],
              head: packageInfoHead,
              translate: {
                item_type      : info_item_type,
                sale_yn        : info_sale_yn,
                period_type    : info_period_type,
                period         : info_period,
                sale_place     : info_sale_place,

                saleinfo_id : function(value, name, row) {
                   var _com = $E('text').css({'width':75}).validate({required: true, onlynumber: true}).attr('readonly', true).attr('name', 'saleinfo_id').css("background","#eeeeee");
                   if (value > 0 ) _com.val(value).css({'color':'blue'});
                   else if (row.price > 0) _com.val('available').css({'color':'#ee4411'});
                   else _com.val('Not available').css({'color':'black'});;
                   return _com;
                 },

                price: function(v, cname, row){
                  return $E('lable').text( set_comma(v) + '$').css({'color':'red'});
                 },
              },
              add_column: {
                  'detail' : function(row){
                    var b_manage = $E('button').text('Info').button({icons:{primary:'ui-icon-zoomin'}}).css({width:70,height:30}).width('100px').click(function(){
                      try {
                        showCashItemDetail(row.cash_item_id);
                      }catch(e) {alert("[Error!]Cannot read iteminfo.")};
                    });
                    var b_delete = $E('button').text('Remove').button({icons:{primary:'ui-icon-trash'}}).css({width:70,height:30}).width('100px').click(function(){
                      try {
                        if (!confirm("Are you sure?")) return;
                        if (delCashItem(row.cash_item_id))
                          getCashItemList();
                      }catch(e) {alert("[Error!] Cannot remove iteminfo.")};
                    });

                    var d_info = $E('div').append(b_manage, ' ', b_delete);

                    return d_info;
                  }
              },

              filter_view       : true,
              filter            : filter,
              sort_field        : 'cash_item_id',                         // 기본 정렬 컬럼 명
              sort_asc          : false                                // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
          });


      var  div_info        = $E('div').css({'align':'center'}),
           div_bottom      = $E('div').css({'text-align':'left'}),

           b_sel_all       = $E('button').text('List all').button({icons:{primary:'ui-icon-search'}}).css({height:50}).click(function(){

            var filters = [];
            //filters.push({column:'saleinfo_id', keyword:'발급가능', type:'==', useType:true});
            getCashItemList(filters);

           }).appendTo(div_bottom),
           b_sel_able       = $E('button').text('List "In Schedule"').button({icons:{primary:'ui-icon-search'}}).css({height:50}).click(function(){

            var filters = [];
            filters.push({column:'saleinfo_id', keyword:'발급가능', type:'==', useType:true});
            getCashItemList(filters);

           }).appendTo(div_bottom),
           b_sel_reg       = $E('button').text('Make(SALEINFO_ID)').button().css({"color":"white", "height":50, "background":"#ee4411"}).click(function(){ goRegAll() }).appendTo(div_bottom);

           sub_selectitem.append('<br>').append(div_bottom);
      }

      getCashItemList();
    }

    function delCashItem(cash_item_id)
    {
        var list;
        menu.ajax({
          async      : false,
          methodcall : ['deleteCashItem'],
          data       : [cash_item_id],
          success    : function( result ){
            alert('선택한 상품이 성공적으로 삭제 되었습니다.');
          }
        });

        return true;
    }

    function goMakeCashItem()
    {
      div_guide.empty();
      sub_contents.win('remove_child');
      sub_contents_dual.win('hide');
      sub_contents.win('show');

      var sub_selectnew   = _drawWin( 'New product info', sub_contents, 0, 10, 560, 680);
      var sub_selectitem  = _drawWin( 'Package info',sub_contents, 0, 575, 745, 680);

      var div_info    = $E('div'),
          div_bottom  = $E('div').css({'text-align':'center'}).append('<br>');;

      var l_cash_item_id        = $E('lable').text('Make'),
          t_cash_item_code      = $E('text').val('').validate({onlynumber: true}).attr('readonly', true).css({'width':80}),
          l_cash_item_code      = $E('div').append( $E('radio', {name:'sel_item_code'}).val('auto').attr("checked", true).click(function(){

            t_cash_item_code.attr('readonly',true);

          }),  $E('lable').text('Make '), '<nbsp;>', $E('radio', {name:'sel_item_code'}).val('manual').attr("checked", false).click(function(){

            t_cash_item_code.attr('readonly',false);

          }) , $E('lable').text('Manual input : '), t_cash_item_code ),

          t_name                = $E('text').css({'width':250}),

          s_item_type           = $E('select').css({'width':180}).selectOptions( info_item_type, {sort:'value'} ).val('IT').change(function(){

            switch (this.value)
            {
              case "PK":
                $(sub_selectnew).find('table').find('tr').eq(4).css({'display':''});
                $(sub_selectnew).find('table').find('tr').eq(5).css({'display':'none'});
                $(sub_selectnew).find('table').find('tr').eq(6).css({'display':'none'});
                $(sub_selectnew).find('table').find('tr').eq(7).css({'display':'none'});

                break;

              case "VP":

                $(sub_selectnew).find('table').find('tr').eq(5).css({'display':''});
                $(sub_selectnew).find('table').find('tr').eq(6).css({'display':''});
                $(sub_selectnew).find('table').find('tr').eq(7).css({'display':''});

                break;

              case "IT":
              default:

                $(sub_selectnew).find('table').find('tr').eq(4).css({'display':'none'});
                $(sub_selectnew).find('table').find('tr').eq(5).css({'display':'none'});
                $(sub_selectnew).find('table').find('tr').eq(6).css({'display':'none'});
                $(sub_selectnew).find('table').find('tr').eq(7).css({'display':'none'});

                getGameItemList();
                break;
            }
            t_ref_item_id.html('');

          });

          var l_sub_item_type  = $E('div').append( $E('radio' , {name:'sel_sub_item_type'}).val('game').attr("checked", true).click(function(){

            getGameItemList();

          }),  $E('lable').text('GameItem '), '<nbsp;>', $E('radio', {name:'sel_sub_item_type'}).val('cash').attr("checked", false).click(function(){

            getCashItemList();

          }) , $E('lable').text('ChargedProduct ') ),

          s_vip_level       = $E('select').css({'width':180}).selectOptions( info_vip_level, {sort:'value'} ).val('1'),
          s_period_type         = $E('select').css({'width':180}).selectOptions( info_period_type, {sort:'value'} ).val('P'),
          t_period              = $E('text').val('0').validate({required: true, onlynumber: true}),
          t_price               = $E('text').val('0').validate({onlynumber: true}),
          t_saleinfo_id         = $E('lable').text('This field could be managed in menu 2.').css({'color':'red'}),
          t_description         = $E('textarea').css({width:350,height:80}).validate({maxLength: 8000}).val(''),
          t_short_description   = $E('textarea').css({width:350,height:40}).validate({maxLength: 8000}).val(''),

          s_sale_place          = $E('select').css({'width':180}).selectOptions( info_sale_place, {sort:'value'} ).val('A'),
          s_sale_yn             = $E('select').css({'width':180}).selectOptions( info_sale_yn, {sort:'value'} ).val('Y'),

          t_ref_item_id         = $E('select').css({'width':350, 'height':60}).attr({'multiple':'multiple'}),
          t_reward_money        = $E('text').val('0').validate({required: true, onlynumber: true}),
          //t_reward_medal        = $E('text').val('0').validate({required: true, onlynumber: true}),
          c_dup_yn              = $E('checkbox').attr("checked", false).val("Y"),

          t_ref_item_id_reset   = $E('button').text('Delete all').button({icons:{primary:'ui-icon-trash'}}).css({height:25}).click(function(){

            t_ref_item_id.html('');

          }),

          b_add         = $E('button').text('Make new product').button({icons:{primary:'ui-icon-check'}}).css({height:50}).appendTo(div_bottom).click(function(){

            var item_code_val;

            if ( $('input[name=sel_item_code]:checked').val() == 'auto' )
              item_code_val = 0;
            else {
              item_code_val = t_cash_item_code.val();
              if (t_cash_item_code.val() == '') return alert('Please input product id.');
            }

            if (t_name.val() == '') return alert('Please input product name.');
            if (s_item_type.val() == 'VP' && (t_period.val() == "" || isNaN(t_period.val()) == true )) return alert('Only numbers allowed(VIP Effect/count field)');
            if (t_price.val() == "" || isNaN(t_price.val()) == true ) return alert('Only Numbers allowed.');
            if (s_item_type.val() != 'LM' && s_item_type.val() != 'VP' && t_ref_item_id.html() == '') return alert('Insert package item more than one.');
            if (s_item_type.val() == 'LM' && (t_reward_money.val() <= 0 || isNaN(t_reward_money.val()) == true) ) return alert('Input rumena.');

            var ItemList = [];
            $(t_ref_item_id).find('option').each(function () {
              ItemList.push(this.value);
            });

            var dup_yn = c_dup_yn.is(":checked") == true?"Y":"N";

            menu.ajax({
              arrayArguments : true,
              methodcall : ['regCashItem'],
              data       : [ item_code_val, t_name.val(), s_item_type.val(), s_vip_level.val(), s_period_type.val(), t_period.val(), t_price.val(), t_description.val(), t_short_description.val(), s_sale_place.val(), s_sale_yn.val(),  t_reward_money.val(), ItemList, dup_yn],
              success    : function( result ){
                alert('completed.');
              }
            });
          });

          var selectnewTableHead = {
            l_cash_item_id : 'ITEM_ID',
            l_cash_item_code : 'CODE',
            t_name : 'Name',
            s_item_type : 'Type',
            l_sub_item_type : 'subType',
            s_vip_level : 'Vip_level',
            s_period_type : 'Period_type',
            t_period : 'Period',
            t_price : 'Price',
            t_saleinfo_id : 'Saleinfo_id',
            t_description : 'Description',
            t_short_description : 'Short_desc',
            s_sale_place : 'Sale_place',
            s_sale_yn : 'Sale_YN',
            t_reward_money : 'Reward_money'
          }

          sub_selectnew.verticalTable(
                  [
            [ l_cash_item_id, l_cash_item_code, t_name, s_item_type, l_sub_item_type, t_price, t_saleinfo_id, t_description, t_short_description,  s_sale_place, s_sale_yn, $E('div').append(t_ref_item_id).append(t_ref_item_id_reset), t_reward_money, $E('div').append(c_dup_yn, $E('lable').text('Cannot buy twice.'))  ]
          ],
          {head: ['ITEM_ID', 'CODE', 'Name', 'Type', 'subType', 'Price', 'Saleinfo_id', 'Description(PC)', 'Short_Desc', 'Sale_place', 'Sale_YN', 'Reward_item', 'Reward_money', 'Option']}).append(div_bottom);

          $(sub_selectnew).find('table').find('tr').eq(4).css({'display':'none'});
          $(sub_selectnew).find('table').find('tr').eq(5).css({'display':'none'});
          $(sub_selectnew).find('table').find('tr').eq(6).css({'display':'none'});
          $(sub_selectnew).find('table').find('tr').eq(7).css({'display':'none'});

          function getGameBoosterList()
          {
            var list;
            menu.ajax({
              async      : false,
              methodcall : ['getGameBoosterList'],
              data       : [],
              success    : function( result ){
                list = result;                              }
            });

            console.log(list);

            sub_selectitem.empty().clientTable( list, {
                  width: '100%',
                  pagesize: 14,
                  field: [ 'sel', 'seq_num', 'service', 'idx', 'code_name', 'buff_exp', 'buff_gold', 'booster_start', 'booster_end' ],
                  head: packageInfoHead,
                  translate: {
                    service        : info_service
                  },

                  add_column: {
                      'sel' : function(row){
                        var b_manage = $E('button').text('AddList').button({icons:{primary:'ui-icon-plus'}}).width('100px').click(function(){
                          try {

                             t_ref_item_id.html('');
                             t_name.val(row.code_name);
                             t_description.val(row.code_name);
                             t_ref_item_id.append("<option value='" + row.idx + "'>" + row.code_name + " (" + row.idx + ")</option>");

                          }catch(e) {alert("[오류!] 아이템을 추가할 수 없습니다.")};
                        });
                        return b_manage;
                      }
                  },
                  filter_view       : true,
                  sort_field        : 'seq_num',                         // 기본 정렬 컬럼 명
                  sort_asc          : false                                // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
              });
          }

          function getGameItemList()
          {

            if (gameitem_list.length == 0) {
              menu.ajax({
                async      : false,
                methodcall : ['getGameItemList'],
                data       : [],
                success    : function( result ){
                  gameitem_list = result;                              }
              });
            }

            sub_selectitem.empty().clientTable( gameitem_list, {
                  width: '100%',
                  pagesize: 14,
                  field: [ 'sel', 'desc', 'item_id', 'name', 'grade' ],
                  head: packageInfoHead,
                  add_column: {
                      'desc': function(row) { return $E('lable').text('GameItem') },
                      'sel' : function(row){
                        var b_manage = $E('button').text('AddList').button({icons:{primary:'ui-icon-plus'}}).width('100px').click(function(){
                          try {
                             if (s_item_type.val() == 'LM' || s_item_type.val() == 'VP' ) return alert('루메나 상품은 지급 아이템을 추가할 수 없습니다.');
                             if (s_item_type.val() != 'PK') t_ref_item_id.html('');
console.log(1);
                             var t_item_cnt = $E('text').val('1').validate({onlynumber: true}).css({'width':120});
                             var b_reg_item = $E('button').text('등록').button({icons:{primary:'ui-icon-plus'}}).width('100px').click(function(){
                               if (t_item_cnt.val() == "" || isNaN(t_item_cnt.val()) == true ) return alert('아이템 수량은 숫자만 입력해 주세요.');
                               t_ref_item_id.append("<option value='G|" + row.item_id + "|" + t_item_cnt.val() + "'>게임아이템|" + row.name + " (" + row.item_id + "|" + t_item_cnt.val() + "개)</option>");
                               div_item.dialog('close');
                             });
console.log(2);
                             var div_item = $E('div');
                             div_item.verticalTable([[ $E('lable').html(row.item_id), $E('lable').html(row.name), t_item_cnt, b_reg_item ]], {head: ['게임ItemID', '아이템명', '수량', '']})
                              .dialog({
                                  title: '게임아이템 수량 정보',
                                  stick: {
                                      right: b_manage
                                  }
                              });

                          }catch(e) {
                            console.log(e);
                            alert("[오류!] 아이템을 추가할 수 없습니다.")
                          };
                        });
                        return b_manage;
                      }
                  },
                  filter_view       : true,
                  sort_field        : 'name',                         // 기본 정렬 컬럼 명
                  sort_asc          : false                                // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
              });
          }

          function getCashItemList()
          {

            var list = {};
            menu.ajax({
              async      : false,
              methodcall : ['getCashItemList'],
              data       : [],
              success    : function( result ){
                list = result;
              }
            });

            sub_selectitem.empty().clientTable( list, {
                  width: '100%',
                  pagesize: 14,
                  field: [ 'sel', 'desc', 'cash_item_id', 'item_name', 'period_type', 'period','sale_yn' ],
                  head: packageInfoHead,
                  translate: {
                    sale_yn        : info_sale_yn,
                    period_type    : info_period_type,
                    period         : info_period
                  },

                  add_column: {
                      'desc': function(row) { return $E('lable').text('유료상품') },
                      'sel' : function(row){
                        var b_manage = $E('button').text('AddList').button({icons:{primary:'ui-icon-plus'}}).width('100px').click(function(){
                          try {
                             if (s_item_type.val() != 'PK' ) return alert('패키지 상품만 추가할 수 있습니다.');
                             if (s_item_type.val() != 'PK') t_ref_item_id.html('');
                             t_ref_item_id.append("<option value='C|" + row.cash_item_id + "|1'>유료상품|" + row.item_name + " (" + row.cash_item_id + ")</option>");

                          }catch(e) {alert("[오류!] 아이템을 추가할 수 없습니다.")};
                        });
                        return b_manage;
                      }
                  },
                  filter_view       : true,
                  sort_field        : 'cash_item_id',                         // 기본 정렬 컬럼 명
                  sort_asc          : false                                // true: 기본 정렬 방식을 오름차순으로 / false: 내림차순으로
              });

          }

          //getCashItemList();
          getGameItemList();
    }
  };

});

})(jQuery, this, this.document);
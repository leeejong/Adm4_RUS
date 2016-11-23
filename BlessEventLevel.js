/**
 * BlessEventLevel
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2015.12.10
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
  define('Bless/BlessEventLevel/getResultWindow', [], function () {
    return function (menu, title, width, height, top, left) {
      return $E('div').win({
        title: 'Result :: ' + title,
        parent: menu,
        top: top || 100,
        left: left || 705,
        width: width || 'auto',
        height: height || 'auto',
        buttonpane: true,
        screen_toggle: true,
        minimum: true,
        status: true,
        resizable: true,
        draggable: true,
        'extends': true
      });
    };
  });

  define(['Bless/BlessEventLevel/getResultWindow', 'adm/adm.sendProcess','beans/Bless/BlessDesc'], function (getResultWindow, sendProcess, Desc) {

    return function BlessEventLevel(arg1, arg2) {

      var menu = this;

      var lastEvent;
      var today = $adm.getDate('Y-m-d H:i:s', new Date())+'.0';

      menu.ajaxAsync('getLastLevelcareEvent').then(function (event) {
        lastEvent = event;
        setSetter();
        setDeleteWin();
        setFinder();
        setWhole();
      });

      var winSetter = $E('div').win({
        parent: menu,
        title: 'Setter',
        width: 350,
        height: 550,
        top: 0,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      var winFinder = $E('div').win({
        parent: menu,
        title: 'Finder',
        left: 705,
        top: 0,
        width: 250,
        height: 40,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      var winWhole = $E('div').win({
        parent: menu,
        title: 'Middle.BL_PT_ADM_002_03',
        left: 355,
        top: 0,
        width: 350,
        height: 700,
        buttonpane: false,
        close: false,
        screen_toggle: false,
        minimum: false,
        status: false,
        resizable: false,
        draggable: false,
        'extends': false
      });

      var winDelete = $E('div').win({
          parent: menu,
          title: 'deleteEvent',
          width: 350,
          height: 150,
          top: 555,
          buttonpane: false,
          close: false,
          screen_toggle: false,
          minimum: false,
          status: false,
          resizable: false,
          draggable: false,
          'extends': false
        });

      function setSetter(){
        var event  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(lastEvent),
              guardian  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(0),
              berserker  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(0),
              striker  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(0),
              ranger  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(0),
              mage  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(0),
              warlock  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(0),
              paladin  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(0),
              mystic  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(0),
              assassin  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(0),
              a2mage  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'99%'}).val(0);

        var b_insertEvent = $E('button').text('Set').button().css({'width': '99%'}).click(function () {

          if (!winSetter.validate()) return;
          if(!confirm('Are you sure?')) return;
          menu.ajaxAsync('insertEvent', event.val(), guardian.val(), berserker.val(), striker.val(), ranger.val(), mage.val(), warlock.val(), paladin.val(), mystic.val(), assassin.val(), a2mage.val()).then(function(){
            setWhole();
          });
        });

        winSetter.verticalTable([{
            'Event No#' : event,
            'Guardian' : guardian,
            'Berserker' : berserker,
            'Striker' : striker,
            'Ranger' : ranger,
            'Mage' : mage,
            'Warlock' : warlock,
            'Paladin' : paladin,
            'Mystic' : mystic,
            'Assassin' : assassin,
            'A2mage' : a2mage
          }], {width: '100%'}).append('<br/>', b_insertEvent);

      }

      function setDeleteWin() {
        winDelete.empty();
        var event = $E('text').val(0).css({'width':'99%','text-align':'center'}).validate({requried:true,onlynumber:true});
        winDelete.append(event);
        winDelete.append($E('button').button().text('Delete specifications about Event').css({'width': '99%', 'height': '60px'}).click(function () {
          if(!winDelete.validate()) return;
          if(confirm('Are you sure?'))
            menu.ajaxAsync('deleteEvent',event.val()).then(function(){
              alert('Complete.');
              setWhole();
            });
        }));
      }

      function setFinder(){
        winFinder.empty();
        var textfield  = $E('text').validate({required:true,onlynumber:true}).css({'text-align':'center',width:'180px',height:'20px'}).val(lastEvent).enterKey(doFind);
        var findbutton = $E('button').button().text('Search').css({'width':'40px','height':'25px'}).click(doFind);
        winFinder.append(textfield, findbutton);

        function doFind(){
          var resultWin = getResultWindow(menu, 'FindResult ->'+textfield.val(), 400 , 600);
          var where = [{type:'operator', operator:'=', column:'event_id', value:textfield.val()}];
          resultWin.clientTable(null,{
            field : ['event_id', 'class_type', 'cash_item_id'],
            head : ['EVENT_ID','CLASS','REWARD'],
            connect: {
              menu: menu,
              db: 'bless_middle',
              table: 'dbo.BL_PT_ADM_002_03',
              edit:['cash_item_id'],
              limit: 1000,
              where : where
            },
            sort : true,
            sort_field : 'class_type',
            sort_asc : true,
            pagesize : 13,
            width: '99%',
            translate :  { class_type : Desc.classTypeHud }
          });
        }
      }




      function setWhole(){
        winWhole.empty();
        winWhole.clientTable(null,{
          field : ['event_id', 'class_type', 'cash_item_id'],
          head : ['EVENT_ID','CLASS','REWARD'],
          connect: {
            menu: menu,
            db: 'bless_middle',
            table: 'dbo.BL_PT_ADM_002_03',
            edit:['cash_item_id'],
            delete:false,
            insert:false,
            limit: 1000,
          },
          sort : true,
          sort_field : 'event_id',
          sort_asc : true,
          pagesize : 18,
          width: '99%',
          translate :  {
            class_type : Desc.classTypeHud
          }
        });
      }
    }
  });

})(jQuery, this, this.document);

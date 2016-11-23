/**
 * BlessSyncXML
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2016.01.06
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

  /**
   * BlessSyncItemlist Menu
   * @param {mixed} arg1
   * @param {mixed} arg2
   */
  return function BlessSyncXML( arg1, arg2 ){

    var menu = this;

    var getXMLButton = $E('button').button().css({'width':80,'height':80,'textsize':50}).text('Get Iteminfo.xml').click(getXML),
          syncButton   = $E('button').button().css({'width':500,'height':80,'textsize':50}).text('Send to Real').click(sync),

          npcLocal = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('npcLocal').click(function(){getLocal('NPCInfo');}),
          itemLocal = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('itemLocal').click(function(){getLocal('ItemInfo');}),
          mountLocal = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('mountLocal').click(function(){getLocal('MountInfo');}),
          petLocal = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('petLocal').click(function(){getLocal('PetInfo');}),
          fellowLocal = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('fellowLocal').click(function(){getLocal('FellowInfo');}),
          skillLocal = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('skillLocal').click(function(){getLocal('PCSkillInfo');}),
          monsterbookLocal = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('monsterbookLocal').click(function(){getLocal('MonsterBookInfo');}),
          questLocal = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('questLocal').click(function(){getLocal('QuestInfo');}),

          npcField = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('npcField').click(function(){getField('NPCInfo');}),
          itemField = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('itemField').click(function(){getField('ItemInfo');}),
          mountField = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('mountField').click(function(){getField('MountInfo');}),
          petField = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('petField').click(function(){getField('PetInfo');}),
          fellowField = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('fellowField').click(function(){getField('FellowInfo');}),
          skillField = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('skillField').click(function(){getField('PCSkillInfo');}),
          monsterbookField = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('MonsterBookField').click(function(){getField('MonsterBookInfo');}),
          questField = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('questField').click(function(){getField('QuestInfo');}),
          buffField = $E('button').button().css({'width':100,'height':80,'textsize':50}).text('BuffField').click(function(){getField('AccountInfo');}),

          testButton = $E('button').button().css({'width':80,'height':80,'textsize':50}).text('TEST').click(function(){alert('Be Careful');});

    if( $adm.getConfig('Server').EnvLocation === 'dev' ){
      menu.append(testButton);
      menu.append(npcField).append(itemField).append(mountField).append(petField).append(fellowField).append(skillField).append(monsterbookField).append(questField).append(buffField);
      menu.append('<br>');
      menu.append(getXMLButton);
      menu.append(npcLocal).append(itemLocal).append(mountLocal).append(petLocal).append(fellowLocal).append(skillLocal).append(monsterbookLocal).append(questLocal);
    }
    else{
      menu.append(syncButton);
    }

    function getXML(){
      if(confirm('Are you sure?')){
        alert('This process can take more then 10 second');
        menu.ajaxAsync('getXML', 'item').then(function(r){
          alert(r[0]+'row(s) affected');
          var resultWin = $E('div').win({
            title         : 'Result',
            parent        : menu,
            top           : 175,
            left          : 0,
            width         : 1400,
            height        : 500,
            buttonpane    : false,
            close         : true,
            screen_toggle : false,
            minimum       : false,
            status        : false,
            resizable     : false,
            draggable     : false,
            'extends'     : false
          });
          resultWin.clientTable(r[1],{
            field :  ['item_id','name','grade','usable_class','usable_minlv'],
            width : '100%',
            height : '480',
            pagesize : 16
          });
        });
      }
    }

    function getLocal( target ){
      if(confirm('Are you sure?')){
        alert('This process can take more then 10 second');
        menu.ajaxAsync('getLocal', target).then(function(r){
          alert(r[0]+' row(s) affected');
          var resultWin = $E('div').win({
            title         : 'Result',
            parent        : menu,
            top           : 175,
            left          : 0,
            width         : 1400,
            //height        : 'auto',
            buttonpane    : false,
            close         : true,
            screen_toggle : false,
            minimum       : false,
            status        : false,
            resizable     : false,
            draggable     : false,
            'extends'     : false
          });
          resultWin.clientTable(r[1],{
            field :  ['file_name','field_name','local_name'],
            width : '100%',
            pagesize : 16
          });
        });
      }
    }

    function getField( target ){
      if(confirm('Are you sure?')){
        alert('This process can take more then 10 second');
        menu.ajaxAsync('getField', target).then(function(r){
          alert(r[0]+' row(s) affected');
          var resultWin = $E('div').win({
            title         : 'Result',
            parent        : menu,
            top           : 175,
            left          : 0,
            width         : 1400,
            //height        : 'auto',
            buttonpane    : false,
            close         : true,
            screen_toggle : false,
            minimum       : false,
            status        : false,
            resizable     : false,
            draggable     : false,
            'extends'     : false
          });
          resultWin.clientTable(r[1],{
            field :  ['file_name','cid','field_name','reg_date'],
            width : '100%',
            pagesize : 16
          });
        });
      }
    }

    function sync(){
      if(confirm('Are you sure??'))
        menu.ajaxAsync('syncItemlist', 'item').then(function(r){alert('Complete'+r);});
    }

  };

});

})(jQuery, this, this.document);
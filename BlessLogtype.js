/**
 * BlessLogtype
 * ADM 4.0 JavaScript Menu
 * @author leeejong@neowiz.com 2016.3.8
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
  define('Bless/BlessLogtype/getWin', [], function () {
    return function (menu, title, width, height, top, left) {
      return $E('div').win({
        title: title,
        parent: menu,
        top: top || 0,
        left: left || 0,
        width: width || 'auto',
        height: height || 'auto',
        buttonpane: false,
        screen_toggle: true,
        minimum: true,
        status: true,
        resizable: true,
        draggable: true,
        'extends': false
      });
    };
  });

  define(['Bless/BlessLogtype/getWin', 'beans/Bless/BlessDesc'], function (getWin, Desc) {

    return function BlessLogtype(arg1, arg2) {

      var menu = this;
      var isDev = $adm.getConfig('Server').EnvLocation === 'dev';
      var setterSize = 0;
      if(isDev) setterSize = 350;

      var winSetter = getWin(menu, 'Setter', setterSize, 600),
          winSync = getWin(menu, 'Sync', setterSize, 110, 600);

      if(isDev){ setSetter(); setSync(); }
      setViewer(isDev);

      function setSetter() { //log_type, upload_yn, code_name, code_desc
        var logtype = $E('text').validate({required: true, onlynumber: true, maxlength: 6}).css({'text-align': 'center', width: '99%'}),
            upload = $E('text').validate({required: true, onlynumber: false, maxlength: 1}).css({'text-align': 'center', width: '99%'}),
            codename = $E('text').validate({required: true, onlynumber: false, maxlength: 20}).css({'text-align': 'center', width: '99%'}),
            desc = $E('textarea').css({width:'99%',height:140}).css("background","#E1E1E1"),
            b_insertLogtype = $E('button').text('Insert').button().css({'width': '99%'}).click(function () {
              if (!winSetter.validate()) return;
              menu.ajaxAsync('insertLogtype', logtype.val(), upload.val(), codename.val(), desc.val(), function (r) {
                alert('Complete.');
                setViewer(isDev);
              });
            });

        winSetter.verticalTable([{
          'LOG_TYPE': logtype,
          'UPLOAD_YN': upload,
          'CODE_NAME': codename,
          'CODE_DESCRIPTION': desc
        }], {width: '100%'}).append('<br/>', b_insertLogtype);

      } // 14명, 15일 저녁7시  031 8060 2150
      function setSync() {
        if(!winSync.validate()) return;
        winSync.empty();
        winSync.append($E('button').button().text('Dev->Live Sync').css({'width': '99%', 'height': '60px'}).click(function () {
          if(confirm('Are you sure?'))
            menu.ajaxAsync('syncEvent').then(function(){alert('Sync Complete');});
        }));
      }
      function setViewer(isDev) {
        var winViewer = getWin(menu, 'LogType Viewer', 1400, 710, 0, setterSize);
        var viewerField = ['log_type','upload_yn','code_name','code_desc'],
            viewerHead  = ['LOG_TYPE','UPLOAD_YN','CODE_NAME','CODE_DESCRIPTION'],
            viewerSize  = [100,100,100,'*'];
        if(isDev){
          winViewer.buttonTab([{
            name: 'LOG_1',
            contents: $adm.clientTable(null, {
              field : viewerField,
              head  : viewerHead,
              size  : viewerSize,
              connect: {
                menu: menu,
                db: 'bless_logw_01',
                table: 'BL_BT_UPLOAD_LOGTYPE',
                edit: ['*'],
                'delete' : true,
                insert: false,
                limit: 1000
              },
              sort_field : 'log_type',
              sort_asc : true,
              pagesize: 14,
              width: '100%'
            })
          }]);
        }
        else{
          winViewer.buttonTab([
            {
              name: 'LOG_1',
              contents: $adm.clientTable(null, {
                field : viewerField,
                head  : viewerHead,
                size  : viewerSize,
                connect: {
                  menu: menu,
                  db: 'bless_logw_01',
                  table: 'BL_BT_UPLOAD_LOGTYPE',
                  insert: false,
                  limit: 1000
                },
                sort_field : 'log_type',
                sort_asc : true,
                pagesize: 14,
                width: '100%'
              })
            }
          ]);
        }
      }

    };
  });
})(jQuery, this, this.document);

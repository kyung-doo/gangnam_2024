
export const injectScript = `
   (function () {
      function wrap(fn) {
         return function wrapper() {
            var res = fn.apply(this, arguments);
            const msg = { name: 'navStateChange', data: ''};
            window.ReactNativeWebView.postMessage(JSON.stringify(msg));
            return res;
         }
      }

      history.pushState = wrap(history.pushState);
      history.replaceState = wrap(history.replaceState);
      window.addEventListener('popstate', function() {
         const msg = { name: 'navStateChange', data: ''};
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      });

      window.doDownLoadUploader = function (attach_idx, file_seq, auth, attach_mode) {
         var url = '/NGLMS/downLoad_ex.do?attach_idx=' + attach_idx + '&file_seq=' + file_seq + '&e=' + auth+'&attach_mode='+attach_mode;
         const msg = { name: 'download', data: url};
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }

      window.ReactNativeWebView.alertCallback = null;

      window.ReactNativeWebView.alert = function (message, callback) {
         window.ReactNativeWebView.alertCallback = callback;
         const msg = { name: 'alert', data: message }
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }

      window.ReactNativeWebView.alertEnter = function () {
         if(window.ReactNativeWebView.alertCallback) {
            window.ReactNativeWebView.alertCallback();
            window.ReactNativeWebView.alertCallback = null;
         }
      }

      window.ReactNativeWebView.confirmCallback = null;

      window.ReactNativeWebView.confirm = function (message, callback) {
         window.ReactNativeWebView.confirmCallback = callback;
         const msg = { name: 'confirm', data: message }
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }

      window.ReactNativeWebView.confirmEnter = function () {
         if(window.ReactNativeWebView.confirmCallback) {
            window.ReactNativeWebView.confirmCallback(true);
            window.ReactNativeWebView.confirmCallback = null;
         }
      }

      window.ReactNativeWebView.confirmCancel = function () {
         if(window.ReactNativeWebView.confirmCallback) {
            window.ReactNativeWebView.confirmCallback(false);
            window.ReactNativeWebView.confirmCallback = null;
         }
      }

      window.ReactNativeWebView.resetPushCount = function () {
         const msg = { name: 'resetPushCount', data: ''};
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }

      window.ReactNativeWebView.changeGrade = function ( grade ) {
         const msg = { name: 'changeGrade', data: grade};
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }

      window.findGetParameter = function ( parameterName ) {
         var result = null;
         var tmp = [];
         window.location.search
             .substr(1)
             .split("&")
             .forEach(function (item) {
               tmp = item.split("=");
               if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
             });
         return result;
      }

      window.fnPopZipcodeNew = function () {
         const msg = { name: 'showAddress', data: ''};
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }

      window.schoolSelect = function () {
         const msg = { name: 'showSchool', data: ''};
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }

      window.schoolCallBack = function(str1, str2, str3, str4, str5, str6) {
         document.joinForm.school_seq.value = str1;
         document.joinForm.school_nm.value = str2;
         document.joinForm.code_school_gb.value = str5;
         document.joinForm.school_gb_nm.value = str6;
      }

      setTimeout(function () {
         if(window.findGetParameter("loginsuccess") || window.findGetParameter("logoutsuccess")) {
            window.ReactNativeWebView.resetPushCount();
         }
      });

   })();
`;

export const injectOpenWindowScript = `
   (function () {
      window.ReactNativeWebView.jusoCallBack = function(roadAddrPart1, addrDetail, zipNo) {
         const msg = { 
            name: 'juso', 
            data: { 
               roadAddrPart1: roadAddrPart1,
               addrDetail: addrDetail,
               zipNo: zipNo
            }
         };
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }
      
      window.ReactNativeWebView.addSchool_func = function(str1, str2, str3, str4, str5, str6) {
         const msg = { 
            name: 'school', 
            data: { str1: str1, str2: str2, str3: str3, str4: str4, str5: str5, str6: str6 }
         };
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }

      window.popClose = function () {
         const msg = { name: 'close', data: ''};
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }

      window.self.close = function () {
         const msg = { name: 'close', data: ''};
         window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }
   })();
`;

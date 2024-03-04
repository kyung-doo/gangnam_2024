import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { BackHandler, Linking, Platform, StyleSheet, View, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import RNExitApp from 'react-native-exit-app';
import { injectScript } from '../utils/WebviewScript';
import Message, { Props as MessageProps} from './Message';
import { ShouldStartLoadRequest, WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import SendIntentAndroid from 'react-native-send-intent';
import NetworkError from './NetworkError';
import Loading from './Loading';
import { KOLLUS_STORE_URL, TEST_HTML_URL, APP_OPEN_FAILED, APP_EXIT_MESSAGE, MAIN_PATH, USER_HIGH_MAIN_PATH, USER_MIDDLE_MAIN_PATH, MY_PAGE_HIGH_PATH, MY_PAGE_MIDDLE_PATH, CONFIG_PATH, FILE_PERMISSION_MESSAGE, FILE_DOWN_MESSAGE, PUSH_COUNT_PATH, PUSH_HIGH_LIST_PATH, PUSH_MIDDLE_LIST_PATH, RECOMMEND_MIDDLE_PATH, RECOMMEND_HIGH_PATH, INTRO_PATH, FIND_ZIPCODE_PATH, FIND_SCHOOL_PATH } from '../utils/Constant';
import Filedownloader from '../utils/Filedownloader';
import { requestLocalStorage } from '../utils/Permission';
import FootMenu from './FootMenu';
import OpenWindow from './OpenWindow';


export interface Props {
  initUrl: string;
}

export interface Refs {
  changeUrl: ( path: string ) => void;
  fetchNotifyCount: () => void;
}


const Main = forwardRef<Refs, Props>(({ initUrl }, ref) => {

  const webview = useRef<WebView>(null);
  const [message, setMessage] = useState<MessageProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isReload, setIsReload] = useState<boolean>(true);
  const [notifyCount, setnotifyCount] = useState<number>(0);
  const [openWindow, setOpenWindow] = useState<string>('');
  const isCanGoBack = useRef<boolean>(false);
  
  const currentUrl = useRef<string>(initUrl === MAIN_PATH ? `${globalVars.baseUrl}${initUrl}?deviceId=${globalVars.deviceId}` : `${globalVars.baseUrl}${initUrl}`);
  


  const onPressHardwareBack = () => {
    if(message) return true;
    if(openWindow){
      onCloseWindow(null);
      return true;
    } 

    console.log('[BACK] : ' + isCanGoBack.current);

    if(webview.current) {
      if(isCanGoBack.current) {
        if(currentUrl.current.includes('UserMain.do') || currentUrl.current.includes(MAIN_PATH) || currentUrl.current.includes(INTRO_PATH)) {
          setExitMessage();
        } else {
          if(currentUrl.current.includes(RECOMMEND_MIDDLE_PATH) || 
            currentUrl.current.includes(RECOMMEND_HIGH_PATH) ||
            currentUrl.current.includes(MY_PAGE_MIDDLE_PATH) ||
            currentUrl.current.includes(MY_PAGE_HIGH_PATH) ||
            currentUrl.current.includes(PUSH_MIDDLE_LIST_PATH) ||
            currentUrl.current.includes(PUSH_HIGH_LIST_PATH) ||
            currentUrl.current.includes(CONFIG_PATH)) {
            webview.current?.injectJavaScript(`location.href="${globalVars.baseUrl + MAIN_PATH}"`);    
          } else {
            webview.current.goBack();
          }
          setTimeout(() => setLoading(false), 1000);
        }
      } else {
        if(currentUrl.current.includes('UserMain.do') || currentUrl.current.includes(MAIN_PATH) || currentUrl.current.includes(INTRO_PATH)) {
          setExitMessage();
        } else {
          webview.current?.injectJavaScript(`location.href="${globalVars.baseUrl + MAIN_PATH}"`);
        }
      }
    }
    return true;
  };

  const setExitMessage = () => {
    setMessage({
      message: APP_EXIT_MESSAGE,
      showCancelButton: true,
      onEnter: () => {
        if(Platform.OS === 'ios') RNExitApp.exitApp();
        else                      BackHandler.exitApp();
        setMessage(null);
      },
      onCancel: () => setMessage(null)
    });
  }


  const onMessage = ( e: WebViewMessageEvent ) => {
    const msg = JSON.parse(e.nativeEvent.data);
    console.log('onMessage: ', msg.name, msg.data);
    
    switch(msg.name) {
      case 'alert' : 
        setMessage({
          message: msg.data,
          onEnter: () => {
            webview.current?.injectJavaScript('window.ReactNativeWebView.alertEnter()');
            setMessage(null);
          }
        });
      break;
      case 'confirm' : 
        setMessage({
          message: msg.data,
          showCancelButton: true,
          onEnter: () => {
            webview.current?.injectJavaScript('window.ReactNativeWebView.confirmEnter()');
            setMessage(null);
          },
          onCancel: () => {
            webview.current?.injectJavaScript('window.ReactNativeWebView.confirmCancel()');
            setMessage(null);
          }
        });
      break;
      case 'navStateChange' : 
        isCanGoBack.current = e.nativeEvent.canGoBack;
      break;
      case 'download' : 
        if(Platform.OS === 'android') {
          AsyncStorage.getItem('permission').then(val => {
            if(val === 'Y') {
              fetchDownloadFile(msg.data);
            } else {
              requestLocalStorage()
              .then(() => {
                AsyncStorage.setItem('permission', 'Y');
                fetchDownloadFile(msg.data);
              })
              .catch(()=>{
                setMessage({
                  message: FILE_PERMISSION_MESSAGE,
                  onEnter: () => {
                    if(NativeModules.OpenExternalURLModule){
                      NativeModules.OpenExternalURLModule.linkAndroidSettings();
                    }
                    setMessage(null);
                  }
                });
              });
            }
          });
        } else {
          fetchDownloadFile(msg.data);
        }
      break;
      case 'resetPushCount' : 
        fetchNotifyCount();
      break;
      case 'changeGrade' : 
        AsyncStorage.setItem('grade', msg.data);
      break;
      case 'showAddress' : 
        setOpenWindow(`${globalVars.baseUrl}${FIND_ZIPCODE_PATH}`);
      break;
      case 'showSchool' : 
        setOpenWindow(`${globalVars.baseUrl}${FIND_SCHOOL_PATH}`);
      break;
    }
  }

  const fetchDownloadFile = ( path: string ) => {
    fetch(`${globalVars.baseUrl + path}`)
    .then( async res => {
      try{
        const { result } = await res.json();
        setMessage({
          message: FILE_DOWN_MESSAGE,
          showCancelButton: true,
          onEnter: () => {
            Filedownloader.start(result).catch(err => {
              console.log(err);
            });
            setMessage(null);
          },
          onCancel: () => setMessage(null)
        });
      } catch(err) {console.log(err)}
    })
    .catch( err => {
      console.log(err)
    })
  }

  const onNavigationChange =  (e: WebViewNavigation )  => {
    console.log('onMavChange: ', e);
    if( e.url === currentUrl.current ) setLoading(false);
    if (e.url.startsWith('http://') || e.url.startsWith('https://') || e.url.startsWith('about:blank')) {
      currentUrl.current = e.url;
      isCanGoBack.current = e.canGoBack;
    }
  }

  const onShouldStartLoadWithRequest = (e: ShouldStartLoadRequest) => {
    console.log('onStartLoadReq: ', e)
    if (e.url.startsWith('http://') || e.url.startsWith('https://') || e.url.startsWith('about:blank')) {
      if(e.url.includes('thecloudgate.io/webchat') || e.url.includes('v.kr.kollus') || e.url.includes('youtube.com')) {
        Linking.openURL(e.url);
        return false;
      } else {
        isCanGoBack.current = e.canGoBack;
        return true;
      }
    }
    
    if(Platform.OS === 'android') {
      SendIntentAndroid.openAppWithUri(e.url)
      .catch((err)=>{
        console.log('error', err );
      });
    } else {
      Linking.openURL(e.url)
      .catch((err)=>{
        console.log('error', err );
        if(e.url.startsWith('kollus://')) {
          Linking.openURL(KOLLUS_STORE_URL);
        } else {
          setMessage({
            message: APP_OPEN_FAILED,
            onEnter: () => setMessage(null)
          });
        }
      });
    }
    
    return false;
  }

  const onFootMenuClick = async ( idx: number ) => {
    let path = '';
    const grade = await AsyncStorage.getItem("grade");
    
    switch(idx) {
      case 0 : path = grade === 'M' ? USER_MIDDLE_MAIN_PATH : USER_HIGH_MAIN_PATH; break;
      case 1 : path = grade === 'M' ? RECOMMEND_MIDDLE_PATH : RECOMMEND_HIGH_PATH; break;
      case 2 : path = grade === 'M' ? MY_PAGE_MIDDLE_PATH : MY_PAGE_HIGH_PATH; break;
      case 3 : path = grade === 'M' ? PUSH_MIDDLE_LIST_PATH : PUSH_HIGH_LIST_PATH; break;
      case 4 : path = CONFIG_PATH; break;
      case 5 : onPressHardwareBack(); break;
    }
    
    if(path && !currentUrl.current.includes(path)) {
      if(path === MAIN_PATH && currentUrl.current.includes(MAIN_PATH)) { return; } 
      else {
        webview.current?.injectJavaScript(`location.href="${globalVars.baseUrl + path}"`);
      }
    }
  }

  const fetchNotifyCount = () => {

    const params: any = {
      app_deviceId: globalVars.deviceId,
      app_deviceNm: globalVars.deviceName,
      app_deviceDiv: `S-APP-${Platform.OS.toLocaleUpperCase()}`
    };

    const query = Object.keys(params).map(k => k + '=' + params[k]).join('&');

    fetch(`${globalVars.baseUrl}${PUSH_COUNT_PATH}?${query}`)
    .then( async res => {
      try {
        const { result } = await res.json();
        setnotifyCount(result);
      } catch(err) {console.log(err)}
    })
    .catch( err => {
      console.log(err)
    });
  }

  const onCloseWindow = ( datas: any ) => {
    if(datas){
      const { name, data } = datas;
      if(name === "juso"){
        webview.current?.injectJavaScript(`jusoCallBack("${data.roadAddrPart1}", "${data.addrDetail}", "${data.zipNo}");`);
      }
      else if(name === "school"){
        webview.current?.injectJavaScript(`schoolCallBack("${data.str1}", "${data.str2}", "${data.str3}", "${data.str4}", "${data.str5}", "${data.str6}");`);
      }
    }
    setOpenWindow('');
  }

  useImperativeHandle(ref, () => ({
    changeUrl: ( path ) => {
      webview.current?.injectJavaScript(`location.href="${globalVars.baseUrl + path}"`);
    },
    fetchNotifyCount: fetchNotifyCount
  }));


  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onPressHardwareBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onPressHardwareBack);
    }
  }, [openWindow, message]);

  useEffect(() => {
    fetchNotifyCount();
  }, []);


  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <WebView
          ref={webview}
          originWhitelist={['*']}
          sharedCookiesEnabled={true}
          source={{ uri: initUrl === MAIN_PATH ? `${globalVars.baseUrl}${initUrl}?deviceId=${globalVars.deviceId}` : `${globalVars.baseUrl}${initUrl}` }}
          // source={{ uri: TEST_HTML_URL }}
          style={styles.webview}
          cacheEnabled={false}
          userAgent={globalVars.getUserAgent()}
          onMessage={onMessage}
          onNavigationStateChange={onNavigationChange}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          injectedJavaScript={injectScript}
          onLoadStart={( e ) =>{
            setOpenWindow('');
            setLoading(true);
            setIsReload(false);
          }}
          bounces={false}
          onLoadEnd={( e ) => {
            
            setTimeout(() => {
              setLoading(false);
            }, 150);
          }}
          onError={( e ) => console.log('onWebviewError: ', e)}
          renderError={() => {
            setIsReload(true);
            return <NetworkError onReload={() => webview.current?.injectJavaScript(`location.href="${globalVars.baseUrl + MAIN_PATH}"`)} />
          }} />

          {openWindow !== '' && 
            <OpenWindow 
              url={openWindow} 
              onClose={onCloseWindow} />
          }
      </View>
        
      <FootMenu 
        onFootMenuClick={onFootMenuClick}
        notifyCount={notifyCount}
        currentUrl={currentUrl.current} />

      {loading && <Loading isReload={isReload} />}
      
      {message && 
        <Message {...message} />
      }
      
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container:{
    flex: 1
  },
  webview: {
    flex: 1,
    width: '100%', 
    height: '100%'
  }
});

export default Main;

import React, { FC, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Platform, SafeAreaView, StatusBar, useColorScheme, Linking, AppState, View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Main, { Refs as mainRef} from './components/Main';
import SplashScreen from 'react-native-splash-screen';
import Testgate from './components/Testgate';
import { requestLocalStorage } from './utils/Permission';
import FCMService from './utils/FCMService';
import Message, { Props as MessageProps } from './components/Message';
import NotifyService from './utils/NotifyService';
import { APP_STORE_URL, APP_UDATE_MESSAGE, CONFIG_PATH, MAIN_PATH, NOTIFY_PERMISSION_MESSAGE, PLAY_STORE_URL, PUSH_CONFIG_PATH, PUSH_PERMISSION_MESSAGE } from './utils/Constant';
import VersionCheck from 'react-native-version-check';
import IntroPermission from './components/IntroPermission';
import PushNightCheck from './components/PushNightCheck';
import messaging from '@react-native-firebase/messaging';
import { requestNotifications } from "react-native-permissions";
import './global';




const AppMain: FC = () => {
  
   const [message, setMessage] = useState<MessageProps | null>(null);
   const [initUrl, setInitUrl] = useState<string>(MAIN_PATH);
   const [showMain, setShowMain] = useState<boolean>(false);

   const appState = useRef(AppState.currentState);
   const mainRef = useRef<mainRef>(null);
   const isReady = useRef<boolean>(false);
   

   const onRegister = ( token: string ) => {
      AsyncStorage.getItem('fcmToken')
      .then( t => {
         if(!t) AsyncStorage.setItem('fcmToken', token);
      })
      .catch(() => {
         AsyncStorage.setItem('fcmToken', token);
      });
      console.log('[App] onRegister : token :', token);
   }

   const onRequestPermissionFailed = () => {
      setMessage({
         message: NOTIFY_PERMISSION_MESSAGE,
         onEnter: () => {
            Linking.openSettings();
            setMessage(null);
         }
      });
   }

   const onNotification = (notify: any, data: any) => {
      console.log('[App] onNotification : ', notify, data);
      const options = {
         soundName: 'default',
         playSound: true,
      };
      NotifyService.showNotification(
         '0',
         notify.title,
         notify.body,
         data,
         options,
      );
      mainRef.current?.fetchNotifyCount();
   }

   const onOpenNotification = (notify: any) => {
      console.log('[App] onOpenNotification : notify :', notify);
      const link = notify.data.item ? notify.data.item.link : notify.data.link;
      if(link) {
         if(isReady.current) mainRef.current!.changeUrl(link);
         else                setInitUrl(link);
      }
   }

   const checkVersion = () => {
      VersionCheck.getLatestVersion()
      .then(latestVersion => {
         const currentVersion = VersionCheck.getCurrentVersion();
         globalVars.latestVersion = latestVersion;
         globalVars.currentVersion = currentVersion;
         let currentNum = parseInt(currentVersion.split('.').join(''));
         const latestNum = parseInt(latestVersion.split('.').join(''));
         console.log('currentVersion', currentNum, 'latestVersion', latestNum);
         if(currentNum < latestNum) {
            setMessage({
               message: '업데이트 알림',
               desc: APP_UDATE_MESSAGE,
               enterText: '업데이트',
               cancelText: '나중에',
               showCancelButton: true,
               onEnter: () => {
                  Linking.openURL(Platform.OS === 'android' ? PLAY_STORE_URL: APP_STORE_URL );
                  setMessage(null);
               },
               onCancel: () => setMessage(null)
            });
         }
      });
   }

   const checkPush = (isPush: boolean, isNight: boolean) => {
      setMessage(null);
      setShowMain(true);
      AsyncStorage.setItem('initPushPermission', 'Y');
      AsyncStorage.getItem('fcmToken').then(token => {
         const params: any = {
            deviceId: globalVars.deviceId,
            setPushMarketing: isPush ? 'Y': 'N',
            setPushNight: isNight ? 'Y' : 'N',
            deviceName: globalVars.deviceName,
            deviceDiv: 'S-APP-' + Platform.OS.toLocaleUpperCase(),
            deviceToken: token
         };
         const query = Object.keys(params).map(k => k + '=' + params[k]).join('&');
         console.log('[APP] checkPush : ', query);
         fetch(`${globalVars.baseUrl}${PUSH_CONFIG_PATH}?${query}`);
      });
   }


   useEffect(() => {
      
      const subcription = AppState.addEventListener('change', nextAppState => {
         if (appState.current.match(/inactive|background/) && nextAppState === "active") {
            checkVersion();
            mainRef.current?.fetchNotifyCount();
         }
         appState.current = nextAppState;
      });

      checkVersion();

      FCMService.registerAppWithFCM();
      FCMService.register(onRegister, onNotification, onOpenNotification, onRequestPermissionFailed);
      NotifyService.configure(onOpenNotification);
      
      // AsyncStorage.setItem('noticeTopic', 'Y')
      // .then(() => FCMService.registerTopic('notice'));

      AsyncStorage.getItem('initPushPermission')
      .then( val => {
         if(val) setShowMain(true);
      });

      setTimeout(() => {
         isReady.current = true;
         AsyncStorage.getItem('initPushPermission')
         .then( val => {
            if(!val) {
               let isPushNight = false;
               setMessage({
                  message: '강남인강 알림 설정 안내',
                  desc: PUSH_PERMISSION_MESSAGE,
                  enterText: '동의',
                  cancelText: '거부',
                  showCancelButton: true,
                  extra: <PushNightCheck onNightCheck={val => isPushNight = val} />,
                  onEnter: () => checkPush(true, isPushNight),
                  onCancel: () => checkPush(false, isPushNight)
               });
            }
         });
      }, 1500);

      return () => {
         subcription.remove();
      }
   }, []);
  
  
   return (
      <View style={{flex: 1}}>
         {showMain &&
            <Main ref={mainRef} initUrl={initUrl} />
         }
         {message && 
            <Message {...message} />
         }
      </View>
   );
};


const App: FC = () => {
   const [isTest, setIsTest] = useState<boolean>(false);
   const [initPermission, setInitPermission] = useState<boolean>(false);
   const isDarkMode = useColorScheme() === 'dark';
   const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
   };

   const onPermissionEnter = async () => {
      if(Platform.OS === 'android') {
         await checkPushPermission ();
         requestLocalStorage()
         .then(() => {
            goAppMain();
            AsyncStorage.setItem('permission', 'Y');
         })
         .catch(() => {
            goAppMain();
            AsyncStorage.setItem('permission', 'N');
         });
      } 
      // else {
      //    messaging()
      //    .requestPermission()
      //    .then(enabled => {
      //       if(enabled) {
      //          goAppMain();
      //       } else {
      //          Linking.openSettings();
      //       }
      //    });
      // } 
   }

   const checkPushPermission = async () => {
      const permission = await requestNotifications(["alert", "sound"]);
      return permission.status == "granted";
   }

   const goAppMain = () => {
      AsyncStorage.getItem('initPermission')
      .then(val => {
         if(!val) AsyncStorage.setItem('initPermission', 'Y');
      });
      setInitPermission(true);
   }

   useLayoutEffect(() => {
      AsyncStorage.getItem('initPermission')
      .then(val => {
         setInitPermission(val === 'Y' ? true : false);
      });
   }, []);

   useEffect(() => {
      setTimeout(() => {
         SplashScreen.hide();
      }, 1500);
   }, []);

   return (
      <SafeAreaView style={{flex: 1, ...backgroundStyle}}>
         <StatusBar backgroundColor={'#eee'} barStyle={'dark-content'} />
         {isTest 
         ?
         <Testgate onExit={() => setIsTest(false)} />
         :
            initPermission 
            ?
            <AppMain />
            :
            <IntroPermission onPermissionEnter={onPermissionEnter} goAppMain={goAppMain}/>
         }
      </SafeAreaView>
   );
}


export default App;

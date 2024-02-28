import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';


class FCMService {

   private unsubcribe: () => void = () => {};

   public register (
      onRegister: (token: string) => void, 
      onNotification: (notify: any, data: any) => void, 
      onOpenNotification: (notify: any) => void,
      onRequestPermissionFailed: () => void
   ) {
      this.checkPermission(onRegister, onRequestPermissionFailed);
      this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
   }

   public registerAppWithFCM () {
      if (Platform.OS === 'ios') {
         messaging().setAutoInitEnabled(true);
      }
   }

   private checkPermission ( onRegister: (token: string) => void, onRequestPermissionFailed: () => void ) {
      messaging()
      .hasPermission()
      .then(enabled => {
         if (enabled) {
            this.getToken(onRegister);
         } else {
            this.requestPermission(onRegister, onRequestPermissionFailed);
         }
         console.log('[FCMService] Permission enabled ', enabled);
      })
      .catch(error => {
         console.log('[FCMService] Permission rejected ', error);
      });
   }

   private getToken (onRegister: (token: string) => void) {
      messaging()
      .getToken()
      .then(fcmToken => {
         if (fcmToken) {
            onRegister(fcmToken);
         } else {
            console.log('[FCMService] User does not have a device token');
         }
      })
      .catch(error => {
         console.log('[FCMService] getToken rejected', error);
      });
   }

   public deleteToken() {
      messaging()
      .deleteToken()
      .catch(error => {
         console.log('[FCMService] Delete token error', error);
      });
   }

   private requestPermission (onRegister: (token: string) => void, onRequestPermissionFailed: () => void) {
      messaging()
      .requestPermission()
      .then(enabled => {
         console.log('[FCMService] Request Permission enabled', enabled);
         if(enabled) {
            this.getToken(onRegister);
         } else {
            onRequestPermissionFailed();
         }
      })
      .catch(error => {
         console.log('[FCMService] Request Permission rejected', error);
      });
   }

   private createNotificationListeners (
      onRegister: (token: string) => void, 
      onNotification: (notify: any, data: any) => void, 
      onOpenNotification: (notify: any) => void
   ) {

      messaging().onNotificationOpenedApp(remoteMessage => {
         if (remoteMessage) {
            const notification: any = remoteMessage.notification;
            if(!notification.data) notification.data = remoteMessage.data;
            console.log('[FCMService] onNotificationOpenedApp', remoteMessage);
            onOpenNotification(notification);
         }
      });

      messaging().getInitialNotification()
      .then(remoteMessage => {
         if (remoteMessage) {
            const notification: any = remoteMessage.notification;
            if(!notification.data) notification.data = remoteMessage.data;
            console.log('[FCMService] getInitialNotification', remoteMessage);
            onOpenNotification(notification);
         }
      })
      .catch(error => {
         console.log('quit state notification error : ', error);
      });

      this.unsubcribe = messaging().onMessage(remoteMessage => {
         if (remoteMessage) {
            onNotification(remoteMessage.notification, remoteMessage.data);
         }
      });

      messaging().onTokenRefresh(fcmToken => {
         onRegister(fcmToken);
      });
            
   }

   public registerTopic ( topic: string ) {
      messaging().subscribeToTopic(topic)
      .then(() => {
         console.log('[FCMService] subscribeToTopic', topic);
      })
      .catch(()=>{
         console.log('[FCMService] subscribeToTopic error');
      });
   }

   public unRegisterTopic ( topic: string ) {
      messaging().unsubscribeFromTopic(topic)
      .then(() => {
         console.log('[FCMService] unsubscribeFromTopic', topic);
      })
      .catch(()=>{
         console.log('[FCMService] unsubscribeFromTopic error');
      });
   }

   public unRegister () {
      this.unsubcribe();
   }

}

export default new FCMService();
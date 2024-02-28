import PushNotification  from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';


const buildAndroidNotification = (
   id: string, 
   title: string, 
   message: string, 
   data: any = {}, 
   options: any = {}
) => {
   return {
      id: id,
      authCancel: true,
      largeIcon: options.largeIcon || 'ic_main_round',
      smallIcon: options.smallIcon || 'ic_main_round',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
   };
}

const buildIOSNotification = (
   id: string, 
   title: string, 
   message: string, 
   data: any = {}, 
   options: any = {}
) => {
   return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
         id: id,
         item: data,
      },
   };
}


class NotifyService {

   public configure (onOpenNotification: (notify: any) => void) {
      PushNotification.configure({
         onRegister: ({ os, token }) => {
            console.log('[NotifyService] onRegister', os, token);
         },
         onNotification: ( notification ) => {
            console.log('[NotifyService] onNotification', notification);
            if(notification.userInteraction && notification.foreground) {
               onOpenNotification(notification);
            }
            if (Platform.OS === 'ios') {
               notification.finish(PushNotificationIOS.FetchResult.NoData);
            }
         },
         permissions: {
            alert: true,
            badge: true,
            sound: true,
         },
         popInitialNotification: true,
         requestPermissions: true
      });
   }

   public unRegister () {
      PushNotification.unregister();
   }

   public showNotification = (
      id: string, 
      title: string, 
      message: string, 
      data: any = {}, 
      options: any = {}
   ) => {
      PushNotification.localNotification({
         ...buildAndroidNotification(id, title, message, data, options),
         ...buildIOSNotification(id, title, message, data, options),
         title: title || '',
         message: message || '',
         playSound: options.playSound || false,
         soundName: options.soundName || 'default',
      });
   };

   public cancelAllLocalNotification () {
      if (Platform.OS === 'ios') {
         PushNotificationIOS.removeAllDeliveredNotifications();
      } else {
         PushNotification.cancelAllLocalNotifications();
      }
   };

   public removeDeliveredNotificationByID (notification: any) {
      console.log('[NotifyService] removeDeliveredNotificationByID:', notification);
      PushNotification.cancelLocalNotifications({id: `${notification.id}`});
   };

   
}

export default new NotifyService();
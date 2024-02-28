import { PermissionsAndroid } from "react-native";

const androidPermissions = [
   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
];

export const requestLocalStorage = () => {
   return new Promise(async (resolve, reject) => {
      const result = await PermissionsAndroid.requestMultiple(androidPermissions);
      if(result['android.permission.READ_EXTERNAL_STORAGE'] && 
         result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'){
         console.log('granted');
         resolve(null);
      } else {
         reject();
      }
   });   
}
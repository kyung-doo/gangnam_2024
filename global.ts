import { Platform } from 'react-native';
import { PROD_URL } from './utils/Constant';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check';

declare global {
   // 전역변수
   let globalVars: {
      baseUrl?: string;   // 기본 경로
      userAgent?: string; // userAgent명
      deviceId?: string;  // 기기 고유 아이디
      deviceName?: string; // 기기 명
      currentVersion?: string; // 현재버전
      latestVersion?: string; // 최신버전
      getUserAgent: () => string;
   };
}
 
globalVars = {
   getUserAgent: () => '',
};
 
export default (async () => {
   try {    
      globalVars.baseUrl = PROD_URL;
      globalVars.deviceId = await DeviceInfo.getUniqueId();
      globalVars.deviceName = await DeviceInfo.getBrand() +' ' + DeviceInfo.getModel();
      globalVars.currentVersion = VersionCheck.getCurrentVersion();
      globalVars.latestVersion = await VersionCheck.getLatestVersion();
      globalVars.userAgent = await DeviceInfo.getUserAgent();
      globalVars.getUserAgent = () => `${globalVars.userAgent} CURRENTVERSION:${globalVars.currentVersion} LATESTVERSION:${globalVars.latestVersion} S-APP-${Platform.OS.toLocaleUpperCase()} DEVICEID:${globalVars.deviceId} DEVICENAME:${globalVars.deviceName}`;
      console.log('userAgent: ', globalVars.getUserAgent());
      console.log('deviceId: ', globalVars.deviceId);
      console.log('deviceName: ', globalVars.deviceName);
   } catch(e){}
})();
 
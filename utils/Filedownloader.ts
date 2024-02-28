import { Platform } from "react-native";
import RNFetchBlob, { RNFetchBlobConfig } from "rn-fetch-blob";


const DIRS = RNFetchBlob.fs.dirs;

const MIME_TYPE: {[key: string]: string} = {
   'jpg' : 'image/jpeg',
   'jpeg' : 'image/jpeg',
   'png' : 'image/png',
   'gif' : 'image/gif',
   'text' : 'text/plain',
   'pdf' : 'application/pdf',
   'xls': 'application/vnd.ms-excel',
   'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
   'hwp': 'application/x-hwp',
   'hwt': 'application/x-hwt',
   'hml': 'application/haansofthml',
   'hwpx': 'application/vnd.hancom.hwpx',
   'doc': 'application/msword',
   'docm': 'application/vnd.ms-word.document.macroEnabled.12',
   'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
   'dotx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
   'ppt': 'application/vnd.ms-powerpoint',
   'pptm': 'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
   'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
   'rtf': 'application/rtf',
}



export default class Filedownloader {

   static start( downloadUrl: string) {
      return new Promise(async (resolve, reject) => {
         const urls = downloadUrl.split('/');
         const filename = urls[urls.length-1];
         const FileManager = Platform.select({
            ios: {
               getDownloadPath: (filename: string) => DIRS.DocumentDir + '/' + filename,
            },
            android: {
               getDownloadPath: (filename: string) => DIRS.DownloadDir + '/' + filename,
            }
         });

         const path = FileManager!.getDownloadPath(filename);
         try {
            const fetchConfig: RNFetchBlobConfig = {
            fileCache: true,
            path,
            appendExt: filename.split('.').slice(-1)[0],
            addAndroidDownloads: {
               title: filename,
               path,
               notification: true,
               useDownloadManager: true,
               mediaScannable: true
            }
            }
            const response = await RNFetchBlob.config(fetchConfig).fetch('GET', downloadUrl);
            const downloadPath = response.path();
            if(Platform.OS === 'ios') {
               this.show(downloadPath, MIME_TYPE[filename.split('.')[1]]);
            }
            resolve({downloadPath, mimeType: MIME_TYPE[filename.split('.')[1]]});
         } catch (error) {
            reject(error);
         }
      });
   }

   static async show(downloadPath: string, mimetype: string) {
      const FileManager = Platform.select({
         ios: {
            preview: (path: string) => RNFetchBlob.ios.previewDocument(path)
         },
         android: {
            preview: RNFetchBlob.android.actionViewIntent
         }
      });
      FileManager!.preview(downloadPath, mimetype);
   }
}
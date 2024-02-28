import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';
import { injectOpenWindowScript } from '../utils/WebviewScript';


export interface Props {
   url: string;
   onClose: ( data: any ) => void;
}


const OpenWindow: FC<Props> = ({ url, onClose }) => {

   const onMessage = ( e: WebViewMessageEvent ) => {
      const msg = JSON.parse(e.nativeEvent.data);
      console.log('onMessage: ', msg.name, msg.data);
      switch(msg.name) {
         case 'juso' : 
            onClose({ name: 'juso', data: msg.data});
         break;
         case 'school' : 
            onClose({ name: 'school', data: msg.data});
         break;
         default : 
            onClose(null);
         break;
      }
   }
    
   
   return(
      <View style={StyleSheet.absoluteFill}>
         <WebView
            originWhitelist={['*']}
            sharedCookiesEnabled={true}
            source={{uri: url}}
            style={{width: '100%', height: '100%', flex: 1}}
            injectedJavaScript={injectOpenWindowScript}
            cacheEnabled={false}
            onMessage={onMessage}
            bounces={false} />
      </View>
   );
}


export default OpenWindow;
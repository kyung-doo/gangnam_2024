import React, { FC, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableHighlight, View, Platform } from 'react-native';
import { APP_PERMISSION_MESSAGE } from '../utils/Constant';
import Message, { Props as MessageProps } from './Message';


export interface Props {
   onPermissionEnter: () => void;
   goAppMain: () => void;
}

const IntroPermission: FC<Props> = ({ onPermissionEnter, goAppMain }) => {

   const [message, setMessage] = useState<MessageProps | null>(null);

   const onEnter = () => {
      if(Platform.OS === 'ios'){
         goAppMain();
         return;
      }
      setMessage({
         message: APP_PERMISSION_MESSAGE,
         showCancelButton: true,
         onCancel: () => setMessage(null),
         enterText: '권한 설정',
         onEnter: () => {
           setMessage(null);
           onPermissionEnter();
         }
      });
   }

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.headerText}>앱 접근 권한 안내</Text>
         </View>
         <ScrollView>
            <View style={styles.topInfo}>
               <Text style={styles.topText}>원활한 앱 이용을 위해 다음의 권한을 허용해주세요.</Text>
            </View>
            <View style={styles.block}>
               <Text style={styles.bockTitle}>필수 접근 권한</Text>
               <View style={styles.blockItem}>
                  <View style={styles.itemIcon}>
                     <Image 
                        style={{width: 24, height: 24}} 
                        source={require('../assets/images/phone.png')}/>
                  </View>
                  <Text style={styles.itemText}>단말장치 식별 및 공유 정보 </Text>
               </View>
            </View>
            <View style={styles.lineBold} />
            <View style={styles.block}>
               <Text style={styles.bockTitle}>선택 접근 권한</Text>
               <View style={styles.blockItem}>
                  <View style={styles.itemIcon}>
                     <Image 
                        style={{width: 22, height: 22}} 
                        source={require('../assets/images/push.png')}/>
                  </View>
                  <Text style={styles.itemText}>PUSH 알림</Text>
               </View>
               <View style={styles.lineLight} />
               {
                  Platform.OS !== "ios" && (
                     <>
                     <View style={styles.blockItem}>
                        <View style={styles.itemIcon}>
                           <Image 
                              style={{width: 22, height: 22}} 
                              source={require('../assets/images/file.png')}/>
                        </View>
                        <Text style={styles.itemText}>저장공간</Text>
                        <Text style={styles.itemText2}>{'('}기기 사진 미디어 파일 액세스{')'}</Text>
                     </View>
                        <View style={styles.lineLight} />
                     <View style={styles.blockItem}>
                        <View style={styles.itemIcon}>
                           <Image 
                              style={{width: 22, height: 20}} 
                              source={require('../assets/images/camera.png')}/>
                        </View>
                        <Text style={styles.itemText}>카메라</Text>
                     </View>
                     </>
                  )
               }
               <View style={styles.blockItem}>
                  <View style={styles.infoBox}>
                     <View style={styles.infoCon}>
                        <Text style={styles.infoText}>ㆍ</Text>
                        <Text style={styles.infoText}>
                           휴대폰 기종별로 선택 접근 권한 항목이 다를 수 있습니다.
                        </Text>
                     </View>
                     <View style={styles.infoCon}>
                        <Text style={styles.infoText}>ㆍ</Text>
                        <Text style={styles.infoText}>
                           서비스 제공에 필요한 경우에만 접근 권한 동의를 받습니다. 동의하지 않아도 서비스 이용은 가능하나, 일부 기능 사용이 제한될 수 있습니다.
                        </Text>
                     </View>
                  </View>
               </View>
            </View>
         </ScrollView>
         <TouchableHighlight 
            style={styles.footer}
            underlayColor="#eee"
            onPress={onEnter}>
            <Text style={styles.btnText}>확인</Text>
         </TouchableHighlight>
         {message && 
            <Message {...message} />
         }
      </View>
   )
};


const styles = StyleSheet.create({
   container:{
      flex: 1,
      backgroundColor: "#fff",
      height: '100%'
    },
   header: {
     alignItems: 'center',
     justifyContent: 'center',
     height: 61,
     borderBottomColor: '#F0F0F0',
     borderBottomWidth: 1
   },
   headerText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#333'
   },
   topInfo: {
      paddingLeft: 20,
      justifyContent: 'center',
      height: 64,
      backgroundColor: '#FAFAFA'
   },
   topText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#333'
   },
   block: {
      paddingVertical: 20
   },
   bockTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#2183FF',
      paddingHorizontal: 20
   },
   blockItem: {
      paddingTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20
   },
   itemIcon: {
      borderRadius: 44,
      width: 44,
      height: 44,
      borderWidth: 1,
      borderColor: '#eee',
      backgroundColor: '#fafafa',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
   },
   itemText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '700',
      color: '#333'
   },
   itemText2: {
      marginLeft: 5,
      fontSize: 14,
      fontWeight: '400',
      color: '#333',
      marginTop: -2
   },
   lineBold: {
      width: '100%',
      height: 8,
      backgroundColor: '#F5F5F5'
   },
   lineLight: {
      width: '100%',
      height: 1,
      backgroundColor: '#F5F5F5',
      marginTop: 20
   },
   infoBox: {
      width: '100%',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#eee',
      padding: 16,
   },
   infoCon: {
      flexDirection: 'row'
   },
   infoText: {
      fontWeight: '400',
      fontSize: 12,
      color: '#666'
   },
   footer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 61,
      borderTopColor: '#F0F0F0',
      borderTopWidth: 1
   },
   btnText: {
      fontWeight: '700',
      fontSize: 16,
      color: '#2183FF'
   }
});

export default IntroPermission;
import React, { FC } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, Platform, BackHandler } from 'react-native';
import RNExitApp from 'react-native-exit-app';


interface Props {
   onReload: () => void;
}
 
 const NetworkError: FC<Props> = ({ onReload }) => {
    
   return (
      <View style={[StyleSheet.absoluteFill, styles.container]}>
         <Image style={styles.image}
            source={require('../assets/images/nowifi.png')}/>
         <Text style={styles.title} >
            연결에 실패했습니다.{'\n'}
            다시 시도해 주세요.
         </Text>
         <View style={styles.buttonCon}>
            <TouchableHighlight 
               underlayColor="#dddddd"
               style={styles.btnReload}
               onPress={() => onReload()}>
               <Text style={styles.btnText}>재시도</Text>
            </TouchableHighlight>
            <TouchableHighlight 
               underlayColor="#8053ff"
               style={styles.btnExit}
               onPress={() => {
                  if(Platform.OS === 'ios') {
                     RNExitApp.exitApp();
                  } else {
                     BackHandler.exitApp();
                  }
               }}>
               <Text style={styles.btnText}>앱 종료</Text>
            </TouchableHighlight>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center'
   },
   image: {
      width: 100,
      height: 100
   },
   title: {
      textAlign: 'center',
      marginVertical: 20,
      fontSize: 18,
      marginTop: 30,
      lineHeight: 30
   },
   buttonCon: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
   },
   btnReload: {
      width: 100,
      height: 40,
      borderRadius: 4,
      backgroundColor: '#cccccc',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 5
   },
   btnExit: {
      width: 100,
      height: 40,
      borderRadius: 4,
      backgroundColor: '#ffcc00',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 5
   },
   btnText: {
      fontSize: 16,
   }
});

export default NetworkError;
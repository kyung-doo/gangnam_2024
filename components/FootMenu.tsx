import React, { FC, useMemo } from "react";
import { Image, Platform, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { CONFIG_DIVICE_PATH, CONFIG_PATH, MAIN_PATH, MY_PAGE_HIGH_PATH, MY_PAGE_MIDDLE_PATH, PUSH_HIGH_LIST_PATH, PUSH_MIDDLE_LIST_PATH, RECOMMEND_HIGH_PATH, RECOMMEND_MIDDLE_PATH, USER_HIGH_MAIN_PATH, USER_MIDDLE_MAIN_PATH } from "../utils/Constant";


export interface Props {
   onFootMenuClick: (idx: number) => void;
   notifyCount: number;
   currentUrl: string;
}


const FootMenu: FC<Props> = ({ onFootMenuClick, notifyCount, currentUrl }) => {

   const activeNum = useMemo(() => {
      if(currentUrl.includes(MAIN_PATH) || currentUrl.includes(USER_HIGH_MAIN_PATH) || currentUrl.includes(USER_MIDDLE_MAIN_PATH)) {
         return 1;
      } else if(currentUrl.includes(RECOMMEND_HIGH_PATH) || currentUrl.includes(RECOMMEND_MIDDLE_PATH)) {
         return 2;
      } else if(currentUrl.includes(MY_PAGE_HIGH_PATH) || currentUrl.includes(MY_PAGE_MIDDLE_PATH)) {
         return 3;
      } else if(currentUrl.includes(PUSH_HIGH_LIST_PATH) || currentUrl.includes(PUSH_MIDDLE_LIST_PATH)) {
         return 4;
      } else if(currentUrl.includes(CONFIG_PATH) || currentUrl.includes(CONFIG_DIVICE_PATH)) {
         return 5;
      }
      return 0;
   }, [currentUrl]);

   return (
      <View style={styles.footMenu}>
         <View style={styles.btnCon}>
            <TouchableHighlight 
               underlayColor="#eee"
               style={styles.btn}
               onPress={() => onFootMenuClick(0)}>
               <View style={styles.btnSet}>
                  <View style={styles.imageSet}>
                     {activeNum === 1
                        ?
                        <Image style={{width: 20, height: 20}} source={require('../assets/images/home_on.png')} />
                        :
                        <Image style={{width: 20, height: 20}} source={require('../assets/images/home_off.png')} />
                     }
                  </View>
                  <Text style={[styles.text, {color: activeNum === 1 ? '#2183FF' : '#6b6b6b'}]}>홈</Text>
               </View>
            </TouchableHighlight>
         </View>
         <View style={styles.btnCon}>
            <TouchableHighlight 
               underlayColor="#eee"
               style={styles.btn}
               onPress={() => onFootMenuClick(5)}>
               <View style={styles.btnSet}>
                  <View style={styles.imageSet}>
                     <Image style={{width: 16, height: 17}} source={require('../assets/images/back_off.png')} />
                  </View>
                  <Text style={[styles.text, {color: '#6b6b6b' }]}>뒤로가기</Text>
               </View>
            </TouchableHighlight>
         </View>
         <View style={styles.btnCon}>
            <TouchableHighlight 
               underlayColor="#eee"
               style={styles.btn}
               onPress={() => onFootMenuClick(1)}>
               <View style={styles.btnSet}>
                  <View style={styles.imageSet}>
                     {activeNum === 2
                        ?
                        <Image style={{width: 19, height: 19}} source={require('../assets/images/recommend_on.png')} />
                        :
                        <Image style={{width: 19, height: 19}} source={require('../assets/images/recommend_off.png')} />
                     }
                  </View>
                  <Text style={[styles.text, {color: activeNum === 2 ? '#2183FF' : '#6b6b6b'}]}>추천강좌</Text>
               </View>
            </TouchableHighlight>
         </View>
         <View style={styles.btnCon}>
            <TouchableHighlight 
               underlayColor="#eee"
               style={styles.btn}
               onPress={() => onFootMenuClick(2)}>
               <View style={styles.btnSet}>
                  <View style={styles.imageSet}>
                     {activeNum === 3
                        ?
                        <Image style={{width: 20, height: 20}} source={require('../assets/images/my_on.png')} />
                        :
                        <Image style={{width: 20, height: 20}} source={require('../assets/images/my_off.png')} />
                     }
                  </View>
                  <Text style={[styles.text, {color: activeNum === 3 ? '#2183FF' : '#6b6b6b'}]}>MY인강</Text>
               </View>
            </TouchableHighlight>
         </View>
         <View style={styles.btnCon}>
            <TouchableHighlight 
               underlayColor="#eee"
               style={styles.btn}
               onPress={() => onFootMenuClick(3)}>
               <View style={styles.btnSet}>
                  <View style={styles.imageSet}>
                     {activeNum === 4
                        ?
                        <Image style={{width: 20, height: 21}} source={require('../assets/images/push_noti_on.png')} />
                        :
                        <Image style={{width: 20, height: 21}} source={require('../assets/images/push_noti_off.png')} />
                     }
                     {notifyCount > 0 &&
                        <View style={styles.notifyIcon}>
                           <Text style={styles.notifyText}>{notifyCount}</Text>
                        </View>
                     }
                  </View>
                  <Text style={[styles.text, {color: activeNum === 4 ? '#2183FF' : '#6b6b6b'}]}>알림</Text>
               </View>
            </TouchableHighlight>
         </View>
         <View style={styles.btnCon}>
            <TouchableHighlight 
               underlayColor="#eee"
               style={styles.btn}
               onPress={() => onFootMenuClick(4)}>
               <View style={styles.btnSet}>
                  <View style={styles.imageSet}>
                     {activeNum === 5
                        ?
                        <Image style={{width: 20, height: 20}} source={require('../assets/images/setting_on.png')} />
                        :
                        <Image style={{width: 20, height: 20}} source={require('../assets/images/setting_off.png')} />
                     }
                  </View>
                  <Text style={[styles.text, {color: activeNum === 5 ? '#2183FF' : '#6b6b6b'}]}>설정</Text>
               </View>
            </TouchableHighlight>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   footMenu: {
      height: 55,
      backgroundColor: '#fafafa',
      flexDirection: 'row',
      borderTopColor: '#eee',
      borderTopWidth: 1,
      paddingHorizontal: 15,
   },
   btnCon: {
      flex: 1
   },
   btnSet: {
      alignItems: 'center'
   },
   btn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
   },
   imageSet: {
      height: 24
   },
   text: {
      fontSize: 11,
      fontWeight: '400',
      color: '#6b6b6b'
   },
   notifyIcon: {
      position: 'absolute',
      right: -8,
      top: -3,
      width: 16,
      height: 16,
      backgroundColor: '#cc0000',
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center'
   },
   notifyText: {
      marginTop: -1,
      fontSize: 8,
      fontWeight: '700',
      color: '#fff'
   },
});

export default FootMenu;
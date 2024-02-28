import React, { FC, useState } from "react"
import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native"


export interface Props {
   onNightCheck: (val: boolean) => void
}

const PushNightCheck: FC<Props> = ({ onNightCheck }) => {

   const [isChecked, setIsChecked] = useState<boolean>(false);

   const onClick = () => {
      setIsChecked(prev => {
         const check = !prev;
         onNightCheck(check);
         return check;
      });
   };
 
   return (
     <TouchableHighlight 
       underlayColor="rgba(0,0,0,0)"
       onPress={onClick}>
       <View style={styles.container}>
         {!isChecked
            ?
            <Image style={styles.check} source={require('../assets/images/chk_off.png')} />
            :
            <Image style={styles.check} source={require('../assets/images/chk_on.png')} />
         }
         <Text style={styles.text1}>{'('}선택{')'} 야간 푸쉬 수신 동의</Text>
         <Text style={styles.text2}>{'('}오후 9시~익일 8시{')'}</Text>
       </View>
     </TouchableHighlight>
   )
}

const styles = StyleSheet.create({
   container: {
      flexDirection:'row'
   },
   text1: {
      fontWeight: '400',
      fontSize: 12,
      color: '#333',
      marginLeft: 7
   },
   text2: {
      fontWeight: '300',
      fontSize: 12,
      color: '#666',
      marginLeft: 5
   },
   check: {
      width: 20,
      height: 20
   }
});

export default PushNightCheck;
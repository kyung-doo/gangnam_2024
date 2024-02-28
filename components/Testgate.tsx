import React, { FC } from 'react';
import {Text, TouchableHighlight, StyleSheet, View } from 'react-native';
import { DEV_URL, LOCAL_URL, PROD_URL } from '../utils/Constant';



export interface Props {
   onExit: () => void;
}


const Testgate: FC<Props> = ({ onExit }) => {

   const clickBtn = ( type: string ) => {
      switch(type) {
         case 'local' :
            globalVars.baseUrl = LOCAL_URL;
         break;
         case 'dev' :
            globalVars.baseUrl = DEV_URL;
         break;
         case 'prod' :
            globalVars.baseUrl = PROD_URL;
         break;
      }
      onExit();
   }
  
   return (
      <View style={styles.wrapper}>
         <View style={styles.btnCon}>
            <TouchableHighlight 
               underlayColor="#878787"
               style={styles.btn}
               onPress={() => clickBtn('local')}>
               <Text style={styles.btnText}>로컬</Text>
            </TouchableHighlight>
            <TouchableHighlight 
               underlayColor="#878787"
               style={styles.btn}
               onPress={() => clickBtn('dev')}>
               <Text style={styles.btnText}>개발</Text>
            </TouchableHighlight>
            <TouchableHighlight 
               underlayColor="#878787"
               style={styles.btn}
               onPress={() => clickBtn('prod')}>
               <Text style={styles.btnText}>운영</Text>
            </TouchableHighlight>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   wrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
   },
   btnCon: {
      marginVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
   },
   btn: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 10,
      width: 100,
      height: 60,
      backgroundColor: '#383838'
   },
   btnText: {
      fontSize: 16,
      fontWeight: '400',
      color: '#fff'
   }
});

export default Testgate;

import React, { FC, useRef, useEffect } from "react";
import { View, StyleSheet, Text, TouchableHighlight, Animated, Easing } from "react-native";


export interface Props {
   id?: string;
   desc?: string;
   message: string;
   enterText?: string;
   cancelText?: string;
   onEnter?: ( id?: string ) => void;
   showCancelButton?: boolean;
   onCancel?: ( id?: string  ) => void;
   extra?: JSX.Element
}


const Message: FC<Props> = ({ id, desc, message, enterText, cancelText, showCancelButton, onEnter, onCancel, extra}) => {

   const modalScale = useRef<Animated.Value>(new Animated.Value(0)).current;
   
   useEffect(() => {
      Animated.timing(modalScale, {
         toValue: 1,
         duration: 400,
         easing: Easing.elastic(1.2),
         useNativeDriver: true
      }).start();
   },[]);
   
   return (
      <View style={StyleSheet.absoluteFill}>
         <View style={styles.modalBg}>
            <Animated.View style={[styles.modal, {
               transform: [
                  { scale: modalScale }
               ]}]}>
               <View style={[styles.modalHead, desc ? {paddingBottom: 10} : {}]}>
                  <Text style={styles.modalText}>{message}</Text>
               </View>
               {desc && 
                  <View style={styles.modalBody}>
                     <Text style={styles.modalDesc}>{desc}</Text>
                  </View>
               }
               {extra && 
                  <View style={styles.modalBody}>{extra}</View>
               }
               <View style={styles.modalFoot}>
                  {showCancelButton && 
                     <TouchableHighlight 
                        underlayColor="#dddddd"
                        style={styles.btnCancel}
                        onPress={() => onCancel && onCancel(id)}>
                        <Text style={styles.cancelText}>{cancelText ? cancelText : '취소'}</Text>
                     </TouchableHighlight>
                  }
                  <TouchableHighlight 
                     underlayColor="#dddddd"
                     style={styles.btnEnter}
                     onPress={() => onEnter && onEnter(id)}>
                     <Text style={styles.enterText}>{enterText ? enterText : '확인'}</Text>
                  </TouchableHighlight>
               </View>
            </Animated.View>
         </View>
      </View>
   )
}


const styles = StyleSheet.create({
   area: {
      flex: 1,
      width: '100%',
      height: '100%',
   },
   modalBg: {
      position: 'absolute',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      width: '100%',
      height: '100%'
   },
   modal: {
      width: 300,
      minHeight: 153,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 10,
      overflow: 'hidden'
   },
   modalHead: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingVertical: 40,
      paddingHorizontal: 30
   },
   modalText: {
      color: '#000',
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
   },
   
   modalBody: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 30,
      paddingBottom: 20,

   },
   modalDesc: {
      color: '#666',
      fontSize: 14,
      textAlign: 'center',
      fontWeight: '400'
   },
   modalFoot: {
      height: 53,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderTopColor: '#eee',
      borderTopWidth: 1
   },
   btnEnter: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff'
   },
   btnCancel: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fafafa'
   },
   cancelText: {
      color: '#666',
      fontSize: 16,
      fontWeight: '700'
   },
   enterText: {
      color: '#2183FF',
      fontSize: 16,
      fontWeight: '700'
   }
});

export default Message;
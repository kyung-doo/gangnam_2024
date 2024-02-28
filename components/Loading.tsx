import React, { FC, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';


interface Props {
   isReload?: boolean;
}
 
const Loading: FC<Props> = ({isReload}) => {
   
   const iconRotationY = useRef<Animated.AnimatedValue>(new Animated.Value(0)).current;
   const rotationY = iconRotationY.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
   });
   const iconRotationX = useRef<Animated.AnimatedValue>(new Animated.Value(0)).current;
   const rotationX = iconRotationX.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
   });


   const startAnimation = () => {
      Animated.loop(
         Animated.sequence([
            Animated.timing(iconRotationY, {
               toValue: 1,
               duration: 1000,
               useNativeDriver: true
            }),
            Animated.timing(iconRotationX, {
               toValue: 1,
               duration: 1000,
               useNativeDriver: true
            }),
            Animated.delay(100),
            Animated.timing(iconRotationY, {
               toValue: 0,
               duration: 1000,
               useNativeDriver: true
            }),
            Animated.timing(iconRotationX, {
               toValue: 0,
               duration: 1000,
               useNativeDriver: true
            })
         ])
      ).start();
   }

   useEffect(() => {
      startAnimation();
      return () => {
         iconRotationY.stopAnimation();
         iconRotationX.stopAnimation();
      }
   },[]);

   return (
      <View style={[
         StyleSheet.absoluteFill, 
         { backgroundColor: !isReload ? 'rgba(0,0,0,0.5)' : 'white', ...styles.container}]}>
         <Animated.Image style={[styles.icon, {
            transform: [
               { rotateY: rotationY },
               { rotateX: rotationX }
            ]
         }]}
            source={require('../assets/images/loading_icon.png')} />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
   },
   icon: {
      width: 50,
      height: 50
   }
 });

export default Loading;
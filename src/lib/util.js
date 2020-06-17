import { Animated, Easing } from 'react-native';

export const runAnimation = (el, position ) => {
    Animated.spring(el, {
        toValue: position,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out
      }).start();
}
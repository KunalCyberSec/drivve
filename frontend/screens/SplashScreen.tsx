import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
//@ts-ignore
import { useNavigation } from "@react-navigation/native";

// ✅ Import your SVG logo
import SplashLogo from "../assets/images/splash.svg";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      // @ts-ignore
      navigation.replace("Login");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <SplashLogo
          width={200}
          height={200}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#184080", // Drivve brand blue
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SplashScreen;

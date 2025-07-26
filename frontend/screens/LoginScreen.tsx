import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
//import { sendOtp } from "../services/api";
import LoginSvg from "../assets/images/login.svg"; 

const { width } = Dimensions.get("window");

// Added validatePhone function for Indian mobile number validation
const validatePhone = (number: string) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(number);
};

const LoginScreen = ({ navigation }: any) => {
  const [mobile, setMobile] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getBorderColor = () => {
    if (error) return "#FF770F";
    if (mobile.length === 10) return "#0FAB0F";
    if (focused) return "#184080";
    return "#999999";
  };

  const handleNext = async () => {
    if (validatePhone(mobile)) {
      setError("");
      setLoading(true);
      
      // temp. Simulate sending OTP
      setTimeout(() => {
        setLoading(false);
        navigation.navigate("Otp", { mobile });
      }, 1500);

      /*try {
        const response: any = await sendOtp(mobile);
        console.log("sendOtp response:", response);
        if (response.error) {
          setError(response.error);
        } else {
          navigation.navigate("Otp"); 
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        setError("Failed to send OTP due to an unexpected error.");
      }
      setLoading(false);
      */

    } else {
      setError("Please enter a valid 10-digit mobile number");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
        <Text style={styles.title}>Snap into a Drivve</Text>

        <LoginSvg
          width="100%"
          height={undefined}
          style={styles.image}
          preserveAspectRatio="xMidYMid meet"
        />

        <Text style={styles.loginTitle}>Login</Text>
        <Text style={styles.subtitle}>You have been missed!</Text>

        <View style={[styles.inputContainer, { borderColor: getBorderColor() }]}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={10}
            placeholder={focused ? "" : "Mobile No."}
            placeholderTextColor="#999999"
            value={mobile}
            onChangeText={(text) => {
              setMobile(text);
              if (error) setError("");
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            editable={!loading}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.nextContainer}>
          <TouchableOpacity onPress={handleNext} disabled={loading}>
            <Text style={[styles.nextButton, loading && { color: "#999999" }]}>
              {loading ? "Sending OTP..." : "Next →"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          <Text style={styles.footerText}>By signing up, you agree to </Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://drivve.in/")}
          >
            terms of use
          </Text>
        </Text>
        {/* Overlapping semicircles at bottom left */}
        <View style={styles.semiCircleContainer}>
          <View style={styles.semiCircleLeft} />
          <View style={styles.semiCircleBottom} />
        </View>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  title: {
    color: "#184080",
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Inter",
    alignSelf: "flex-end",
  },
  image: {
    width: "100%",
    aspectRatio: 1.6,
    alignSelf: "center",
    marginVertical: 20,
  },
  loginTitle: {
    fontSize: 28,
    color: "#184080",
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#130F0F",
    fontFamily: "Inter",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "#999999",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 10,
    color: "#000",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter",
  },
  nextContainer: {
    alignItems: "flex-end",
    marginBottom: 30,
  },
  nextButton: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Inter",
    color: "#184080",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: "Inter",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    flexDirection: "row",
  },
  footerText: {
    fontSize: 13,
    color: "#000000",
    fontFamily: "Inter",
  },
  link: {
    color: "#184080",
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Inter",
    textDecorationLine: "underline",
  },
  semiCircleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 300,
    height: 200,
    overflow: "visible",
  },
  semiCircleLeft: {
    position: "absolute",
    left: 0,
    bottom: -10,
    width: 100,
    height: 200,
    backgroundColor: "#FFC845",
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    opacity: 0.3,
  },
  semiCircleBottom: {
    position: "absolute",
    bottom: 0,
    left: -5,
    width: 200,
    height: 100,
    backgroundColor: "#FFC845",
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    opacity: 0.3,
  },
});

export default LoginScreen;

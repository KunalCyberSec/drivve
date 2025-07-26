import React, { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";

import LottieView from "lottie-react-native";
import otpAnimation from "../components/otp.json";
import verifyAnimation from "../components/verify.json";

const { width } = Dimensions.get("window");

const OTP_LENGTH = 6;
const CORRECT_OTP = "123456"; // correct otp for demo purposes

const OtpScreen = ({ navigation, route }: any) => {
  const mobile = route?.params?.mobile;

  const [mobileNumber, setMobileNumber] = useState("");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown logic
  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resendTimer]);

  useEffect(() => {
    if (mobile) {
      setMobileNumber(mobile);
    }
  }, [mobile]);

  // OTP auto verify
  useEffect(() => {
    if (otp.length === OTP_LENGTH) {
      verifyOtp();
    }
  }, [otp]);

  const handleResend = () => {
    if (resendTimer === 0) {
      if (resendCount >= 2) {
        Alert.alert("Limit Reached", "Please try again later.", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
        return;
      }
      setResending(true);
      setResendCount(resendCount + 1);
      // Mock resend OTP
      setTimeout(() => {
        setOtp("");
        setError("");
        setResendTimer(30);
        setResending(false);
      }, 1000);
    }
  };

  const verifyOtp = () => {
    if (otp === CORRECT_OTP) {
      setError("");
      setShowVerifyModal(true);
      setTimeout(() => {
        setShowVerifyModal(false);
        navigation.navigate("CreateProfile");
      }, 2500);
    } else {
      setError("The OTP you entered is incorrect. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#FF770F" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.header}>OTP Verification</Text>

      {/* Image */}
      <View style={styles.imageContainer}>
        <LottieView
          source={otpAnimation}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>

      {/* Verification Modal */}
      <Modal
        visible={showVerifyModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <LottieView
              source={verifyAnimation}
              autoPlay
              loop={false}
              style={{ width: 300, height: 300 }}
            />
          </View>
        </View>
      </Modal>

      {/* Info Text */}
      <Text style={styles.otpSentText}>
        OTP sent to {mobileNumber ? "*****" + mobileNumber.slice(5) : ""}
      </Text>

      {/* OTP Input */}
      <View style={styles.otpInputContainer}>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <TextInput
            key={i}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[i] || ""}
            onFocus={() => setFocusedOtpIndex(i)}
            onBlur={() => setFocusedOtpIndex(null)}
            onChangeText={(value) => {
              const newOtp = otp.split("");
              newOtp[i] = value;
              if (value && i < OTP_LENGTH - 1) {
                const nextInput = `otp${i + 1}`;
                (refs[nextInput] as any)?.focus();
              }
              setOtp(newOtp.join("").slice(0, OTP_LENGTH));
              if (error) setError("");
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && !otp[i] && i > 0) {
                const prevInput = `otp${i - 1}`;
                (refs[prevInput] as any)?.focus();
                const newOtp = otp.split("");
                newOtp[i - 1] = "";
                setOtp(newOtp.join("").slice(0, OTP_LENGTH));
              }
            }}
            ref={(ref: TextInput | null) => {
              refs[`otp${i}`] = ref;
            }}
            editable={true}
            style={[
              styles.otpBox,
              { borderColor: "#FF770F",
                backgroundColor: focusedOtpIndex === i || otp[i] ? "#FFFFFF" : "#c9c7c7" }
            ]}
          />
        ))}
      </View>

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Resend OTP */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive a OTP? </Text>
        <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
          <Text style={styles.resendButton}>Resend</Text>
        </TouchableOpacity>
        <Text style={styles.resendText}>
          {resendTimer > 0 ? ` OTP in ${resendTimer}s` : ""}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

// Refs for OTP boxes
const refs: { [key: string]: TextInput | null } = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backArrow: {
    fontSize: 24,
    color: "#184080",
  },
  header: {
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#184080",
    textAlign: "center",
    marginTop: 30,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  otpSentText: {
    textAlign: "center",
    fontFamily: "Inter",
    color: "#130F0F",
    fontSize: 16,
    marginBottom: 20,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  otpBox: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Inter",
    color: "#000",
  },
  errorText: {
    color: "#f44336",
    fontSize: 13,
    fontFamily: "Inter",
    textAlign: "center",
    marginBottom: 10,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  resendText: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "Inter",
  },
  resendButton: {
    fontSize: 14,
    color: "#184080",
    fontFamily: "Inter",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
});

export default OtpScreen;

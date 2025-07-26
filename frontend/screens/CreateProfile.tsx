import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  BackHandler,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  FlatList
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
// Import avatars as React components
import Avatar1 from "../assets/avatars/avatar1.svg";
import Avatar2 from "../assets/avatars/avatar2.svg";
import Avatar3 from "../assets/avatars/avatar3.svg";
import Avatar4 from "../assets/avatars/avatar4.svg";

import indiaStatesCities from "../services/india_states_cities.json";
import { fetchCountries, sendEmailOtp, verifyEmailOtp } from "../services/api.ts";

const avatars = [Avatar1, Avatar2, Avatar3, Avatar4];

const CreateProfile = ({ navigation }: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<React.FC | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDobValid, setIsDobValid] = useState<boolean>(false);
  const [gender, setGender] = useState<string | null>(null);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showCountryModal, setShowCountryModal] = useState(false);

  const [states, setStates] = useState<string[]>([]);
  const [state, setState] = useState<string | null>(null);
  const [showStateModal, setShowStateModal] = useState(false);

  const [cities, setCities] = useState<string[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);

  const [referral, setReferral] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);

  useEffect(() => {
    const onBackPress = () => {
      setShowExitConfirm(true);
      return true;
    };

    let backHandlerListener: any;
    if (Platform.OS === "android") {
      backHandlerListener = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    }
    return () => {
      if (Platform.OS === "android" && backHandlerListener) {
        backHandlerListener.remove();
      }
    };
  }, [navigation]);

  useEffect(() => {
    // Set default country to India directly without fetching
    const defaultCountry = "India";
    setCountries([defaultCountry]);
    setSelectedCountry(defaultCountry);
    setShowCountryModal(false);
  }, []);

  useEffect(() => {
    // Load states from local JSON when selectedCountry changes
    if (selectedCountry) {
      // Since country is fixed to India, get all states from indiaStatesCities
      const allStates = indiaStatesCities.map(item => item.state);
      setStates(allStates);
      setState(null);
      setCities([]);
      setCity(null);
    } else {
      setStates([]);
      setState(null);
      setCities([]);
      setCity(null);
    }
  }, [selectedCountry]);

  useEffect(() => {
    // Load cities from local JSON when state changes
    if (state) {
      const stateData = indiaStatesCities.find(item => item.state === state);
      if (stateData) {
        setCities(stateData.cities || []);
        setCity(null);
      } else {
        setCities([]);
        setCity(null);
      }
    } else {
      setCities([]);
      setCity(null);
    }
  }, [state]);

  const openGallery = async () => {
    setShowPhotoOptions(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setSelectedAvatar(null);
    }
  };

  const openCamera = async () => {
    setShowPhotoOptions(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setSelectedAvatar(null);
    }
  };

  const selectAvatar = (AvatarComponent: React.FC) => {
    setSelectedAvatar(() => AvatarComponent);
    setImage(null);
    setShowAvatars(false);
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const is18OrOlder = (date: Date) => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return date <= minDate;
  };

  const handleConfirm = (selectedDate: Date) => {
    if (!is18OrOlder(selectedDate)) {
      Alert.alert("Age Restriction", "You must be at least 18 years old.");
      setIsDobValid(false);
      setDob(selectedDate);
      hideDatePicker();
      return;
    }
    setDob(selectedDate);
    setIsDobValid(true);
    hideDatePicker();
  };

  const onContinue = () => {
    if (!firstName.trim()) return Alert.alert("Validation", "Please enter your first name.");
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      return Alert.alert("Validation", "Please enter a valid email address.");
    if (!dob) return Alert.alert("Validation", "Please select your date of birth.");
    if (!isDobValid) return Alert.alert("Validation", "You must be at least 18 years old.");
    if (!gender) return Alert.alert("Validation", "Please select your gender.");
  //  if (!selectedCountry) return Alert.alert("Validation", "Please select your country.");
  //  if (!state) return Alert.alert("Validation", "Please select your state.");
  //  if (!city) return Alert.alert("Validation", "Please select your city.");

    navigation.navigate("Home", { firstName, lastName });
  };

  // FlatList data configuration
  const formFields = [
    { key: "photo", render: () =>
      <View style={{alignSelf: "center", marginBottom: 12}}>
        <TouchableOpacity onPress={() => setShowPhotoOptions(true)}>
          {selectedAvatar ? (
            <View style={[styles.imageContainer, { overflow: "hidden" }]}>
              {React.createElement(selectedAvatar)}
            </View>
          ) : image ? (
            <View style={[styles.imageContainer, { overflow: "hidden" }]}>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          ) : (
            <LinearGradient
              colors={["#184080", "#534E63", "#855A4B", "#CC6B28", "#FF770F"]}
              style={styles.imageContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="camera-enhance" size={40} color="#ECEAE8" />
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
    },
    { key: "nameRow", render: () =>
      <View style={styles.row}>
        <View style={{flex:1, marginRight:7}}>
          <Text style={styles.label}>
            First Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#999999"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={{flex:1}}>
          <Text style={styles.label}>
            Last Name
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#999999"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      </View>
    },
    { key: "email", render: () =>
      <View>
        <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Email@example.com"
            placeholderTextColor="#999999"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailVerified(false);
              setOtpSent(false);
              setOtp("");
              setOtpError("");
            }}
            editable={!otpSent}
          />
          <TouchableOpacity
            style={[styles.verifyButton, otpSent ? styles.verifyButtonDisabled : null]}
            onPress={handleSendOtp}
            disabled={otpSent || !validateEmail(email)}
          >
            <Text style={styles.verifyButtonText}>{otpSent ? "Sent" : "Verify"}</Text>
          </TouchableOpacity>
        </View>
        {otpSent && !emailVerified && (
          <View style={{ marginTop: 8 }}>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="#999999"
              keyboardType="numeric"
              value={otp}
              onChangeText={(text) => {
                setOtp(text);
                setOtpError("");
              }}
              maxLength={6}
            />
            {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
            <TouchableOpacity
              style={styles.verifyOtpButton}
              onPress={handleVerifyOtp}
            >
              <Text style={styles.verifyButtonText}>Submit OTP</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    },
    { key: "dob", render: () =>
      <View>
        <Text style={styles.label}>Date of Birth <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.input}>
          <Text style={{ color: dob ? "#000" : "#999" }}>
            {dob ? dob.toDateString() : "Select your date of birth"}
          </Text>
        </TouchableOpacity>
      </View>
    },
    { key: "gender", render: () =>
      <View>
        <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowGenderModal(true)}
        >
          <Text style={{ color: gender ? "#000" : "#999" }}>
            {gender ? gender : "Select Gender"}
          </Text>
        </TouchableOpacity>
      </View>
    },
    { key: "country", render: () =>
      <View>
        <Text style={styles.label}>Country <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowCountryModal(true)}
        >
          <Text style={{ color: selectedCountry ? "#000" : "#999" }}>
            {selectedCountry ? selectedCountry : "Select Country"}
          </Text>
        </TouchableOpacity>
      </View>
    },
    { key: "state", render: () =>
      <View>
        <Text style={styles.label}>State <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStateModal(true)}
        >
          <Text style={{ color: state ? "#000" : "#999" }}>
            {state ? state : "Select State"}
          </Text>
        </TouchableOpacity>
      </View>
    },
    { key: "city", render: () =>
      <View>
        <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            if (state) {
              setShowCityModal(true);
            } else {
              Alert.alert("Select State First", "Please select a state before choosing a city.");
            }
          }}
        >
          <Text style={{ color: city ? "#000" : "#999" }}>
            {city ? city : "Select City"}
          </Text>
        </TouchableOpacity>
      </View>
    },
    { key: "referral", render: () =>
      <View>
        <Text style={styles.label}>Referral Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Referral Code (Optional)"
          placeholderTextColor="#999999"
          value={referral}
          onChangeText={setReferral}
        />
      </View>
    },
    { key: "button", render: () =>
      <TouchableOpacity
        style={[styles.continueButton, !isDobValid && { backgroundColor: "#999" }]}
        onPress={onContinue}
        disabled={!isDobValid}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    }
  ];


  // Additional state and handlers for email verification
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  };

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    setLoadingOtp(true);
    const response = await sendEmailOtp(email);
    setLoadingOtp(false);
    if (response.error) {
      Alert.alert("Error", response.error);
    } else {
      setOtpSent(true);
      Alert.alert("OTP Sent", `An OTP has been sent to ${email}. Please check your email.`);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }
    setLoadingOtp(true);
    const response = await verifyEmailOtp(email, otp);
    setLoadingOtp(false);
    if (response.error) {
      setOtpError(response.error);
    } else {
      setEmailVerified(true);
      setOtpSent(false);
      Alert.alert("Success", "Email verified successfully!");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flexFull}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        {/* Top Bar with Back Button and Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => setShowExitConfirm(true)}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#FF770F" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Profile</Text>
        </View>

        <Text style={styles.subHeaderText}>
          setup your profile and introduce yourself.
        </Text>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {formFields.map(item => (
            <React.Fragment key={item.key}>
              {item.render()}
            </React.Fragment>
          ))}
        </ScrollView>

        {/* Photo Options Modal */}
        <Modal visible={showPhotoOptions} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.photoOptionsCard}>
              <Text style={styles.modalTitle}>
                Choose Profile Picture
              </Text>
              <TouchableOpacity style={styles.photoOption} onPress={openCamera}>
                <Ionicons name="camera" size={24} color="#184080" />
                <Text style={styles.photoOptionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoOption} onPress={openGallery}>
                <Ionicons name="image" size={24} color="#184080" />
                <Text style={styles.photoOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoOption}
                onPress={() => {
                  setShowAvatars(true);
                  setShowPhotoOptions(false);
                }}
              >
                <Ionicons name="person-circle" size={24} color="#184080" />
                <Text style={styles.photoOptionText}>Avatars</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowPhotoOptions(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Avatars Modal */}
        
        <Modal visible={showAvatars} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.avatarsCard}>
              <Text style={styles.modalTitle}>
                Select an Avatar
              </Text>
              <View style={styles.avatarsList}>
                {avatars.map((AvatarComponent, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => selectAvatar(AvatarComponent)}
                    style={styles.avatarTouchable}
                  >
                    <AvatarComponent width={60} height={60} />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAvatars(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
        />

        {/* Gender Modal */}
        <Modal
          visible={showGenderModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.selectionModal}>
              {["Male", "Female", "Prefer Not to Say"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.selectionOption}
                  onPress={() => {
                    setGender(option);
                    setShowGenderModal(false);
                  }}
                >
                  <Text style={styles.selectionText}>{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.selectionOption, styles.cancelButton]}
                onPress={() => setShowGenderModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Country Modal */}
        <Modal
          visible={showCountryModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCountryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.selectionModal}>
              {Array.isArray(countries) && countries.length > 0 ? (
                <FlatList
                  data={countries}
                  keyExtractor={(item: string, index: number) => index.toString()}
                  removeClippedSubviews={false}
                  renderItem={({ item }: { item: string }) => (
                    <TouchableOpacity
                      style={styles.selectionOption}
                      onPress={() => {
                        setSelectedCountry(item);
                        setShowCountryModal(false);
                      }}
                    >
                      <Text style={styles.selectionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={{ textAlign: "center", padding: 20 }}>No countries available</Text>
              )}
              <TouchableOpacity
                style={[styles.selectionOption, styles.cancelButton]}
                onPress={() => setShowCountryModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* State Modal */}
        <Modal
          visible={showStateModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowStateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.selectionModal}>
              {Array.isArray(states) && states.length > 0 ? (
                <FlatList
                  data={[...states]}
                  keyExtractor={(item: string) => item}
                  removeClippedSubviews={false}
                  renderItem={({ item }: { item: string }) => (
                    <TouchableOpacity
                      style={styles.selectionOption}
                      onPress={() => {
                        setState(item);
                        setShowStateModal(false);
                      }}
                    >
                      <Text style={styles.selectionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={{ textAlign: "center", padding: 20 }}>No states available</Text>
              )}
              <TouchableOpacity
                style={[styles.selectionOption, styles.cancelButton]}
                onPress={() => setShowStateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* City Modal */}
        <Modal
          visible={showCityModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCityModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.selectionModal}>
              {Array.isArray(cities) && cities.length > 0 ? (
                <FlatList
                  data={[...cities]}
                  keyExtractor={(item: string) => item}
                  removeClippedSubviews={false}
                  renderItem={({ item }: { item: string }) => (
                    <TouchableOpacity
                      style={styles.selectionOption}
                      onPress={() => {
                        setCity(item);
                        setShowCityModal(false);
                      }}
                    >
                      <Text style={styles.selectionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={{ textAlign: "center", padding: 20 }}>No cities available</Text>
              )}
              <TouchableOpacity
                style={[styles.selectionOption, styles.cancelButton]}
                onPress={() => setShowCityModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Exit Confirm Modal */}
        <Modal visible={showExitConfirm} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.exitModalCard}>
              <Text style={styles.modalTitle}>Logout?</Text>
              <Text style={{ marginBottom: 20, fontFamily: "Inter", color: "#130F0F", textAlign: "center" }}>
                Are you sure you want to logout? Changes will not be saved.
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: "#f44336", flex: 1, marginRight: 6 }]}
                  onPress={() => setShowExitConfirm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: "#184080", flex: 1, marginLeft: 6 }]}
                  onPress={() => {
                    setShowExitConfirm(false);
                    // Logout logic if required
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  flexFull: {
    flex: 1
  },
  formList: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  label: {
    fontSize: 16,
    color: "#184080",
    marginBottom: 4,
    fontFamily: "Inter"
  },
  required: {
    color: "red"
  },
  input: {
    borderWidth: 2,
    borderColor: "#999999",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: "#184080",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#184080",
    textAlign: "center",
    fontFamily: "Roboto"
  },
  photoOptionsCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  photoOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  photoOptionText: {
    fontSize: 18,
    color: "#130F0F",
    marginLeft: 15,
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#f44336",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarsCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarsList: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  avatarTouchable: {
    padding: 10,
  },
  headerText: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 28,
    color: "#184080",
    marginBottom: 3,
    textAlign: "center",
    flex: 1,
  },
  subHeaderText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#130F0F",
    marginBottom: 16,
    textAlign: "center",
    marginHorizontal: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 0,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginRight: 4,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionModal: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: "80%",
    maxHeight: "60%",
    alignSelf: "center",
    justifyContent: "center"
  },
  selectionOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  selectionText: {
    fontSize: 16,
    color: "#184080"
  },
  exitModalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  verifyButton: {
    backgroundColor: "#184080",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: "#999999",
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
  verifyOtpButton: {
    backgroundColor: "#184080",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
});

export default CreateProfile;

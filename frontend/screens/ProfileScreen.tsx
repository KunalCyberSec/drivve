import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // For simplicity, store profile data in local state.
  // In real app, this should come from global state or API.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [referral, setReferral] = useState("");

  useEffect(() => {
    // Load profile data from params or storage if available
    if (route.params && route.params.profile) {
      const profile = route.params.profile;
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setDob(profile.dob || "");
      setGender(profile.gender || "");
      setReferral(profile.referral || "");
    }
  }, [route.params]);

  const onSave = () => {
    if (!firstName.trim()) {
      Alert.alert("Validation", "First name is required.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Validation", "Valid email is required.");
      return;
    }
    // Save profile data logic here (e.g., API call or global state update)
    Alert.alert("Success", "Profile updated successfully.");
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={24} color="#184080" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Your Profile</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Date of Birth"
          value={dob}
          onChangeText={setDob}
        />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
        />
        <TextInput
          style={styles.input}
          placeholder="Referral Code"
          value={referral}
          onChangeText={setReferral}
        />

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#184080",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#184080",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;

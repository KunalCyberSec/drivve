import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
//hello
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const HomeScreen = () => {
  const [expanded, setExpanded] = useState(false);
  const [seats, setSeats] = useState(1);
  const [tab, setTab] = useState<"ride" | "drive">("ride");
  const navigation = useNavigation();
  const route = useRoute();

  // Extract firstName and lastName from route params
  const { firstName, lastName } = route.params || {};

  // DateTime Picker
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Minimum and maximum date for date picker
  const minDate = new Date();
  const maxDate = new Date(minDate);
  maxDate.setDate(minDate.getDate() + 7);

  // Shared value for gesture translation
  const translateY = useSharedValue(0);

  // Animated style for header translation
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const incrementSeats = () => setSeats(seats + 1);
  const decrementSeats = () => {
    if (seats > 1) setSeats(seats - 1);
  };

  const formatDate = (date: Date) => {
    // Format date as "DD/MM/YYYY HH:mm AM/PM"
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  // Create pan gesture using Gesture.Pan()
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationY < -50 && !expanded) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(true);
      } else if (event.translationY > 50 && expanded) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(false);
      }
      translateY.value = 0;
    });

  // Text color for sparkle grey
  const sparkleGrey = "#999999";

  return (
    <View style={styles.container}>
      {/* Blue Header */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.header, expanded && styles.headerExpanded, animatedHeaderStyle]}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              {firstName ? (lastName ? `Hello, ${firstName} ${lastName}!` : `Hello, ${firstName}!`) : "Hello,"}{" "}
            </Text>
            <TouchableOpacity
              style={styles.profilePic}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="person-circle-outline" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          {expanded && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>Total Rides: </Text>
              <Text style={styles.statsText}>Cost Saved: </Text>
            </View>
          )}
        </Animated.View>
      </GestureDetector>

        {/* White Body */}
        <View style={styles.body}>
        {/* Swipe gesture hints */}
        {!expanded && (
          <Text style={[styles.gestureHint, { color: sparkleGrey }]}>Swipe Up</Text>
        )}
        {expanded && (
          <Text style={[styles.gestureHint, { color: sparkleGrey }]}>Swipe Down</Text>
        )}

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={tab === "ride" ? styles.tabActive : styles.tabInactive}
              onPress={() => setTab("ride")}
            >
              <Text style={tab === "ride" ? styles.tabTextActive : styles.tabTextInactive}>Ride</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tab === "drive" ? styles.tabActive : styles.tabInactive}
              onPress={() => setTab("drive")}
            >
              <Text style={tab === "drive" ? styles.tabTextActive : styles.tabTextInactive}>Drive</Text>
            </TouchableOpacity>
          </View>

          {/* Shared Fields */}
          <Text style={styles.label}>
            {tab === "ride" ? "Find a ride" : "Offer a ride"}
          </Text>
          <Text style={styles.subLabel}>where are you going?</Text>
          <TextInput style={styles.input} 
            placeholder="From" 
            placeholderTextColor="#999999" />
          <TextInput style={styles.input} 
            placeholder="To" 
            placeholderTextColor="#999999"/>

          {/* DateTime Field */}
          <Text style={styles.label}>when?</Text>
          <TextInput
            style={styles.input}
            placeholder="Select date"
            placeholderTextColor="#999999"
            editable={false}
            value={formatDate(date)}
            onPressIn={showDatePicker}
          />

          {/* Seat Picker */}
          <Text style={styles.label}>
            {tab === "ride" ? "Seat needed?" : "Seats offered?"}
          </Text>
          <View style={styles.seatRow}>
            <TouchableOpacity onPress={decrementSeats}>
              <Ionicons name="remove-circle-outline" size={28} color="#f90" />
            </TouchableOpacity>
            <Text style={styles.seatCount}>{seats}</Text>
            <TouchableOpacity onPress={incrementSeats}>
              <Ionicons name="add-circle-outline" size={28} color="#f90" />
            </TouchableOpacity>
          </View>

          {/* Search or Post Button */}
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>
              {tab === "ride" ? "Search" : "Post Ride"}
            </Text>
          </TouchableOpacity>
        </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        minimumDate={new Date()}
        maximumDate={new Date(2100, 0, 1)}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#184080",
  },
  header: {
    backgroundColor: "#184080",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerExpanded: {
    paddingBottom: 40,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  profilePic: {
    padding: 5,
  },
  statsContainer: {
    marginTop: 15,
  },
  statsText: {
    color: "#fff",
    fontSize: 16,
  },
  toggleText: {
    textAlign: "center",
    marginTop: 10,
    color: "#fff",
    textDecorationLine: "underline",
  },
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  gestureHint: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#eee9e1",
    borderRadius: 10,
    marginBottom: 20,
  },
  tabActive: {
    flex: 1,
    backgroundColor: "#184080",
    padding: 10,
    borderRadius: 10,
  },
  tabInactive: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabTextActive: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  tabTextInactive: {
    color: "#555",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  subLabel: {
    color: "#999999",
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#999999",
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  seatCount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchButton: {
    backgroundColor: "#184080",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;

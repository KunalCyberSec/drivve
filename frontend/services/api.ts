import Constants from "expo-constants";
import { Platform } from "react-native";

const LOCAL_API_BASE_URL = (Constants as any).manifest?.extra?.apiBaseUrl || process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

console.log("LOCAL_API_BASE_URL:", LOCAL_API_BASE_URL);

export const sendOtp = async (mobile: string) => {
  try {
    const response = await fetch(`${LOCAL_API_BASE_URL}/api/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.message || "Failed to send OTP" };
    }
    return data;
  } catch (error: any) {
    return { error: error.message || "Network error" };
  }
};

export const sendEmailOtp = async (email: string) => {
  try {
    const response = await fetch(`${LOCAL_API_BASE_URL}/emailapi/send-email-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.detail || "Failed to send email OTP" };
    }
    return data;
  } catch (error: any) {
    return { error: error.message || "Network error" };
  }
};

export const verifyEmailOtp = async (email: string, otp: string) => {
  try {
    const response = await fetch(`${LOCAL_API_BASE_URL}/emailapi/verify-email-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.detail || "Failed to verify email OTP" };
    }
    return data;
  } catch (error: any) {
    return { error: error.message || "Network error" };
  }
};

export const fetchCountries = async (): Promise<string[] | { error: string }> => {
  try {
    const response = await fetch(`${LOCAL_API_BASE_URL}/statecity/countries`, {
      headers: {
        "Accept": "application/json"
      }
    });
    if (!response.ok) {
      const data = await response.json();
      console.error("fetchCountries response error data:", data);
      return { error: data.detail || "Failed to fetch countries" };
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return { error: "Invalid response format" };
  } catch (error: any) {
    console.error("fetchCountries error:", error);
    return { error: error.message || "Network error" };
  }
};

export const fetchStates = async (country: string): Promise<string[] | { error: string }> => {
  try {
    const url = new URL(`${LOCAL_API_BASE_URL}/statecity/states`);
    url.searchParams.append("country", country);
    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json"
      }
    });
    if (!response.ok) {
      const data = await response.json();
      return { error: data.detail || "Failed to fetch states" };
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return { error: "Invalid response format" };
  } catch (error: any) {
    console.error("fetchStates error:", error);
    return { error: error.message || "Network error" };
  }
};

export const fetchCities = async (country: string, state: string): Promise<string[] | { error: string }> => {
  try {
    const url = new URL(`${LOCAL_API_BASE_URL}/statecity/cities`);
    url.searchParams.append("country", country);
    url.searchParams.append("state", state);
    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json"
      }
    });
    if (!response.ok) {
      const data = await response.json();
      return { error: data.detail || "Failed to fetch cities" };
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return { error: "Invalid response format" };
  } catch (error: any) {
    console.error("fetchCities error:", error);
    return { error: error.message || "Network error" };
  }
};

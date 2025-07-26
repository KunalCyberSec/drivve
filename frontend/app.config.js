export default {
  expo: {
    name: "Drivve",
    slug: "drivve-frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    splash: {
      image: "./assets/images/splash.svg",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      eas: {
        projectId: "89d33b96-d7f3-4e50-8bac-98264a3f730c"
      },
      extra: {
        apiBaseUrl: "http://localhost:8000",
        externalApiBaseUrl: "http://192.168.1.3:8000"
      }
    }
  }
};

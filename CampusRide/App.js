import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Home,
  Account,
  Login,
  Signup,
  OnBoardScreen,
  SplashScreenUi,
  Trip,
} from "./screens";
import Welcome from "./navigations/Welcome";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";
import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono";
import { useFonts } from "expo-font";
import { Asset } from "expo-asset";

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

const cacheImages = (images) => {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

const loadResources = async () => {
  const imageAssets = cacheImages([require("./assets/splash2.png")]);
  await Promise.all([...imageAssets]);
};
export default function App() {
  const [isShowSplashScreen, setShowSplashScreen] = useState(true);
  const navigationRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Roboto_400Regular,
    Poppins_400Regular,
    RobotoMono_400Regular,
  });

  useEffect(() => {
    const prepareResources = async () => {
      try {
        await loadResources();
        if (fontsLoaded && !fontError) {
          await SplashScreen.hideAsync();
          setIsReady(true);
        }
      } catch (error) {
        console.warn(error);
      }
    };

    prepareResources();
  }, [fontsLoaded]);

  useEffect(() => {
    setTimeout(() => {
      setShowSplashScreen(false);
    }, 5000);
  }, []);

  if (!isReady) {
    return null;
  }

  if (!isReady || (!fontsLoaded && !fontError)) {
    return (
      <AppLoading
        startAsync={loadResources}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <NavigationContainer ref={navigationRef}>
          <StatusBar style="light" />
          <Stack.Navigator initialRouteName="SplashScreenUi">
            {isShowSplashScreen ? (
              <Stack.Screen
                name="SplashScreenUi"
                component={SplashScreenUi}
                options={{ headerShown: false }}
              />
            ) : (
              <>
                <Stack.Screen
                  name="Welcome"
                  component={Welcome}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Signup"
                  component={Signup}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="OnBoardScreen"
                  component={OnBoardScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Trip"
                  component={Trip}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Account"
                  component={Account}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

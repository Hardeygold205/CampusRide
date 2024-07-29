import React, { useState } from "react";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView } from "react-native";
import axios from "axios";
import Button from "../components/Button";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import PagerView from "react-native-pager-view";

export default function Login() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "email", title: "Email/Username" },
    { key: "phone", title: "Phone Number" },
  ]);

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  const validateEmailOrUsername = (emailOrUsername) => {
    if (!emailOrUsername) {
      return "Email or Username is required";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    } else if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleLogin = async () => {
    const emailError = validateEmailOrUsername(emailOrUsername);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        emailOrUsername: emailError,
        password: passwordError,
      });
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const response = await axios.post("http://172.20.10.2:5005/api/login", {
        emailOrUsername,
        password,
      });
      console.log("Login response:", response.data);
      navigation.replace("OnBoardScreen");
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Internal server error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailOrUsernameChange = (value) => {
    setEmailOrUsername(value);
    const emailError = validateEmailOrUsername(value);
    setErrors((prevErrors) => ({ ...prevErrors, emailOrUsername: emailError }));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const passwordError = validatePassword(value);
    setErrors((prevErrors) => ({ ...prevErrors, password: passwordError }));
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
  };

  const renderEmailOrUsernameLogin = () => (
    <View style={styles.inner}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={emailOrUsername}
          onChangeText={handleEmailOrUsernameChange}
          label="Email or Username"
          mode="outlined"
          activeOutlineColor="#228d5d"
          error={errors.emailOrUsername ? true : false}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          value={password}
          onChangeText={handlePasswordChange}
          label="Password"
          mode="outlined"
          activeOutlineColor="#228d5d"
          secureTextEntry={secureText}
          right={
            <TextInput.Icon
              name={secureText ? "eye-off" : "eye"}
              onPress={togglePasswordVisibility}
            />
          }
          error={errors.password ? true : false}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>
      <Button isLoading={isLoading} onPress={handleLogin} title="Login" />
      <View>
        <Text style={styles.errorText}>{message}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.push("Signup")}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPhoneLogin = () => (
    <View style={styles.inner}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={phone}
          onChangeText={handlePhoneChange}
          label="Phone Number"
          mode="outlined"
          activeOutlineColor="#228d5d"
          error={errors.phone ? true : false}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>
      <Button isLoading={isLoading} onPress={handleLogin} title="Login" />
      <View>
        <Text style={styles.errorText}>{message}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.push("Signup")}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScene = SceneMap({
    email: renderEmailOrUsernameLogin,
    phone: renderPhoneLogin,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Welcome back to CampusRide</Text>
            </View>
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: Dimensions.get("window").width }}
              renderPager={(props) => <PagerView {...props} />} // Add this line to use PagerView
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: "#228d5d" }}
                  style={{ backgroundColor: "white" }}
                  labelStyle={{ color: "black" }}
                />
              )}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 20,
    color: "#888",
  },
  inner: {
    width: "100%",
    gap: 10,
  },
  inputWrapper: {
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 10,
    marginTop: -10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "bold",
  },
  footerLink: {
    fontSize: 16,
    color: "#228d5d",
    marginLeft: 5,
    fontWeight: "bold",
  },
});

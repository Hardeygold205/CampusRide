import React, { useState } from "react";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView } from "react-native";
import axios from "axios";
import Button from "../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as AppleAuthentication from "expo-apple-authentication";

export default function Signup() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const Provider = [
    { key: 1, name: "Google", icon: "google" },
    { key: 2, name: "Facebook", icon: "facebook" },
  ];

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  const validateUsername = (username) => {
    if (!username) {
      return "Username is required";
    } else if (username.length < 3) {
      return "Username must be at least 3 characters";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return "Email address is invalid";
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

  const handleSignup = async () => {
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (usernameError || emailError || passwordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
      });
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const response = await axios.post("http://172.20.10.2:5005/api/signup", {
        username,
        email,
        password,
      });
      console.log("Signup response:", response.data);
      navigation.replace("OnBoardScreen");
    } catch (error) {
      console.error("Signup error:", error);
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

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      navigation.replace("OnBoardScreen");
      console.log("Apple credential:", credential);
    } catch (e) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        console.log("User canceled Apple Sign-In");
        navigation.replace("Signup");
      } else {
        console.error("Apple Sign-In Error:", e);
        setMessage("Failed to sign in with Apple");
      }
    }
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    const usernameError = validateUsername(value);
    setErrors((prevErrors) => ({ ...prevErrors, username: usernameError }));
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    const emailError = validateEmail(value);
    setErrors((prevErrors) => ({ ...prevErrors, email: emailError }));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const passwordError = validatePassword(value);
    setErrors((prevErrors) => ({ ...prevErrors, password: passwordError }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Signup</Text>
              <Text style={styles.subtitle}>Create an account</Text>
            </View>
            <View style={styles.inner}>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={username}
                  onChangeText={handleUsernameChange}
                  label="Username"
                  mode="outlined"
                  activeOutlineColor="#228d5d"
                  error={errors.username ? true : false}
                />
              </View>
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}
              <View style={styles.inputWrapper}>
                <TextInput
                  value={email}
                  onChangeText={handleEmailChange}
                  label="Email"
                  mode="outlined"
                  activeOutlineColor="#228d5d"
                  error={errors.email ? true : false}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
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
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              <Button
                isLoading={isLoading}
                onPress={handleSignup}
                title="Signup"
              />
              <View>
                <Text style={styles.errorText}>{message}</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.push("Login")}>
                  <Text style={styles.footerLink}>Log In</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.providers}>
                {Provider.map((provider) => (
                  <TouchableOpacity
                    key={provider.key}
                    style={styles.providerButton}>
                    <Icon name={provider.icon} size={30} color="#000" />
                    <Text style={styles.providerText}>{provider.name}</Text>
                  </TouchableOpacity>
                ))}
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={
                    AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                  }
                  buttonStyle={
                    AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                  }
                  cornerRadius={5}
                  style={styles.appleButton}
                  onPress={handleAppleSignIn}
                />
              </View>
            </View>
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
    marginTop: -20,
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#888",
  },
  providers: {
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  providerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
  },
  providerText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  appleButton: {
    width: "100%",
    height: 44,
    marginTop: 10,
  },
});

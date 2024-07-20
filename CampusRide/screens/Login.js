import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
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

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const response = await axios.post("http://172.20.10.2:5001/api/login", {
        email,
        password,
      });
      console.log("Login response:", response.data);

      navigation.replace("Home");
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
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        className="flex-1 p-5">
        <View className="flex flex-col justify-center my-auto">
          <View className="space-y-2 ">
            <Text className="text-5xl font-extrabold">Login</Text>
            <Text className="text-2xl text-gray-400">
              Welcome Back to the App
            </Text>
          </View>
          <View clas style={styles.inner}>
            <View className="w-full">
              <TextInput
                value={email}
                onChangeText={handleEmailChange}
                label="Email"
                mode="outlined"
                activeOutlineColor="#228d5d"
                error={errors.email ? true : false}
              />
              {errors.email && (
                <Text className="mb-[-10px]" style={styles.errorText}>
                  {errors.email}
                </Text>
              )}
            </View>
            <View className="w-full">
              <TextInput
                value={password}
                onChangeText={handlePasswordChange}
                label="Password"
                mode="outlined"
                activeOutlineColor="#42a5f5"
                placeholderTextColor={"gray"}
                secureTextEntry={secureText}
                right={
                  <Icon
                    onPress={togglePasswordVisibility}
                    name={secureText ? "eye-off" : "eye"}
                  />
                }
                error={errors.password ? true : false}
              />
              <Icon
                onPress={togglePasswordVisibility}
                name={secureText ? "eye-off" : "eye"}
                size={24}
              />
              {errors.password && (
                <Text className="mb-[-10px]" style={styles.errorText}>
                  {errors.password}
                </Text>
              )}
            </View>
            <Button isLoading={isLoading} onPress={handleLogin} title="Login" />
            <Text style={styles.errorText}>{message}</Text>
            <View className="flex-row items-center space-x-3">
              <Text className="text-xl text-gray-500">
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.push("Signup")}>
                <Text className="text-xl" style={{ color: "#228d5d" }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full items-center flex-row justify-center">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="text-xl text-gray-500 mx-3">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  inner: {
    paddingVertical: 20,
    flex: 1,
    gap: 15,
  },
  textInput: {
    height: 40,
    borderColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 10,
  },
});

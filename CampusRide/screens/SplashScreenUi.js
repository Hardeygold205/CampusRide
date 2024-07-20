import { StyleSheet, View, ImageBackground, Dimensions } from "react-native";
import React, { useState } from "react";
import splash from "../assets/splash2.png"

const SplashScreenUi = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageError = () => {
    console.error("failed to load image");
  };

  return (
    <View style={styles.container} className="">
      <ImageBackground
        onLoad={() => {
          setIsImageLoaded(true);
        }}
        onError={handleImageError}
        style={styles.image}
        source={splash}
      />
    </View>
  );
};

export default SplashScreenUi;

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#228d5d",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "RobotoMono_400Regular",
    fontSize: "55px",
    textTransform: "uppercase",
  },
  image: {
    width: width * 0.87,
    height: width * 0.35,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { DittofeedSdk } from "./sdk";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    (async () => {
      await DittofeedSdk.init({
        writeKey:
          "Basic ZGNlODRiYzctMzBiMi00Y2VjLTgxMGMtNTc3ZjFhYmViODZhOmYxODFhYWRjMWU1ZTllNDY=",
        host: "http://10.0.2.2:3001",
      });
      await DittofeedSdk.identify({
        userId: "123",
        traits: {},
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
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

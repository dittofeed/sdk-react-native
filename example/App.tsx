import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { DittofeedSdk } from "@dittofeed/sdk-react-native";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    (async () => {
      await DittofeedSdk.init({
        writeKey: "Basic abcd",
        host: "http://10.0.2.2j3001",
      });

      DittofeedSdk.identify({
        userId: "123",
        traits: {
          email: "john@email.com",
        },
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

# sdk-react-native

Dittofeed's react native sdk.

## Installation

```bash
# Using Yarn
yarn add @dittofeed/sdk-react-native

# Using NPM
npm install @dittofeed/sdk-react-native
```

## Usage


```javascript
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DittofeedSdk } from "@dittofeed/sdk-react-native";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    (async () => {
      await DittofeedSdk.init({
        writeKey: "Basic abcdefg...",
      });

      // Lets you tie a user to their actions and record traits about them. It
      // includes a unique User ID and any optional traits you know about the
      // user, like their email, name, and more.
      DittofeedSdk.identify({
        userId: "123",
        traits: {
          email: "john@email.com",
          firstName: "John"
        },
      });

      // The track call is how you record any actions your users perform, along
      // with any properties that describe the action.
      DittofeedSdk.track({
        userId: "123",
        event: "Made Purchase",
        properties: {
          itemId: "abc",
        },
      });

      // Lets you record whenever a user sees a screen, the mobile equivalent of
      // page, in your mobile app, along with any properties about the screen.
      DittofeedSdk.screen({
        userId: "123",
        name: "Recipe Screen",
        properties: {
          recipeType: "Soup",
        },
      });

      // Ensures that asynchronously submitted events are flushed synchronously
      // to Dittofeed's API.
      await DittofeedSdk.flush();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>My App</Text>
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
```

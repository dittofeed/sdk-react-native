import notifee, { EventType, Event } from "@notifee/react-native";
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";

export class DittofeedReactNative {
  private static instance: DittofeedReactNative;

  constructor() {
    console.log("DittofeedReactNative constructor");
  }

  static async getInstance(): Promise<DittofeedReactNative> {
    if (!DittofeedReactNative.instance) {
      DittofeedReactNative.instance = new DittofeedReactNative();
      await DittofeedReactNative.instance.init();
    }
    return DittofeedReactNative.instance;
  }

  private async init() {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    // TODO inject overridable logger
    void this.submitToken(token).catch(console.error);
    // TODO allow channel to be overridden
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      visibility: 1,
      importance: 4,
    });
    messaging().onTokenRefresh(this.submitToken);
    notifee.onBackgroundEvent(this.handlBackgroundEvent);
  }

  private async submitToken(token: string): Promise<void> {}

  private async handlBackgroundEvent(event: Event): Promise<void> {}
}

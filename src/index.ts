import notifee, { Event } from "@notifee/react-native";
import type { FirebaseMessagingTypes } from "@react-native-firebase/messaging";

interface DittofeedReactNativeInit {
  messaging: FirebaseMessagingTypes.Module;
}

export class DittofeedReactNative {
  private static instance: DittofeedReactNative;

  constructor() {
    console.log("DittofeedReactNative constructor");
  }

  static async getInstance(
    initParams: DittofeedReactNativeInit
  ): Promise<DittofeedReactNative> {
    if (!DittofeedReactNative.instance) {
      DittofeedReactNative.instance = new DittofeedReactNative();
      await DittofeedReactNative.instance.init(initParams);
    }
    return DittofeedReactNative.instance;
  }

  private async init({ messaging }: DittofeedReactNativeInit) {
    await messaging.registerDeviceForRemoteMessages();
    const token = await messaging.getToken();
    // TODO inject overridable logger
    void this.submitToken(token).catch(console.error);
    // TODO allow channel to be overridden
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      visibility: 1,
      importance: 4,
    });
    messaging.onTokenRefresh(this.submitToken);
    notifee.onBackgroundEvent(this.handlBackgroundEvent);
  }

  private async submitToken(token: string): Promise<void> {
    console.log("submitToken", token);
  }

  private async handlBackgroundEvent(event: Event): Promise<void> {
    console.log("handlBackgroundEvent", event);
  }
}
